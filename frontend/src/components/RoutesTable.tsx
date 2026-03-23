import { useEffect, useState } from 'react';
import { ShipService } from '../api';
import { CheckCircle, Circle, Anchor } from 'lucide-react';

// routes view component.
export default function RoutesTable() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // load data on mount.
  useEffect(() => {
    ShipService.getRoutes()
      .then(setRoutes)
      .finally(() => setLoading(false));
  }, []);

  // handle baseline update.
  const handleSetBaseline = async (id: string) => {
    await ShipService.setBaseline(id);
    const updated = await ShipService.getRoutes(); // refresh list.
    setRoutes(updated);
  };

  if (loading) return <div className="text-slate-400 animate-pulse">Loading fleet data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Fleet Routes</h2>
          <p className="text-slate-400 text-sm mt-1">Manage vessel intensities and baseline selection.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Vessel / ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Fuel Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">GHG Intensity</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Consumption</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase text-center">Baseline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Anchor className="w-4 h-4 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium text-slate-200">{route.vesselType}</div>
                      <div className="text-xs text-slate-500">{route.routeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                    {route.fuelType}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-blue-400">{route.ghgIntensity}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{route.fuelConsumption} t</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleSetBaseline(route.id)}
                    className="focus:outline-none"
                  >
                    {route.isBaseline ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-700 hover:text-blue-500 mx-auto transition-colors" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}