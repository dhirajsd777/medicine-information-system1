import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Info,
  Pill,
  Search,
  ShoppingCart,
  Star,
  Tag,
  X,
} from 'lucide-react';
import { Medicine, Review } from '../../types/pharmacy';
import { MEDICINE_CATEGORIES } from '../../data/initialData';

interface MedicineCatalogProps {
  medicines: Medicine[];
  reviews: Review[];
  onAddToCart: (medicine: Medicine) => void;
  onAddReview: (medicineId: number, rating: number, comment: string) => void;
  onOpenPrescriptionTab: () => void;
}

export const MedicineCatalog: React.FC<MedicineCatalogProps> = ({
  medicines,
  reviews,
  onAddToCart,
  onAddReview,
  onOpenPrescriptionTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);

  // New review modal state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Filter medicines
  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.uses.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || m.category === selectedCategory;

    const matchesStock = !inStockOnly || m.stock > 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMedicine || !newComment.trim()) return;
    onAddReview(activeMedicine.id, newRating, newComment.trim());
    setNewComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  const medicineReviews = activeMedicine
    ? reviews.filter((r) => r.medicineId === activeMedicine.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-medicine-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand name (e.g. Amoxicillin), generic name, or condition..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>In Stock Only</span>
            </label>

            <button
              onClick={onOpenPrescriptionTab}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Upload Prescription (Rx)</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 pb-1 no-scrollbar">
          {MEDICINE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Verified Medicines</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredMedicines.length} found
            </span>
          </h2>
          <span className="text-xs text-slate-500">Regulated & GMP Certified Pharmaceutical Supplies</span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No medicines matched your query</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search keywords or clearing the category filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedicines.map((med) => {
              const isOutOfStock = med.stock === 0;
              const isLowStock = med.stock > 0 && med.stock < 10;

              return (
                <div
                  key={med.id}
                  id={`medicine-card-${med.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 line-clamp-1">
                        {med.category}
                      </span>

                      {/* Stock Status Badge */}
                      {isOutOfStock ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Only {med.stock} left
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          In Stock ({med.stock})
                        </span>
                      )}
                    </div>

                    {/* Title & Generic Name */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {med.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5 mb-2.5">
                      Generic: <span className="text-slate-700 font-medium">{med.genericName}</span>
                    </div>

                    {/* Medical Usage description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {med.uses}
                    </p>

                    {/* Prescription Required Badge */}
                    {med.requiresPrescription && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 mb-3">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Prescription Required (Rx)</span>
                      </div>
                    )}

                    {/* Expiry Date */}
                    <div className="text-[11px] text-slate-400">
                      Exp: <span className="text-slate-600">{med.expiryDate}</span>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs text-slate-400">Unit Price</div>
                      <div className="text-lg font-bold text-slate-900">
                        ${med.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-view-details-${med.id}`}
                        onClick={() => setActiveMedicine(med)}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
                        title="View Medical Monograph & Reviews"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        id={`btn-add-cart-${med.id}`}
                        onClick={() => onAddToCart(med)}
                        disabled={isOutOfStock}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Medicine Details & Reviews Modal */}
      {activeMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                    {activeMedicine.category}
                  </span>
                  {activeMedicine.stock === 0 ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200">
                      Out of Stock
                    </span>
                  ) : activeMedicine.stock < 10 ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Low Stock: {activeMedicine.stock} left
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      In Stock: {activeMedicine.stock}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{activeMedicine.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Generic: {activeMedicine.genericName}</p>
              </div>
              <button
                onClick={() => setActiveMedicine(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Monograph Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Therapeutic Uses</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeMedicine.uses}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dosage Guidelines</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeMedicine.dosageInfo}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Known Side Effects & Precautions</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeMedicine.sideEffects}</p>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Patient Reviews & Ratings</span>
                  <span className="text-xs font-normal text-slate-500">{medicineReviews.length} total reviews</span>
                </h4>

                {medicineReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet for this medicine.</p>
                ) : (
                  <div className="space-y-2.5">
                    {medicineReviews.map((rev) => (
                      <div key={rev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{rev.userName}</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-slate-400 ml-1 text-[11px]">{rev.reviewDate}</span>
                          </div>
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="mt-4 p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70">
                  <div className="text-xs font-bold text-teal-900 mb-2">Leave a Customer Review</div>
                  {showReviewSuccess && (
                    <div className="mb-3 p-2 bg-emerald-100 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thank you! Your verified review has been logged.</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-slate-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your therapeutic experience or effectiveness..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors cursor-pointer"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-lg font-bold text-slate-900">
                ${activeMedicine.price.toFixed(2)}
              </div>
              <button
                onClick={() => {
                  onAddToCart(activeMedicine);
                  setActiveMedicine(null);
                }}
                disabled={activeMedicine.stock === 0}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMedicine.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                }`}
              >
                {activeMedicine.stock === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
