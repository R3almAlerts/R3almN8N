import { Router } from 'express';
import { getWorkflowsCount } from '../models/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const count = await getWorkflowsCount(); // e.g., { total: 5 }
    res.json({
      items: [
        { label: 'Home', href: '/' },
        { label: `Workflows (${count.total})`, href: '/workflows', children: [{ label: 'Active', href: '/active' }] },
        { label: 'Settings', href: '/settings' },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;