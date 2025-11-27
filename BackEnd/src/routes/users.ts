import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AuthRequest } from '../middleware/auth';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

router.use(authMiddleware);

// GET /api/users - List users (admin only)
router.get('/', adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, avatar_url, role, updated_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id - Get single user (self or admin)
router.get('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user?.id !== id && req.user?.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, avatar_url, role, updated_at')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users - Create user (admin only; typically via signup trigger)
router.post('/', adminMiddleware, async (req, res) => {
  const { email, name, role } = req.body;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: req.body.id, email, name, role }) // id from auth.users
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id - Update user (self or admin)
router.put('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  if (req.user?.id !== id && req.user?.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const { name, avatar_url, role } = req.body;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, avatar_url, ...(req.user?.role === 'admin' && { role }) }) // Role update admin-only
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    // Also delete from auth.users if needed (use supabase.auth.admin.deleteUser)
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;