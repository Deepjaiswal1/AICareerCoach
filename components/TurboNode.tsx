import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Rocket, ExternalLink } from 'lucide-react';

export default memo(({ data }: any) => {
    return (
        <div className="bg-[#0B0F19]/90 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-5 min-w-[300px] max-w-[350px] shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all duration-300">

            {/* Top Handle (Incoming) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-4 h-4 bg-[#0B0F19] border-2 border-cyan-400"
            />

            <div className="flex items-start gap-4 mb-3">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Rocket className="text-cyan-400" size={20} />
                </div>
                <div>
                    <h3 className="font-black text-white text-lg tracking-tight leading-tight">{data.title}</h3>
                </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {data.description}
            </p>

            {data.link && (
                <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-2 rounded-lg border border-cyan-500/20 transition-colors"
                >
                    <ExternalLink size={14} /> View Resource
                </a>
            )}

            {/* Bottom Handle (Outgoing) */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-4 h-4 bg-cyan-400 border-2 border-[#0B0F19]"
            />
        </div>
    );
});