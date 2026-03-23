import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Ship, Activity, Database, Network } from 'lucide-react';
// import RoutesTable from './components/RoutesTable';
import RoutesTable from './components/RoutesTable';
import ComparisonView from './components/ComparisonView';
import PoolingView from './components/PoolingView';

// navigation configuration.
const NAV_ITEMS = [
  { path: '/', label: 'Routes', icon: Activity },
  { path: '/compare', label: 'Compare Baseline', icon: Network },
  { path: '/banking', label: 'CB Banking', icon: Database },
  { path: '/pooling', label: 'FuelEU Pools', icon: Ship },
];

// sidebar component.
const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Ship className="w-6 h-6 text-blue-500 mr-2" />
        <span className="text-lg font-bold tracking-tight text-white">Varuna Marine</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

// main application shell.
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b border-slate-800 flex items-center px-8">
            <h1 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              FuelEU Compliance Dashboard
            </h1>
          </header>
          
          <div className="flex-1 p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<RoutesTable />} />
              <Route path="/compare" element={<ComparisonView />} />
              <Route path="/banking" element={<div className="text-white">Banking UI (Standard Table)</div>} />
              <Route path="/pooling" element={<PoolingView />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}