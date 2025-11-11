import React, { memo, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, useReactFlow, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Core styles
import { motion } from 'framer-motion';
import Sidebar from './Sidebar'; // Node palette
import type { Workflow, WorkflowNode } from '../types'; // Types
import CustomNodes from './NodeTypes'; // Custom renders

interface EditorPaneProps {
  workflow: Workflow;
  onSave: (updated: Workflow) => void;
  onTest: (id: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = memo(({ workflow, onSave, onTest }) => {
  const reactFlowInstance = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(workflow.nodes.map(node => ({ ...node, type: node.type, data: { ...node.data, label: node.name }, position: node.position || { x: 0, y: 0 } }))); // Default position, use WorkflowNode
  const [edges, , onEdgesChange] = useEdgesState(workflow.connections.map(conn => ({ id: `${conn.from}-${conn.to}`, source: conn.from, target: conn.to })));

  const onConnect = useCallback((params: any) => {
    // Stub: setEdges((eds) => addEdge(params, eds)); // Add if needed
  }, []);

  const onSaveWorkflow = useCallback(() => {
    const updated: Workflow = {
      ...workflow,
      nodes, // Typed as Node[], but map back to WorkflowNode if needed
      connections: edges.map(edge => ({ from: edge.source, to: edge.target })),
    };
    onSave(updated);
  }, [workflow, nodes, edges, onSave]);

  const onNodeClick = useCallback((_: any, node: any) => { // Unused event, typed as any for stub
    console.log('Selected node:', node); // Debug: Step-through stub
    onTest(workflow.id); // Trigger execute on click (expand to partial run)
  }, [workflow.id, onTest]);

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: WorkflowNode['type']) => {
    event.dataTransfer.setData('application/reactflow', nodeType); // Stub for drag
    event.dataTransfer.effectAllowed = 'move';
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
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={CustomNodes}
          fitView
          className="bg-white dark:bg-gray-800 rounded-lg shadow-inner"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onSaveWorkflow}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Workflow
        </motion.button>
      </div>
    </motion.div>
  );
});

EditorPane.displayName = 'EditorPane';

export default EditorPane;