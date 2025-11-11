// Shared types for workflows (sync'd with backend for API/Supabase)

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'ai' | 'web3'; // Added 'web3' for ecosystem
  name: string;
  position?: { x: number; y: number }; // For React Flow positioning
  data: Record<string, any>; // e.g., { prompt: '...', cron: '0 * * * *' }
  outputs?: string[]; // Connection targets
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[]; // Edges for graph
  active: boolean;
}

// Additional shared types (expand as needed)
export interface ExecutionContext {
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
}