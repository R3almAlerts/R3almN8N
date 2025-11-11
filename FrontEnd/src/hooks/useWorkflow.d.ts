import { Workflow, ExecutionContext } from '../types/index.ts';
export declare const useWorkflow: () => {
    workflows: Workflow[];
    loading: boolean;
    createWorkflow: (name: string) => Promise<any>;
    executeWorkflow: (id: string, input?: Record<string, any>) => Promise<ExecutionContext>;
};
//# sourceMappingURL=useWorkflow.d.ts.map