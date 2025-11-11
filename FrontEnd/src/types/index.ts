export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[];
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'ai' | 'web3';
  name: string;
  data: Record<string, any>;
  position?: { x: number; y: number };
}