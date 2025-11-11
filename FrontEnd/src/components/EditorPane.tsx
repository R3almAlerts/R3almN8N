import React, { memo, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { CustomNodes } from './NodeTypes';
import type { Workflow } from '../types';

interface Props {
  workflow: Workflow;
  onSave: (w: Workflow) => void;
  onTest: (id: string) => void;
}

const EditorPane: React.FC<Props> = memo(({ workflow, onSave, onTest }) => {
  const [nodes, , onNodesChange] = useNodesState(
    workflow.nodes.map((n) => ({ ...n, type: n.type, data: { label: n.name, ...n.data }, position: n.position ?? { x: 0, y: 0 } }))
  );
  const [edges, , onEdgesChange] = useEdgesState(
    workflow.connections.map((c) => ({ id: `${c.from}-${c.to}`, source: c.from, target: c.to }))
  );

  const onSaveWorkflow = useCallback(() => {
    const updated: Workflow = {
      ...workflow,
      nodes: nodes as any,
      connections: edges.map((e) => ({ from: e.source, to: e.target })),
    };
    onSave(updated);
  }, [workflow, nodes, edges, onSave]);

  const handleDragStart = useCallback((e: React.DragEvent, type: any) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar onDragStart={handleDragStart} />
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={CustomNodes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onSaveWorkflow}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Workflow
        </motion.button>
      </div>
    </motion.div>
  );
});

EditorPane.displayName = 'EditorPane';
export default EditorPane;