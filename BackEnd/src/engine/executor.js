"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutor = void 0;
const types_1 = require("../types");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
const workflowQueue = new bullmq_1.Queue('workflows', { connection: redis });
class WorkflowExecutor {
    static async execute(workflow, input) {
        const context = { input, output: {} };
        // Sort nodes topologically (simple sequential for MVP; add DAG lib later)
        const sortedNodes = this.sortNodes(workflow);
        for (const node of sortedNodes) {
            try {
                context.output[node.id] = await this.runNode(node, context);
            }
            catch (err) {
                context.error = err.message;
                await this.handleError(node, context);
                break; // Or branch to error node
            }
        }
        return context;
    }
    static async runNode(node, context) {
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
    static sortNodes(workflow) {
        // Basic topo sort (assume linear for MVP)
        return workflow.nodes.sort((a, b) => a.position?.y - b.position?.y || 0);
    }
    static async handleError(node, context) {
        // Retry logic: Up to 3x via BullMQ
        const job = await workflowQueue.add('retry', { node, context }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
        console.log(`Retry job queued: ${job.id}`);
    }
}
exports.WorkflowExecutor = WorkflowExecutor;
// Queue processor (runs in worker mode)
workflowQueue.process('workflows', async (job) => {
    const { workflowId, input } = job.data;
    // Fetch from Supabase, execute
    // Stub for now
    return { status: 'completed' };
});
//# sourceMappingURL=executor.js.map