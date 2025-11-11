import { useState, useCallback } from 'react';

// Inline types to avoid bundling issues (sync'd with ../types/index.ts)
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'ai' | 'web3';
  name: string;
  position?: { x: number; y: number };
  data: Record<string, any>;
  outputs?: string[];
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[];
  active: boolean;
}

interface ExecutionContext {
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
}

export const useWorkflow = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  const createWorkflow = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const newWorkflow: Workflow = {
        id: crypto.randomUUID(),
        name,
        nodes: [],
        connections: [],
        active: true,
      };
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkflow),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const saved = await response.json();
      setWorkflows((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('Create workflow failed:', err);
      throw err; // Re-throw for UI handling (e.g., toast)
    } finally {
      setLoading(false);
    }
  }, []);

  const executeWorkflow = useCallback(async (id: string, input?: Record<string, any>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json() as ExecutionContext;
    } catch (err) {
      console.error('Execute workflow failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { workflows, loading, createWorkflow, executeWorkflow };
};