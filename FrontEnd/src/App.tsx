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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Debounce search (stub - filter workflows later)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // onSearch prop to NavMenu
  };

  const handleCreate = () => {
    if (name) createWorkflow(name);
    setName('');
  };

  const handleExecute = async () => {
    if (!selectedId) return;
    const result = await executeWorkflow(selectedId, { sample: 'input' });
    console.log('Execution Result:', result);
    alert(`Executed! Output: ${JSON.stringify(result.output)}`);
  };

  // Sample menu data (dynamic via API later)
  const menuItems: MenuItem[] = [
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans">
      {/* Nav Integration */}
      <NavMenu
        items={menuItems}
        user={user}
        onSearch={handleSearch}
        loading={loading}
      />

      <Suspense fallback={<SearchSkeleton />}>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md mx-auto mt-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Workflow</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workflow Name"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleCreate}
              disabled={loading || !name}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={20} />
              <span>Create</span>
            </button>
          </div>

          {workflows.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Workflows {searchQuery && `(Filtered: ${searchQuery})`}
              </h3>
              <ul className="space-y-2">
                {workflows
                  .filter((wf) => wf.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((wf) => (
                    <li key={wf.id} className="flex justify-between items-center p-2 border rounded">
                      <span>{wf.name}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedId(wf.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Select
                        </button>
                        <button
                          onClick={handleExecute}
                          disabled={!selectedId || selectedId !== wf.id || loading}
                          className="flex items-center space-x-1 text-green-600 hover:underline disabled:opacity-50"
                        >
                          <Play size={16} />
                          <span>Run</span>
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </motion.main>
      </Suspense>
    </div>
  );
}

export default App;