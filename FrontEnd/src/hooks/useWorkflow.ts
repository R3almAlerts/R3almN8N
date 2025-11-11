import { useState, useCallback } from 'react';
import { Workflow } from '../types';

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
      const saved = await response.json();
      setWorkflows((prev) => [...prev, saved]);
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
      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  return { workflows, loading, createWorkflow, executeWorkflow };
};