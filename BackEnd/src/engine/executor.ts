import { Workflow, WorkflowNode, ExecutionContext } from '../types';
import { Job, Queue } from 'bullmq';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const workflowQueue = new Queue('workflows', { connection: redis });

export class WorkflowExecutor {
  static async execute(workflow: Workflow, input: Record<string, any>): Promise<ExecutionContext> {
    const context: ExecutionContext = { input, output: {} };

    // Sort nodes topologically (simple sequential for MVP; add DAG lib later)
    const sortedNodes = this.sortNodes(workflow);

    for (const node of sortedNodes) {
      try {
        context.output[node.id] = await this.runNode(node, context);
      } catch (err) {
        context.error = (err as Error).message;
        await this.handleError(node, context);
        break; // Or branch to error node
      }
    }

    return context;
  }

  private static async runNode(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    switch (node.type) {
      case 'trigger':
        return { triggeredAt: new Date().toISOString() }; // e.g., CRON stub
      case 'action':
        // HTTP/email stub - expand to integrations
        return { status: 'success', data: node.data };
      case 'logic':
        // If/else stub
        return node.data.condition ? 'true' : 'false';
      case 'ai':
        // LangChain stub - call OpenAI later
        return { response: `AI output for ${node.data.prompt}` };
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private static sortNodes(workflow: Workflow): WorkflowNode[] {
    // Basic topo sort (assume linear for MVP)
    return workflow.nodes.sort((a, b) => a.position?.y - b.position?.y || 0);
  }

  private static async handleError(node: WorkflowNode, context: ExecutionContext): Promise<void> {
    // Retry logic: Up to 3x via BullMQ
    const job = await workflowQueue.add('retry', { node, context }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    console.log(`Retry job queued: ${job.id}`);
  }
}

// Queue processor (runs in worker mode)
workflowQueue.process('workflows', async (job: Job) => {
  const { workflowId, input } = job.data;
  // Fetch from Supabase, execute
  // Stub for now
  return { status: 'completed' };
});