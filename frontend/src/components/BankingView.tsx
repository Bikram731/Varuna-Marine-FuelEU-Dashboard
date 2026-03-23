import { useState, useEffect } from 'react';
import { ShipService } from '../api';
import { PiggyBank, ArrowDownCircle } from 'lucide-react';

export default function BankingView() {
  const [balance, setBalance] = useState<number>(0);
  const shipId = "R001"; // Default for demo

  useEffect(() => {
    ShipService.getBankRecords(shipId).then(res => setBalance(res.balance));
  }, []);

  const handleBank = async () => {
    await ShipService.bankSurplus({ shipId, year: 2025, amount: 5000 });
    const res = await ShipService.getBankRecords(shipId);
    setBalance(res.balance);
    alert("Surplus banked successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/20">
        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Banked Surplus</p>
        <h2 className="text-5xl font-bold mt-2 font-mono">{balance.toLocaleString()} <span className="text-xl font-normal opacity-70 text-sm">gCO₂e/MJ</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={handleBank} className="flex flex-col items-center p-8 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group">
          <PiggyBank className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
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