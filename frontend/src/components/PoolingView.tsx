import { useState } from 'react';
import api from '../api';
import { Loader2 } from 'lucide-react'; // Added for the loading spinner

export default function PoolingView() {
  const [poolResults, setPoolResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePool = async () => {
    setIsLoading(true); // Start spinner
    try {
      // Send the year to the backend to generate the pool
      const response = await api.post('/pools', { year: 2025 }); 
      
      // Handle different backend response structures safely
      const data = response.data?.members || response.data || [];
      setPoolResults(Array.isArray(data) ? data : [data]);
      
    } catch (error) {
      console.error("Pooling error:", error);
      alert("Error creating pool. Check console for details.");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">FuelEU Pooling</h2>
        <button 
          onClick={handleCreatePool}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
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
                  <td className="px-6 py-4 text-slate-300 font-mono">{res.shipId || res.routeId || "Unknown"}</td>
                  <td className="px-6 py-4 text-rose-400">{res.cbBefore ?? res.complianceBalance ?? "0"}</td>
                  <td className="px-6 py-4 text-emerald-400">{res.cbAfter ?? "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Empty State Polish
        <div className="p-12 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
          <p className="text-slate-400">No active pools. Click "Generate Optimized Pool" to balance your fleet.</p>
        </div>
      )}
    </div>
  );
}