import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); // Service role for server ops

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    // Fetch profile for role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = { ...user, role: profile?.role || 'user' };
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth failed' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};