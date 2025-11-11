export interface WorkflowNode {
    id: string;
    type: 'trigger' | 'action' | 'logic' | 'ai';
    name: string;
    position?: {
        x: number;
        y: number;
    };
    data: Record<string, any>;
    outputs?: string[];
}
export interface Workflow {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    connections: {
        from: string;
        to: string;
    }[];
    active: boolean;
}
export interface ExecutionContext {
    input: Record<string, any>;
    output: Record<string, any>;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map