import React from 'react';
import { AlertOctagon, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Medicine } from '../types/pharmacy';

interface StockAlertBannerProps {
  medicines: Medicine[];
  onNavigateToStockList: () => void;
  isAdmin: boolean;
}

export const StockAlertBanner: React.FC<StockAlertBannerProps> = ({
  medicines,
  onNavigateToStockList,
  isAdmin,
}) => {
  const emptyStock = medicines.filter((m) => m.stock === 0);
  const lowStock = medicines.filter((m) => m.stock > 0 && m.stock < 10);

  if (emptyStock.length === 0 && lowStock.length === 0) {
    return null;
  }

  return (
    <div id="stock-alert-banner" className="bg-slate-900 border-b border-amber-500/30 text-white px-4 py-2.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 font-medium">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>{emptyStock.length} Completely Empty</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{lowStock.length} Low Stock (&lt;10)</span>
          </div>

          <span className="text-slate-300 hidden md:inline">
            {emptyStock.length > 0
              ? `Critical: "${emptyStock.map((m) => m.name.split(' ')[0]).slice(0, 2).join(', ')}${emptyStock.length > 2 ? '...' : ''}" is exhausted!`
              : 'Automated inventory alert: stock levels below required replenishment threshold.'}
          </span>
        </div>

        <button
          id="btn-banner-stock-inspect"
          onClick={onNavigateToStockList}
          className="inline-flex items-center gap-1.5 font-semibold text-xs px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <span>{isAdmin ? 'Manage & Restock Now' : 'View Pharmacist Stock List'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
