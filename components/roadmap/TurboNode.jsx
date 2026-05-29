import { Handle, Position } from 'reactflow';
import { ExternalLink, BookOpen } from 'lucide-react';

export function TurboNode({ data }) {
  return (
    <div className="px-5 py-4 shadow-2xl rounded-2xl bg-white border-2 border-indigo-500 min-w-[260px] animate-in fade-in zoom-in duration-500">
      {/* Connector Points */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm tracking-tight">{data.title}</h4>
        </div>
        
        <p className="text-[11px] text-slate-500 leading-relaxed italic">
          {data.description}
        </p>

        {data.link && (
          <a 
            href={data.link} 
            target="_blank" 
            className="mt-2 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-600 transition-colors"
          >
            Study Resource
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500 border-2 border-white" />
    </div>
  );
}