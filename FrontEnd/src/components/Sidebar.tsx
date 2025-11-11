import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Code, Brain, Bitcoin } from 'lucide-react';
import type { WorkflowNode } from '../types';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: WorkflowNode['type']) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: WorkflowNode['type']) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-200 dark:bg-gray-700 p-4 overflow-y-auto md:w-64 fixed left-0 top-0 h-full z-10 shadow-lg"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Nodes</h2>
      <div className="space-y-2">
        {[
          { type: 'trigger' as const, label: 'Trigger', icon: Clock },
          { type: 'action' as const, label: 'Action', icon: Zap },
          { type: 'logic' as const, label: 'Logic', icon: Code },
          { type: 'ai' as const, label: 'AI', icon: Brain },
          { type: 'web3' as const, label: 'Web3', icon: Bitcoin },
        ].map(({ type, label, icon: Icon }) => (
          <motion.div
            key={type}
            draggable
            onDragStart={(event) => handleDragStart(event, type)}
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-3 bg-white dark:bg-gray-800 rounded cursor-move shadow hover:shadow-md transition-shadow"
          >
            <Icon size={20} className="mr-2 text-blue-600" />
            <span>{label}</span>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;