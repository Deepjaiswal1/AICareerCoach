"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import TurboNode from './TurboNode';

const nodeTypes = {
    turbo: TurboNode,
};

export default function RoadmapVisualizer({ nodes: initialNodes, edges: initialEdges }: { nodes: any[], edges: any[] }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="w-full h-full bg-[#030712]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="dark-theme-flow"
            >
                <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#1e293b" />
                <Controls className="bg-slate-900 border-slate-800 fill-slate-400" />
                <MiniMap
                    nodeColor="#06b6d4"
                    maskColor="rgba(3, 7, 18, 0.8)"
                    className="bg-[#0B0F19] border border-slate-800 rounded-xl"
                />
            </ReactFlow>
        </div>
    );
}