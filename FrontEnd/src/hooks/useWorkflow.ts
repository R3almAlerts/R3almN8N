import { useState, useEffect } from 'react';
import type { Workflow } from '../types';

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Welcome Flow',
    nodes: [],
    connections: [],
  },
];

export default function useWorkflow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWorkflows(mockWorkflows);
  }, []);

  const createWorkflow = async (name: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const newWf: Workflow = {
      id: Date.now().toString(),
      name,
      nodes: [],
      connections: [],
    };
    setWorkflows((prev) => [...prev, newWf]);
    setLoading(false);
    return newWf;
  };

  const executeWorkflow = async (id: string, input: any) => {
    console.log('Executing', id, input);
  };

  return { workflows, loading, createWorkflow, executeWorkflow };
}