import { useState, useEffect } from 'react';
import api from '../api';
import { PiggyBank, ArrowDownCircle, Loader2 } from 'lucide-react';

export default function BankingView() {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const shipId = "R001"; // Default for demo

  // Fetch initial banking data
  useEffect(() => {
    const fetchBanking = async () => {
      try {
        const response = await api.get('/banking?year=2025'); 
        // If your backend returns an array, sum it up. If it returns an object, use the balance.
        const data = response.data;
        if (Array.isArray(data)) {
           const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
           setBalance(total);
        } else if (data && data.balance !== undefined) {
           setBalance(data.balance);
        }
      } catch (error) {
        console.error("Banking fetch error:", error);
      }
    };
    fetchBanking();
  }, []);

  const handleBank = async () => {
    setIsLoading(true); // Start spinner
    try {
      // 1. Post to backend to save the banking record
      await api.post('/banking', { shipId, year: 2025, amount: 5000 });
      
      // 2. Optimistically update the UI so it feels instant
      setBalance(prev => prev + 5000);
      alert("Surplus banked successfully!");
    } catch (error) {
      console.error("Banking error:", error);
      alert("Failed to bank surplus. Check your backend console.");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/20">
        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Banked Surplus</p>
        <h2 className="text-5xl font-bold mt-2 font-mono">
          {balance.toLocaleString()} <span className="text-xl font-normal opacity-70 text-sm">gCO₂e/MJ</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={handleBank} 
          disabled={isLoading}
          className="flex flex-col items-center p-8 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/50 disabled:opacity-50 transition-all group"
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          ) : (
            <PiggyBank className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
          )}
          <h3 className="text-lg font-semibold mt-4 text-white">Bank Surplus</h3>
          <p className="text-slate-400 text-sm text-center mt-2">Lock in your current positive compliance balance for future years.</p>
        </button>

        <button className="flex flex-col items-center p-8 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group opacity-50 cursor-not-allowed">
          <ArrowDownCircle className="w-12 h-12 text-blue-400" />
          <h3 className="text-lg font-semibold mt-4 text-white">Apply Surplus</h3>
          <p className="text-slate-400 text-sm text-center mt-2">Use banked reserves to offset current year deficits.</p>
        </button>
      </div>
    </div>
  );
}