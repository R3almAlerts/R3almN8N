import { useState, Suspense } from 'react';
import useWorkflow from './hooks/useWorkflow';
import type { MenuItem } from './types/menu';
import NavMenu from './components/NavMenu';
import { Plus, Play, Home, Settings, FileText, Workflow as EditorIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSkeleton from './components/SearchSkeleton';
import type { Workflow } from './types';
import EditorPane from './components/EditorPane';

export default function App() {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'creator' | 'editor'>('creator');
  const [selected, setSelected] = useState<Workflow | null>(null);
  const { workflows, loading, createWorkflow, executeWorkflow } = useWorkflow();

  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Workflows', href: '/workflows', icon: FileText, children: [{ label: 'Templates', href: '/templates' }, { label: 'History', href: '/history' }] },
    { label: 'Editor', href: '/editor', icon: EditorIcon },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const user = { name: 'Dev User' };

  const create = async () => {
    if (!name.trim()) return;
    const wf = await createWorkflow(name.trim());
    if (wf) {
      setSelected(wf);
      setTab('editor');
      setName('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <NavMenu items={menuItems} user={user} onSearch={setSearch} loading={loading} />
      <Suspense fallback={<SearchSkeleton />}>
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto p-8">
          {tab === 'creator' ? (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Create Workflow</h2>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Workflow name..."
                  className="w-full p-3 border rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={create}
                  disabled={loading || !name.trim()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span>Create & Edit</span>
                </button>
              </div>

              {workflows.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Your Workflows</h3>
                  <ul className="space-y-3">
                    {workflows
                      .filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
                      .map((w) => (
                        <li key={w.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                          <span className="font-medium">{w.name}</span>
                          <div className="flex space-x-2">
                            <button onClick={() => { setSelected(w); setTab('editor'); }} className="text-blue-600 hover:underline text-sm">
                              Edit
                            </button>
                            <button
                              onClick={() => executeWorkflow(w.id, { sample: 'test' })}
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
          ) : (
            selected && <EditorPane workflow={selected} onSave={setSelected} onTest={executeWorkflow} />
          )}

          {tab === 'editor' && (
            <button onClick={() => setTab('creator')} className="mt-6 text-blue-600 hover:underline">
              ← Back to Creator
            </button>
          )}
        </motion.main>
      </Suspense>
    </div>
  );
}