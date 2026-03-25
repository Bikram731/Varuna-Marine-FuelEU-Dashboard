import { useState, useEffect } from 'react';
import { ShipService } from '../api';
import { Loader2 } from 'lucide-react';

export default function PoolingView() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [poolResults, setPoolResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch the ships when the page loads so we have members to pool!
  useEffect(() => {
    ShipService.getRoutes()
      .then(data => setRoutes(data || []))
      .catch(err => console.error("Failed to load routes for pooling:", err));
  }, []);

  const handleCreatePool = async () => {
    setIsLoading(true);
    try {
      // 1. Extract IDs to send
      const members = routes.map(r => r.routeId || r.id).filter(Boolean);
      
      // 2. Call backend
      const result = await ShipService.createPool({ year: 2025, members }); 
      
      console.log("🔍 Raw API Response:", result); // <-- This will show us exactly what the backend sent!

      // 3. Bulletproof parsing: find the array wherever the backend hid it
      let finalArray: any[] = [];
      if (Array.isArray(result)) {
          finalArray = result;
      } else if (result && Array.isArray(result.members)) {
          finalArray = result.members;
      } else if (result && Array.isArray(result.poolMembers)) {
          finalArray = result.poolMembers;
      } else if (result && Array.isArray(result.data)) {
          finalArray = result.data;
      } else if (result && typeof result === 'object') {
          // Absolute fallback: if it returned a single member object instead of an array
          finalArray = [result];
      }

      if (finalArray.length === 0) {
          alert("Backend responded, but no ship data was found in the response! Press F12 and check the console.");
      }

      setPoolResults(finalArray);
      
    } catch (error) {
      console.error("Pooling error:", error);
      alert("Error creating pool. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">FuelEU Pooling</h2>
        <button 
          onClick={handleCreatePool}
          disabled={isLoading || routes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLoading ? "Generating Pool..." : "Generate Optimized Pool"}
        </button>
      </div>

      {poolResults.length > 0 ? (
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
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-mono">{res.shipId || res.routeId}</td>
                  <td className="px-6 py-4 text-rose-400">{res.cbBefore ?? res.complianceBalance}</td>
                  <td className="px-6 py-4 text-emerald-400">{res.cbAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
          <p className="text-slate-400">
            {routes.length === 0 ? "Loading ships..." : "No active pools. Click \"Generate Optimized Pool\" to balance your fleet."}
          </p>
        </div>
      )}
    </div>
  );
}