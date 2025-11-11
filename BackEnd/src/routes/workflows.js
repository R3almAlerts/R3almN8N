"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowsCount = getWorkflowsCount;
const express_1 = require("express");
const executor_1 = require("../engine/executor");
const supabase_1 = require("../models/supabase");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const workflow = req.body;
        const saved = await (0, supabase_1.saveWorkflow)(workflow);
        res.json(saved);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/:id/execute', async (req, res) => {
    try {
        const { id } = req.params;
        const input = req.body.input || {};
        const workflow = await (0, supabase_1.getWorkflow)(id);
        const result = await executor_1.WorkflowExecutor.execute(workflow, input);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
async function getWorkflowsCount() {
    const { count, error } = await supabase.from('workflows').select('*', { count: 'exact', head: true });
    if (error)
        throw error;
    return { total: count || 0 };
}
exports.default = router;
//# sourceMappingURL=workflows.js.map