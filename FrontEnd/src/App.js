import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, Suspense } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import NavMenu, { MenuItem } from './components/NavMenu'; // New import
import { Plus, Play, Home, Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSkeleton from './components/SearchSkeleton'; // For loading
function App() {
    const [name, setName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { workflows, loading, createWorkflow, executeWorkflow } = useWorkflow();
    const [selectedId, setSelectedId] = useState(null);
    // Debounce search (stub - filter workflows later)
    const handleSearch = (query) => {
        setSearchQuery(query);
        // onSearch prop to NavMenu
    };
    const handleCreate = () => {
        if (name)
            createWorkflow(name);
        setName('');
    };
    const handleExecute = async () => {
        if (!selectedId)
            return;
        const result = await executeWorkflow(selectedId, { sample: 'input' });
        console.log('Execution Result:', result);
        alert(`Executed! Output: ${JSON.stringify(result.output)}`);
    };
    // Sample menu data (dynamic via API later)
    const menuItems = [
        { label: 'Home', href: '/', icon: Home },
        {
            label: 'Workflows',
            href: '/workflows',
            icon: FileText,
            children: [
                { label: 'Templates', href: '/templates' },
                { label: 'History', href: '/history' },
            ],
        },
        { label: 'Settings', href: '/settings', icon: Settings },
    ];
    const user = { name: 'Dev User', avatar: undefined }; // From auth later (Supabase)
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans", children: [_jsx(NavMenu, { items: menuItems, user: user, onSearch: handleSearch, loading: loading }), _jsx(Suspense, { fallback: _jsx(SearchSkeleton, {}), children: _jsxs(motion.main, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-md mx-auto mt-8", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Create Workflow" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Workflow Name", className: "w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white" }), _jsxs("button", { onClick: handleCreate, disabled: loading || !name, className: "flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50", children: [_jsx(Plus, { size: 20 }), _jsx("span", { children: "Create" })] })] }), workflows.length > 0 && (_jsxs("div", { className: "mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4", children: ["Workflows ", searchQuery && `(Filtered: ${searchQuery})`] }), _jsx("ul", { className: "space-y-2", children: workflows
                                        .filter((wf) => wf.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((wf) => (_jsxs("li", { className: "flex justify-between items-center p-2 border rounded", children: [_jsx("span", { children: wf.name }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setSelectedId(wf.id), className: "text-blue-600 hover:underline", children: "Select" }), _jsxs("button", { onClick: handleExecute, disabled: !selectedId || selectedId !== wf.id || loading, className: "flex items-center space-x-1 text-green-600 hover:underline disabled:opacity-50", children: [_jsx(Play, { size: 16 }), _jsx("span", { children: "Run" })] })] })] }, wf.id))) })] }))] }) })] }));
}
export default App;
//# sourceMappingURL=App.js.map