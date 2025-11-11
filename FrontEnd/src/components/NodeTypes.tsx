import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { WorkflowNode } from '../types';

const CustomNode = ({ data, isConnectable }: { data: WorkflowNode['data'] & { label: string }; isConnectable: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg border-2 border-blue-300"
  >
    <div className="font-bold">{data.label}</div>
    <div className="text-sm opacity-90">{JSON.stringify(data)}</div> {/* Config preview */}
    <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
  </motion.div>
);

// Type-specific variants (expand for unique UIs)
export const CustomNodes = {
  trigger: CustomNode,
  action: CustomNode,
  logic: CustomNode,
  ai: (props: any) => <CustomNode {...props} className="bg-green-500 border-green-300" />, // e.g., AI green
  web3: (props: any) => <CustomNode {...props} className="bg-purple-500 border-purple-300" />, // Web3 purple
};

export default CustomNodes;