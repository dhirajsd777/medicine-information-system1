import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, Medicine } from '../../types/pharmacy';

interface CartCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (medicineId: number, delta: number) => void;
  onRemoveItem: (medicineId: number) => void;
  onPlaceOrder: (shippingAddress: string) => void;
  userAddress: string;
}

export const CartCheckout: React.FC<CartCheckoutProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  userAddress,
}) => {
  const [address, setAddress] = useState(userAddress || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% prescription medicine tax
  const shipping = subtotal > 50 || subtotal === 0 ? 0.0 : 4.99;
  const total = subtotal + tax + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onPlaceOrder(address.trim());
      setIsProcessing(false);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Prescription & OTC Cart</h3>
              <p className="text-[11px] text-slate-500">{cart.length} item types in session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Order Confirmed!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Inventory stock deducted, order dispatched to pharmacy fulfillment center.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">Your cart is currently empty</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our medicine catalog to add prescription or over-the-counter health items.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const maxAvailable = item.medicine.stock;
                const isMaxReached = item.quantity >= maxAvailable;

                return (
                  <div
                    key={item.medicine.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.medicine.name}</h4>
                        <div className="text-[11px] text-slate-500">
                          ${item.medicine.price.toFixed(2)} each
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.medicine.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isMaxReached && (
                      <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Maximum available warehouse stock reached ({maxAvailable})</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.medicine.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 min-w-[20px] text-center text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.medicine.id, 1)}
                          disabled={isMaxReached}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-slate-900">
                        ${(item.medicine.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Address Section */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Delivery Address</span>
                </div>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full shipping address, apartment, postal code..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Payment Method Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-700 font-medium">H2/Stripe Mock Payment Gateway</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Instant Test
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout Button */}
        {cart.length > 0 && !orderSuccess && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales & Medical Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier Express Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-teal-700">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="btn-confirm-checkout"
              onClick={handleCheckoutSubmit}
              disabled={isProcessing || !address.trim()}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Authorizing Order & Deducting Stock...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order & Pay (${total.toFixed(2)})</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Transactions processed securely via Spring Data JPA transactional repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
