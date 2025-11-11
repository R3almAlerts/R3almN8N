import type { Workflow, WorkflowNode, ExecutionContext } from '../types/index.js';
import { Job, Queue } from 'bullmq';
import Redis from 'ioredis';
import OpenAI from 'openai'; // New: LangChain/OpenAI stub (npm i openai)

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const workflowQueue = new Queue('workflows', { connection: redis });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Env stub

export class WorkflowExecutor {
  static async execute(workflow: Workflow, input: Record<string, any>): Promise<ExecutionContext> {
    const context: ExecutionContext = { input, output: {} };

    const sortedNodes = this.sortNodes(workflow);

    for (const node of sortedNodes) {
      try {
        context.output[node.id] = await this.runNode(node, context);
      } catch (err) {
        context.error = (err as Error).message;
        await this.handleError(node, context);
        break;
      }
    }

    return context;
  }

  private static async runNode(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    switch (node.type) {
      case 'trigger':
        return { triggeredAt: new Date().toISOString() };
      case 'action':
        return { status: 'success', data: node.data };
      case 'logic':
        return node.data.condition ? 'true' : 'false';
      case 'ai':
        // LangChain/OpenAI stub - templating w/ {{input}}
        const prompt = node.data.prompt.replace('{{input}}', JSON.stringify(context.input));
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        });
        return { response: completion.choices[0]?.message?.content || 'No response' };
      case 'web3':
        return { txHash: '0xstub' };
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private static sortNodes(workflow: Workflow): WorkflowNode[] {
    return workflow.nodes.sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0));
  }

  private static async handleError(node: WorkflowNode, context: ExecutionContext): Promise<void> {
    const job = await workflowQueue.add('retry', { node, context }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    console.log(`Retry job queued: ${job.id}`);
  }
}

// Queue processor
workflowQueue.process('workflows', async (job: Job) => {
  const { workflowId, input } = job.data;
  // Fetch from Supabase, execute
  return { status: 'completed' };
});