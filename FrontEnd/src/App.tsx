import { useState, Suspense } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import type { MenuItem } from './types/menu';
import NavMenu from './components/NavMenu';
import { Plus, Play, Home, Settings, FileText, Workflow as EditorIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSkeleton from './components/SearchSkeleton';
import type { Workflow } from './types';
import EditorPane from './components/EditorPane';

function App() {
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'creator' | 'editor'>('creator');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const { workflows, loading, createWorkflow, executeWorkflow } = useWorkflow();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreate = async () => {
    if (name) {
      const newWf = await createWorkflow(name);
      setSelectedWorkflow(newWf);
      setActiveTab('editor');
      setName('');
    }
  };

  const handleSelectForEdit = (wf: Workflow) => {
    setSelectedWorkflow(wf);
    setActiveTab('editor');
    setSelectedId(wf.id);
  };

  const handleSaveFromEditor = (updated: Workflow) => {
    // Stub: Update via API/hook (expand to put /workflows/:id)
    console.log('Saved updated workflow:', updated);
    setSelectedWorkflow(updated);
  };

  const handleTestFromEditor = (id: string) => {
    executeWorkflow(id, { sample: 'input' });
  };

  // Sample menu data
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
    { label: 'Editor', href: '/editor', icon: EditorIcon },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const user = { name: 'Dev User', avatar: undefined };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans">
      <NavMenu items={menuItems} user={user} onSearch={handleSearch} loading={loading} />
      <Suspense fallback={<SearchSkeleton />}>
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mt-8">
          {activeTab === 'creator' ? (
            <>
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
                  <span>Create & Edit</span>
                </button>
              </div>
              {workflows.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Workflows</h3>
                  <ul className="space-y-2">
                    {workflows
                      .filter((wf: Workflow) => wf.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((wf: Workflow) => (
                        <li key={wf.id} className="flex justify-between items-center p-2 border rounded">
                          <span>{wf.name}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => handleSelectForEdit(wf)} className="text-blue-600 hover:underline">
                              Edit
                            </button>
                            <button
                              onClick={() => executeWorkflow(wf.id, { sample: 'input' })}
                              className="flex items-center space-x-1 text-green-600 hover:underline"
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
            </>
          ) : (
            selectedWorkflow && (
              <EditorPane
                workflow={selectedWorkflow}
                onSave={handleSaveFromEditor}
                onTest={handleTestFromEditor}
              />
            )
          )}
          {activeTab === 'editor' && (
            <button onClick={() => setActiveTab('creator')} className="mt-4 text-blue-600 hover:underline">
              Back to Creator
            </button>
          )}
        </motion.main>
      </Suspense>
    </div>
  );
}

export default App;