import React, { useState } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit2,
  FileCheck2,
  PackagePlus,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Warehouse,
  X,
} from 'lucide-react';
import { Medicine } from '../../types/pharmacy';
import { MEDICINE_CATEGORIES } from '../../data/initialData';

interface StockListManagementProps {
  medicines: Medicine[];
  onRestock: (medicineId: number, additionalUnits: number) => void;
  onSaveMedicine: (medicine: Medicine) => void;
  onDeleteMedicine: (medicineId: number) => void;
  initialFilter?: 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export const StockListManagement: React.FC<StockListManagementProps> = ({
  medicines,
  onRestock,
  onSaveMedicine,
  onDeleteMedicine,
  initialFilter = 'ALL',
}) => {
  const [filter, setFilter] = useState<'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'NORMAL'>(
    initialFilter
  );
  const [search, setSearch] = useState('');
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [restockModalMed, setRestockModalMed] = useState<Medicine | null>(null);
  const [customRestockQty, setCustomRestockQty] = useState(50);

  // New/Edit Form state
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    genericName: '',
    category: 'Pain Relief & Analgesics',
    price: 15.0,
    stock: 25,
    expiryDate: '2027-12-31',
    uses: '',
    dosageInfo: '',
    sideEffects: '',
    requiresPrescription: false,
  });

  const emptyStockMedicines = medicines.filter((m) => m.stock === 0);
  const lowStockMedicines = medicines.filter((m) => m.stock > 0 && m.stock < 10);

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'OUT_OF_STOCK') return m.stock === 0;
    if (filter === 'LOW_STOCK') return m.stock > 0 && m.stock < 10;
    if (filter === 'NORMAL') return m.stock >= 10;
    return true;
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      genericName: '',
      category: 'Pain Relief & Analgesics',
      price: 15.0,
      stock: 25,
      expiryDate: '2027-12-31',
      uses: '',
      dosageInfo: '',
      sideEffects: '',
      requiresPrescription: false,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({ ...med });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.genericName || formData.price === undefined || formData.stock === undefined) {
      return;
    }

    const savedMedicine: Medicine = {
      id: editingMedicine ? editingMedicine.id : Date.now(),
      name: formData.name,
      genericName: formData.genericName,
      category: formData.category || 'General Care',
      price: Number(formData.price),
      stock: Number(formData.stock),
      expiryDate: formData.expiryDate || '2027-12-31',
      uses: formData.uses || 'Standard therapeutic usage',
      dosageInfo: formData.dosageInfo || 'As directed by physician',
      sideEffects: formData.sideEffects || 'None reported',
      requiresPrescription: Boolean(formData.requiresPrescription),
    };

    onSaveMedicine(savedMedicine);
    setIsAddModalOpen(false);
    setEditingMedicine(null);
  };

  const handleQuickRestock = (medId: number, qty: number) => {
    onRestock(medId, qty);
  };

  const handleCustomRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockModalMed && customRestockQty > 0) {
      onRestock(restockModalMed.id, customRestockQty);
      setRestockModalMed(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Warehouse className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Pharmacy Stock List & Inventory Ledger</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time stock monitoring with automatic alert thresholds (&lt;10 low, 0 out-of-stock).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-add-medicine"
            onClick={openAddModal}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine SKU</span>
          </button>
        </div>
      </div>

      {/* CRITICAL STOCK ALERTS BOX: Going Empty Alerts */}
      {(emptyStockMedicines.length > 0 || lowStockMedicines.length > 0) && (
        <div className="space-y-3">
          {emptyStockMedicines.length > 0 && (
            <div
              id="alert-box-empty-stock"
              className="bg-red-50 border border-red-300 rounded-2xl p-4 sm:p-5 text-red-900 shadow-xs animate-in fade-in"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-xl text-red-700 mt-0.5 sm:mt-0">
                    <AlertOctagon className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-900">
                      CRITICAL ALERT: {emptyStockMedicines.length} Medicine(s) are completely OUT OF STOCK (0 Units)!
                    </h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      The following medications have zero inventory remaining:
                      <span className="font-semibold ml-1">
                        {emptyStockMedicines.map((m) => m.name).join(', ')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('OUT_OF_STOCK')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Filter Empty ({emptyStockMedicines.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {lowStockMedicines.length > 0 && (
            <div
              id="alert-box-low-stock"
              className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-0.5 sm:mt-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">
                      AUTOMATED LOW-STOCK WARNING: {lowStockMedicines.length} Medicine(s) Below Safe Threshold (&lt;10 Units)
                    </h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Triggered automatically by Spring Boot business logic layer. Restock recommended to prevent stockouts:
                      <span className="font-semibold ml-1">
                        {lowStockMedicines.map((m) => `${m.name} (${m.stock} left)`).join(', ')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('LOW_STOCK')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Filter Low ({lowStockMedicines.length})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Medicines ({medicines.length})
          </button>

          <button
            onClick={() => setFilter('OUT_OF_STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filter === 'OUT_OF_STOCK'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Out of Stock ({emptyStockMedicines.length})</span>
          </button>

          <button
            onClick={() => setFilter('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filter === 'LOW_STOCK'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock (&lt;10) ({lowStockMedicines.length})</span>
          </button>

          <button
            onClick={() => setFilter('NORMAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filter === 'NORMAL'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Sufficient Stock (&ge;10)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stock list..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Stock List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">SKU / ID</th>
                <th className="py-3.5 px-4">Medicine & Active Generic</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Current Stock & Status</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-right">Inventory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No medicine SKUs found matching the active filter.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isOutOfStock = med.stock === 0;
                  const isLowStock = med.stock > 0 && med.stock < 10;

                  return (
                    <tr
                      key={med.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOutOfStock
                          ? 'bg-red-50/30'
                          : isLowStock
                          ? 'bg-amber-50/30'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        MED-{med.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Generic: {med.genericName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80">
                          {med.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ${med.price.toFixed(2)}
                      </td>

                      {/* Stock Level with Visual Alert Indicator */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isOutOfStock
                                ? 'text-red-700'
                                : isLowStock
                                ? 'text-amber-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {med.stock} units
                          </span>

                          {isOutOfStock && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                              EMPTY (0)
                            </span>
                          )}

                          {isLowStock && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              LOW (&lt;10)
                            </span>
                          )}

                          {!isOutOfStock && !isLowStock && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              OK
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {med.expiryDate}
                      </td>

                      {/* Actions: Quick Restock, Edit, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick +10 Restock */}
                          <button
                            onClick={() => handleQuickRestock(med.id, 10)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                            title="Quick Restock +10 units"
                          >
                            +10
                          </button>

                          {/* Quick +50 Restock */}
                          <button
                            onClick={() => handleQuickRestock(med.id, 50)}
                            className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                            title="Quick Restock +50 units"
                          >
                            +50
                          </button>

                          {/* Custom Restock Modal Trigger */}
                          <button
                            onClick={() => setRestockModalMed(med)}
                            className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Custom Restock Batch"
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(med)}
                            className="p-1 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Edit Medicine Monograph"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${med.name}" from inventory?`)) {
                                onDeleteMedicine(med.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingMedicine ? 'Edit Medicine Entity' : 'Register New Medicine SKU'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amoxicillin Trihydrate 500mg"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Generic Scientific Name *</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Therapeutic Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    {MEDICINE_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial / Current Stock (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Therapeutic Uses & Indications</label>
                <textarea
                  rows={2}
                  value={formData.uses}
                  onChange={(e) => setFormData({ ...formData, uses: e.target.value })}
                  placeholder="e.g. Treatment of ear, nose, throat and skin bacterial infections..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Guidelines</label>
                  <textarea
                    rows={2}
                    value={formData.dosageInfo}
                    onChange={(e) => setFormData({ ...formData, dosageInfo: e.target.value })}
                    placeholder="e.g. 1 capsule every 8 hours with meals"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Side Effects & Contraindications</label>
                  <textarea
                    rows={2}
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                    placeholder="e.g. Nausea, mild headache, allergy rash"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">Requires Doctor Prescription (Schedule Rx)</span>
              </label>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingMedicine ? 'Update Medicine' : 'Save to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Batch Restock Modal */}
      {restockModalMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-slate-900 text-sm">Batch Restock Inventory</h4>
              </div>
              <button
                onClick={() => setRestockModalMed(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Replenishing supplier shipment for <strong className="text-slate-900">{restockModalMed.name}</strong>.
              Current stock is <strong>{restockModalMed.stock} units</strong>.
            </p>

            <form onSubmit={handleCustomRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Units to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  value={customRestockQty}
                  onChange={(e) => setCustomRestockQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                <span>New Project Stock Total:</span>
                <span className="font-bold text-teal-700 text-sm">
                  {restockModalMed.stock + customRestockQty} units
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalMed(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
