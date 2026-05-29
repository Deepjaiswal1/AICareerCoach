
"use client";

import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { TurboNode } from './TurboNode';

const nodeTypes = { turbo: TurboNode };

export default function RoadmapVisualizer({ initialNodes, initialEdges, onNodeSelect }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect(node.data)}
        fitView
        fitViewOptions={{ padding: 0.4 }}
      >
        {/* Using a darker grid point for easier navigation */}
        <Background color="#000000" gap={25} variant="dots" opacity={0.15} />
        
        {/* Styled Controls */}
        <Controls 
          showInteractive={false} 
          className="bg-black border-none shadow-2xl rounded-lg overflow-hidden" 
        />
      </ReactFlow>

      {/* High Visibility Navigation Legend */}
      <div className="relative top-4 left-4 z-50">
        <div className="bg-black text-white px-4 py-2 rounded-xl shadow-xl flex flex-col gap-0.5 border border-slate-800">
           <span className="text-[10px] font-bold uppercase tracking-tighter text-indigo-400">Navigation Active</span>
           <span className="text-[11px] opacity-80">Hold to drag • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}