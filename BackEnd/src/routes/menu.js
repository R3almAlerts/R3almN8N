"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../models/supabase"); // Stub: Count active workflows
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const count = await (0, supabase_1.getWorkflowsCount)(); // e.g., { total: 5 }
        res.json({
            items: [
                { label: 'Home', href: '/' },
                { label: `Workflows (${count.total})`, href: '/workflows', children: [{ label: 'Active', href: '/active' }] },
                { label: 'Settings', href: '/settings' },
            ],
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=menu.js.map