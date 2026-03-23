import { useState, useEffect } from 'react';
import { ShipService } from '../api';

export default function PoolingView() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [poolResults, setPoolResults] = useState<any[]>([]);

  useEffect(() => {
    ShipService.getRoutes().then(setRoutes);
  }, []);

  const handleCreatePool = async () => {
    // take top 3 routes for a sample pool.
    const members = routes.slice(0, 3).map(r => ({
      shipId: r.routeId,
      cbBefore: r.isBaseline ? 50000 : -20000 // mock logic for demo.
    }));

    const result = await ShipService.createPool({ year: 2025, members });
    setPoolResults(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">FuelEU Pooling</h2>
        <button 
          onClick={handleCreatePool}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Generate Optimized Pool
        </button>
      </div>

      {poolResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Ship ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">CB Before</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">CB After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {poolResults.map((res, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-slate-300 font-mono">{res.shipId}</td>
                  <td className="px-6 py-4 text-rose-400">{res.cbBefore}</td>
                  <td className="px-6 py-4 text-emerald-400">{res.cbAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}