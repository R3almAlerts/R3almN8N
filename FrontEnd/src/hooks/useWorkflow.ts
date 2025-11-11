import { useState, useCallback } from 'react';

/**
 * Custom hook for workflow CRUD/execution.
 * @returns {Object} workflows array, loading state, create/execute functions.
 */
export const useWorkflow = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const createWorkflow = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const newWorkflow = {
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
      return await response.json();
    } catch (err) {
      console.error('Execute workflow failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { workflows, loading, createWorkflow, executeWorkflow };
};