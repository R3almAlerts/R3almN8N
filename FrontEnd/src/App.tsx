import { useState } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import { Plus, Play } from 'lucide-react'; // Icons for pro feel
import { motion } from 'framer-motion'; // Subtle anims

function App() {
  const [name, setName] = useState('');
  const { workflows, loading, createWorkflow, executeWorkflow } = useWorkflow();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCreate = () => {
    if (name) createWorkflow(name);
    setName('');
  };

  const handleExecute = async () => {
    if (!selectedId) return;
    const result = await executeWorkflow(selectedId, { sample: 'input' });
    console.log('Execution Result:', result); // Stub - add toast later
    alert(`Executed! Output: ${JSON.stringify(result.output)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 font-sans">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workflow Tool</h1>
        {/* Pro Nav Stub - Full impl next */}
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-blue-600 hover:underline">Home</a>
          <div className="relative group">
            <a href="#" className="flex items-center space-x-1">Workflows</a>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded-md p-2">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700">Create</a>
            </div>
          </div>
        </nav>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto"
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
            <h3 className="text-lg font-semibold mb-4">Workflows</h3>
            <ul className="space-y-2">
              {workflows.map((wf) => (
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
    </div>
  );
}

export default App;