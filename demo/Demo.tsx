import { useState } from 'react';

export default function PipelineBuilderDemo() {
  const [nodes] = useState([
    { id: 1, label: 'PostgreSQL', type: 'source', x: 5, y: 20, color: '#60a5fa' },
    { id: 2, label: 'Kafka Stream', type: 'source', x: 5, y: 55, color: '#f472b6' },
    { id: 3, label: 'Transform', type: 'process', x: 35, y: 25, color: '#a78bfa' },
    { id: 4, label: 'Validate', type: 'process', x: 35, y: 60, color: '#34d399' },
    { id: 5, label: 'Aggregate', type: 'process', x: 65, y: 35, color: '#fbbf24' },
    { id: 6, label: 'S3 Output', type: 'sink', x: 90, y: 20, color: '#38bdf8' },
    { id: 7, label: 'Redshift', type: 'sink', x: 90, y: 55, color: '#fb7185' },
  ]);
  const [connections] = useState([
    { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 5, to: 7 },
  ]);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

  function run() {
    setStatus('running');
    setTimeout(() => setStatus('done'), 2500);
  }

  const selNode = nodes.find((n) => n.id === selected);

  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#f472b6]/15 flex items-center justify-center text-sm">âš¡</div>
          <div>
            <h3 className="text-sm font-semibold">DataMorph ETL</h3>
            <div className="text-[10px] text-[var(--color-text-muted)]">Visual Pipeline Builder Â· 7 nodes Â· 6 connections</div>
          </div>
        </div>
        <button onClick={run} disabled={status === 'running'}
          className={`px-4 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${status === 'done' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[#4f8fde] text-white hover:bg-[#60a5fa] hover:shadow-[0_4px_16px_rgba(96,165,250,0.2)]'} disabled:opacity-50`}>
          {status === 'idle' ? 'â–¶ Run Pipeline' : status === 'running' ? 'Running...' : 'âœ“ Complete'}
        </button>
      </div>

      <div className="relative h-64 bg-white/[0.015] rounded-xl border border-white/[0.04] overflow-hidden">
        {status === 'running' && (
          <div className="absolute inset-0 bg-[#04050f]/80 flex items-center justify-center z-10">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#f472b6]/30 border-t-[#f472b6] animate-spin" />
              <p className="text-[11px] text-[#f472b6] font-medium">Processing 1.2M records...</p>
            </div>
          </div>
        )}
        <svg className="w-full h-full" viewBox="0 0 100 80">
          {connections.map((c, i) => {
            const from = nodes.find((n) => n.id === c.from)!;
            const to = nodes.find((n) => n.id === c.to)!;
            return (
              <line key={i} x1={`${from.x + 6}%`} y1={`${from.y + 3}%`} x2={`${to.x}%`} y2={`${to.y + 3}%`}
                stroke={status === 'running' ? `url(#grad${i})` : 'rgba(255,255,255,0.1)'}
                strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)" />
            );
          })}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="rgba(255,255,255,0.2)" />
            </marker>
            {connections.map((_, i) => (
              <linearGradient key={i} id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#60a5fa">
                  <animate attributeName="offset" from="0" to="1" dur="1.5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            ))}
          </defs>
          {nodes.map((n) => (
            <g key={n.id} onClick={() => setSelected(n.id)} style={{ cursor: 'pointer' }}>
              <rect x={`${n.x}%`} y={`${n.y}%`} width="12%" height="6%" rx="6" fill="rgba(10,12,24,0.9)"
                stroke={selected === n.id ? n.color : 'rgba(255,255,255,0.1)'} strokeWidth="1.5" />
              <text x={`${n.x + 6}%`} y={`${n.y + 3.8}%`} textAnchor="middle" fill={n.color} fontSize="8" fontFamily="monospace" fontWeight="600">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex gap-2">
        {['Source', 'Process', 'Sink'].map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-[var(--color-text-muted)] border border-white/[0.04]">{t}</span>
        ))}
        {status === 'done' && <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">1.2M rows Â· 3.4s</span>}
      </div>

      {selNode && (
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
          <p className="text-[11px] font-medium" style={{ color: selNode.color }}>{selNode.label}</p>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Type: {selNode.type} Â· Status: {status === 'done' ? 'Completed' : status === 'running' ? 'Processing' : 'Ready'}</p>
        </div>
      )}
    </div>
  );
}

