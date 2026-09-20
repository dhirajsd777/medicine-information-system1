import React from 'react';
import {
  Activity,
  Code2,
  FileText,
  Package,
  Pill,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  UserCheck2,
  Users,
  Warehouse,
} from 'lucide-react';
import { User, UserRole } from '../types/pharmacy';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  lowStockCount: number;
  emptyStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  lowStockCount,
  emptyStockCount,
}) => {
  const isAdmin = currentUser.role === 'ROLE_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(isAdmin ? 'admin-dashboard' : 'catalog')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">PharmaCore</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Spring Boot 3
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Medicine Information & Management System</p>
              </div>
            </button>
          </div>

          {/* Navigation Links based on Current Role */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {!isAdmin ? (
              <>
                <button
                  id="nav-customer-catalog"
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'catalog'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Medicine Catalog
                </button>
                <button
                  id="nav-customer-prescriptions"
                  onClick={() => setActiveTab('prescriptions')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'prescriptions'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Prescriptions
                </button>
                <button
                  id="nav-customer-orders"
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Track Orders
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-admin-dashboard"
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-admin-stock"
                  onClick={() => setActiveTab('admin-inventory')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-inventory'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Warehouse className="w-4 h-4" />
                  <span>Stock List</span>
                  {(emptyStockCount > 0 || lowStockCount > 0) && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                      {emptyStockCount + lowStockCount}
                    </span>
                  )}
                </button>
                <button
                  id="nav-admin-rx"
                  onClick={() => setActiveTab('admin-prescriptions')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-prescriptions'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Rx Verification
                </button>
                <button
                  id="nav-admin-orders"
                  onClick={() => setActiveTab('admin-orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-orders'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Order Fulfillment
                </button>
              </>
            )}

            {/* View Spring Boot Source Code Tab */}
            <button
              id="nav-code-explorer"
              onClick={() => setActiveTab('code-explorer')}
              className={`ml-2 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border transition-colors cursor-pointer ${
                activeTab === 'code-explorer'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span>Spring Boot Source Code</span>
            </button>
          </nav>

          {/* Right Action: Cart, Role Switcher & User info */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button (Customer) */}
            {!isAdmin && (
              <button
                id="btn-cart-toggle"
                onClick={openCart}
                className="relative p-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-teal-600 rounded-full border-2 border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Role Switcher Simulation */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                id="btn-switch-customer"
                onClick={() => onSwitchUser('ROLE_CUSTOMER')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Log in as Customer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer</span>
              </button>

              <button
                id="btn-switch-admin"
                onClick={() => onSwitchUser('ROLE_ADMIN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Log in as Admin / Pharmacist"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pharmacist (Admin)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium gap-2">
          {!isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'catalog' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Catalog
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'prescriptions' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Prescriptions
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Orders
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'admin-dashboard' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('admin-inventory')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'admin-inventory' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Stock List
              </button>
              <button
                onClick={() => setActiveTab('admin-prescriptions')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'admin-prescriptions' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Rx Verify
              </button>
              <button
                onClick={() => setActiveTab('admin-orders')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
                  activeTab === 'admin-orders' ? 'bg-teal-100 text-teal-800 font-bold' : 'text-slate-600'
                }`}
              >
                Fulfillment
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('code-explorer')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'code-explorer' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Spring Code</span>
          </button>
        </div>
      </div>
    </header>
  );
};
