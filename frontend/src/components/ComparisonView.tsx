import { useEffect, useState } from 'react';
import { ShipService } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ComparisonView() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    ShipService.getComparison().then(setData).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Baseline Comparison</h2>
        <p className="text-slate-400 text-sm">Intensity variance vs selected baseline.</p>
      </div>

      <div className="h-80 bg-slate-900 p-6 rounded-xl border border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="route.routeId" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Bar dataKey="percentDiff" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.percentDiff > 0 ? '#f43f5e' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.route.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="text-xs text-slate-500 font-bold uppercase">{item.route.routeId}</div>
            <div className="text-lg font-semibold text-slate-200 mt-1">{item.route.vesselType}</div>
            <div className={`text-sm mt-2 ${item.isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.percentDiff > 0 ? `+${item.percentDiff}% above baseline` : `${item.percentDiff}% below baseline`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}