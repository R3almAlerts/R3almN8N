"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkflow = saveWorkflow;
exports.getWorkflow = getWorkflow;
const supabase_js_1 = require("@supabase/supabase-js");
const types_1 = require("../types");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function saveWorkflow(workflow) {
    const { data, error } = await supabase
        .from('workflows')
        .insert([workflow])
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function getWorkflow(id) {
    const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single();
    if (error)
        throw error;
    return data;
}
// Init DB (run once: supabase gen types typescript --local > src/types/supabase.ts for full types)
//# sourceMappingURL=supabase.js.map