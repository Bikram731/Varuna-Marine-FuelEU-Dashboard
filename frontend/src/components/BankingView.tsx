import { useState, useEffect } from 'react';
import { ShipService } from '../api';
import { PiggyBank, ArrowDownCircle, Loader2 } from 'lucide-react';

export default function BankingView() {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const shipId = "R001"; // Default for demo

  useEffect(() => {
    const fetchBanking = async () => {
      try {
        const res = await ShipService.getBankRecords(shipId);
        // Bulletproof parsing: handles if backend returns an array of records OR a single balance object
        if (Array.isArray(res)) {
           const total = res.reduce((sum, item) => sum + (Number(item.amount) || Number(item.balance) || 0), 0);
           setBalance(total);
        } else if (res && typeof res.balance !== 'undefined') {
           setBalance(Number(res.balance));
        }
      } catch (error) {
        console.error("Banking fetch error:", error);
      }
    };
    fetchBanking();
  }, []);

  const handleBank = async () => {
    setIsLoading(true);
    try {
      await ShipService.bankSurplus({ shipId, year: 2025, amount: 5000 });
      // Optimistic UI update to feel instantly responsive
      setBalance(prev => prev + 5000);
      alert("Surplus banked successfully!");
    } catch (error) {
      console.error("Banking error:", error);
      alert("Failed to bank surplus. Check your backend console.");
    } finally {
      setIsLoading(false);
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