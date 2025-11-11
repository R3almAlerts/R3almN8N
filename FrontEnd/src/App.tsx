import { useState, Suspense } from 'react';
import useWorkflow from './hooks/useWorkflow';               // <-- .tsx removed
import type { MenuItem } from './types/menu';                // <-- type-only import
import NavMenu from './components/NavMenu';                 // <-- .tsx removed
import {
  Plus,
  Play,
  Home,
  Settings,
  FileText,
  Workflow as EditorIcon,
} from 'lucide-react';
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

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const newWf = await createWorkflow(name.trim());
    if (newWf) {
      setSelectedWorkflow(newWf);
      setSelectedId(newWf.id);
      setActiveTab('editor');
      setName('');
    }
  };

  const handleSelectForEdit = (wf: Workflow) => {
    setSelectedWorkflow(wf);
    setSelectedId(wf.id);
    setActiveTab('editor');
  };

  const handleSaveFromEditor = (updated: Workflow) => {
    setSelectedWorkflow(updated);
  };

  const handleTestFromEditor = (id: string) => {
    executeWorkflow(id, { sample: 'input' });
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <NavMenu items={menuItems} user={user} onSearch={handleSearch} loading={loading} />
      <Suspense fallback={<SearchSkeleton />}>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto p-8"
        >
          {/* ---------- Creator Tab ---------- */}
          {activeTab === 'creator' && (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Create Workflow</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter workflow name..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCreate}
                  disabled={loading || !name.trim()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <Plus size={20} />
                  <span>Create &amp; Edit</span>
                </button>
              </div>

              {workflows.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Your Workflows</h3>
                  <ul className="space-y-3">
                    {workflows
                      .filter((wf) =>
                        wf.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((wf) => (
                        <li
                          key={wf.id}
                          className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <span className="font-medium">{wf.name}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSelectForEdit(wf)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => executeWorkflow(wf.id, { sample: 'test' })}
                              disabled={loading}
                              className="flex items-center space-x-1 text-green-600 hover:underline text-sm disabled:opacity-50"
                            >
                              <Play size={14} />
                              <span>Run</span>
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ---------- Editor Tab ---------- */}
          {activeTab === 'editor' && selectedWorkflow && (
            <EditorPane
              workflow={selectedWorkflow}
              onSave={handleSaveFromEditor}
              onTest={handleTestFromEditor}
            />
          )}

          {activeTab === 'editor' && (
            <button
              onClick={() => setActiveTab('creator')}
              className="mt-6 text-blue-600 hover:underline"
            >
              ← Back to Creator
            </button>
          )}
        </motion.main>
      </Suspense>
    </div>
  );
}

export default App;