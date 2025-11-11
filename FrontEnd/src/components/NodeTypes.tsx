import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import AiNodeConfigModal from './AiNodeConfigModal';
import type { WorkflowNode } from '../types';

const Base = ({ data, isConnectable }: { data: any; isConnectable: boolean }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg">
    <div className="font-bold">{data.label}</div>
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
  </motion.div>
);

export const CustomNodes = {
  trigger: Base,
  action: Base,
  logic: Base,
  web3: (props: any) => <Base {...props} className="bg-purple-500" />,
  ai: ({ data, isConnectable, id }: any) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded shadow-lg cursor-pointer"
        >
          <div className="font-bold">{data.label}</div>
          <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
          <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        </motion.div>
        <AiNodeConfigModal isOpen={open} node={{ id, type: 'ai', name: data.label, data }} onClose={() => setOpen(false)} onSave={console.log} />
      </>
    );
  },
};