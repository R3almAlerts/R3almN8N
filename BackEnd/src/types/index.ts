export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'ai';
  name: string;
  position?: { x: number; y: number }; // For visual editor
  data: Record<string, any>; // e.g., { prompt: '...' } for AI
  outputs?: string[]; // Connections
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[]; // Edges
  active: boolean;
}

export interface ExecutionContext {
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
}