import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Package,
  Pill,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { Medicine, Order, Prescription } from '../../types/pharmacy';

interface AdminDashboardProps {
  medicines: Medicine[];
  orders: Order[];
  prescriptions: Prescription[];
  onNavigateToTab: (tab: string) => void;
  onFilterInventory: (filter: 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  medicines,
  orders,
  prescriptions,
  onNavigateToTab,
  onFilterInventory,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = medicines.filter((m) => m.stock > 0 && m.stock < 10).length;
  const outOfStockCount = medicines.filter((m) => m.stock === 0).length;
  const pendingRxCount = prescriptions.filter((p) => p.status === 'PENDING').length;
  const activeMedicinesCount = medicines.length;

  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Pharmacy Operations Center</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Chief Pharmacist & Inventory Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of stock reserves, automated replenishment alerts, and prescription authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateToTab('admin-inventory')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Warehouse className="w-4 h-4" />
            <span>Open Stock List</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live Sales Volume</span>
          </div>
        </div>

        {/* Active Catalog */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Registered Medicines</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{activeMedicinesCount} SKUs</div>
          <div className="text-[11px] text-slate-500 mt-1">Regulated Inventory</div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => {
            onFilterInventory('LOW_STOCK');
            onNavigateToTab('admin-inventory');
          }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 hover:border-amber-300 shadow-xs cursor-pointer transition-all hover:bg-amber-50/20"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold">Low Stock (&lt;10)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-800">{lowStockCount} Items</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <span>Needs Reordering</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Critical Empty Stock Alerts */}
        <div
          onClick={() => {
            onFilterInventory('OUT_OF_STOCK');
            onNavigateToTab('admin-inventory');
          }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-red-200 hover:border-red-300 shadow-xs cursor-pointer transition-all hover:bg-red-50/20"
        >
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-semibold">Empty Stock (0)</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-red-800">{outOfStockCount} Items</div>
          <div className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <span>Critical Shortage!</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Prescriptions */}
        <div
          onClick={() => onNavigateToTab('admin-prescriptions')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 hover:border-indigo-300 shadow-xs cursor-pointer transition-all hover:bg-indigo-50/20"
        >
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-semibold">Rx Verifications</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-900">{pendingRxCount} Pending</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <span>Review Queue</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Stock Health Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Attention Medicines Box */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>Urgent Inventory Replenishment Alert</span>
              </h3>
              <p className="text-xs text-slate-500">Medicines going empty or below standard re-order points</p>
            </div>
            <button
              onClick={() => onNavigateToTab('admin-inventory')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
            >
              View Full Stock List &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {medicines
              .filter((m) => m.stock < 10)
              .map((med) => (
                <div key={med.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{med.name}</span>
                      {med.stock === 0 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          EMPTY (0)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          LOW ({med.stock})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{med.category} &bull; Exp: {med.expiryDate}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      ${med.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        onFilterInventory('ALL');
                        onNavigateToTab('admin-inventory');
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600" />
                <span>Recent Customer Orders</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('admin-orders')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
              >
                Fulfill &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">Order #{order.id}</div>
                    <div className="text-[11px] text-slate-500">{order.userName} &bull; {order.items.length} items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'SHIPPED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">Database Layer: Spring Data JPA + H2 / Hibernate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
