import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Code, Brain, Bitcoin } from 'lucide-react';
import type { WorkflowNode } from '../types';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: WorkflowNode['type']) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const handle = useCallback((e: React.DragEvent, type: WorkflowNode['type']) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} className="w-64 bg-gray-100 dark:bg-gray-800 p-4 h-full shadow-lg">
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
            onDragStart={(e) => handle(e, type)}
            whileHover={{ scale: 1.03 }}
            className="flex items-center p-3 bg-white dark:bg-gray-700 rounded cursor-move shadow hover:shadow-md"
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