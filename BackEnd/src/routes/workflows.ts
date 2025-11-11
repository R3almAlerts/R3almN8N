import { Router } from 'express';
import { WorkflowExecutor } from '../engine/executor.js';
import { saveWorkflow, getWorkflow } from '../models/supabase.js';
import type { Workflow } from '../types/index.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const workflow: Workflow = req.body;
    const saved = await saveWorkflow(workflow);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const input = req.body.input || {};
    const workflow = await getWorkflow(id);
    const result = await WorkflowExecutor.execute(workflow, input);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;