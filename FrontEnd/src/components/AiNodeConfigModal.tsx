import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Save, X } from 'lucide-react';
import type { WorkflowNode } from '../types';

interface AiNodeConfigModalProps {
  isOpen: boolean;
  node: WorkflowNode | null;
  onClose: () => void;
  onSave: (updatedData: WorkflowNode['data']) => void;
}

const AiNodeConfigModal: React.FC<AiNodeConfigModalProps> = ({ isOpen, node, onClose, onSave }) => {
  const [prompt, setPrompt] = useState(node?.data.prompt || '');

  if (!isOpen || !node) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return alert('Prompt required'); // Stub: Swap to toast lib later
    onSave({ prompt });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="mr-2 text-blue-600" size={20} />
                AI Node Config
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Prompt (use {{input}} for context)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Summarize the following: {{input}}"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white resize-vertical min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiNodeConfigModal;