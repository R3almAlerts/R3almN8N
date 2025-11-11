import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { WorkflowNode } from '../types';
import AiNodeConfigModal from './AiNodeConfigModal'; // New import

const BaseNode = ({ data, isConnectable }: { data: WorkflowNode['data'] & { label: string }; isConnectable: boolean }) => (
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

// Type-specific variants
export const CustomNodes = {
  trigger: BaseNode,
  action: BaseNode,
  logic: BaseNode,
  web3: (props: any) => <BaseNode {...props} className="bg-purple-500 border-purple-300" />, // Web3 purple
  ai: ({ data, isConnectable, id }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded shadow-lg border-2 border-green-300 cursor-pointer"
        >
          <div className="font-bold">{data.label}</div>
          <div className="text-sm opacity-90">Prompt: {data.prompt?.substring(0, 30)}...</div>
          <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
          <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
        </motion.div>
        <AiNodeConfigModal
          isOpen={isModalOpen}
          node={{ id, type: 'ai', name: data.label, data } as WorkflowNode}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedData) => {
            // Stub: Update node via React Flow setNodes (expand to global state)
            console.log('Updated AI data:', updatedData);
          }}
        />
      </>
    );
  },
};

export default CustomNodes;