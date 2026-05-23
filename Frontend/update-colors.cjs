const fs = require('fs');

let p = 'Frontend/src/Styles/common.js';
let content = fs.readFileSync(p, 'utf8');

const repl = {
  'text-[#1a0020]': 'text-slate-200',
  'text-[#a21caf]': 'text-slate-400',
  'text-[#d946ef]': 'text-indigo-400',
  'text-[#f43f5e]': 'text-rose-400',
  'text-[#22c55e]': 'text-emerald-400',
  'text-[#f59e0b]': 'text-amber-400',
  'bg-[#fdf4ff]': 'bg-[#0f172a]',  // slate-900
  'bg-[#fae8ff]': 'bg-[#1e293b]',  // slate-800
  'bg-[#d946ef]': 'bg-indigo-600',
  'bg-[#c026d3]': 'bg-indigo-500',
  'bg-[#f43f5e]': 'bg-rose-500',
  'bg-[#22c55e]': 'bg-emerald-600',
  'bg-[#f59e0b]': 'bg-amber-500',
  'border-[#f5d0fe]': 'border-slate-700',
  'border-[#f43f5e]': 'border-rose-500',
  'bg-[#0d0014]': 'bg-[#020617]',  // slate-950
  'bg-[#190023]': 'bg-[#0f172a]',  // slate-900
  'bg-[#2a0040]': 'bg-[#1e293b]',  // slate-800
  'text-[#fdf4ff]': 'text-slate-100',
  'text-[#f0abfc]': 'text-slate-400',
  'border-[#4a044e]': 'border-slate-800',
  'bg-[#e879f9]': 'bg-indigo-500',
  'text-[#0d0014]': 'text-slate-900',
  'bg-[#e4e4e7]': 'bg-[#1e293b]',
  'text-[#a1a1aa]': 'text-slate-400',
  'bg-[#ffffff]': 'bg-slate-800',
  'border-[#e4e4e7]': 'border-slate-700',
  'divide-[#f2f2f7]': 'divide-slate-800',
  'bg-[#f9f9f9]': 'bg-slate-800',
  'bg-[#0d9488]': 'bg-indigo-500',
  'border-[#0d9488]': 'border-indigo-500/50',
  'text-[#fb7185]': 'text-rose-400',
  'hover:text-[#f43f5e]': 'hover:text-rose-400',
  'from-[#d946ef]': 'from-indigo-600',
  'to-[#c026d3]': 'to-blue-600',
  'from-[#fdf4ff]': 'from-slate-900',
  'to-[#fae8ff]': 'to-slate-950',
  'text-[#a1a1aa]': 'text-slate-400',
  'bg-[#101204]': 'bg-[#0f172a]', // Dashboard column default
  'bg-[#22272b]': 'bg-[#1e293b]', // Dashboard card
  'bg-[#09090b]': 'bg-[#020617]',
  'bg-[#323940]': 'bg-[#1e293b]',
  'Fuchsia Pop': 'Midnight Indigo'
};

for (let [k, v] of Object.entries(repl)) {
  content = content.split(k).join(v);
}
fs.writeFileSync(p, content);
console.log('Done!');
