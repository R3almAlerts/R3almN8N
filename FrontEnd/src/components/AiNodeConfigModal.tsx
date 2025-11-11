import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Save, X } from 'lucide-react';
import type { WorkflowNode } from '../types';

interface Props {
  isOpen: boolean;
  node: WorkflowNode | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AiNodeConfigModal: React.FC<Props> = ({ isOpen, node, onClose, onSave }) => {
  const [prompt, setPrompt] = useState(node?.data.prompt || '');

  if (!isOpen || !node) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="mr-2 text-blue-600" size={20} />
                AI Node Config
              </h3>
              <button onClick={onClose}><X size={20} /></button>
            </div>
            <form onSubmit={submit}>
              <label className="block text-sm font-medium mb-2">
                Prompt (use {{`{{input}}`}} for context)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Summarize the following: {{input}}"
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white min-h-[100px] resize-y"
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancel</button>
                <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded">
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