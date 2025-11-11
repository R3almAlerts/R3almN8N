import { Workflow, ExecutionContext } from '../types';
export declare class WorkflowExecutor {
    static execute(workflow: Workflow, input: Record<string, any>): Promise<ExecutionContext>;
    private static runNode;
    private static sortNodes;
    private static handleError;
}
//# sourceMappingURL=executor.d.ts.map