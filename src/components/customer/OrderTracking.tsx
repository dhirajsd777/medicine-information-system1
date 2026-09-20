import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  Receipt,
  Truck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/pharmacy';

interface OrderTrackingProps {
  orders: Order[];
  onBrowseCatalog: () => void;
}

const ORDER_STEPS: OrderStatus[] = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orders, onBrowseCatalog }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Patient Order Tracking & Dispatch</h2>
          <p className="text-xs text-slate-500">Live fulfillment status from warehouse to doorstep</p>
        </div>
        <button
          onClick={onBrowseCatalog}
          className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Browse Medicine Catalog
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No active orders found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            When you complete checkout for medicines, their live delivery status will appear here.
          </p>
          <button
            onClick={onBrowseCatalog}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const currentStepIdx = ORDER_STEPS.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Order #{order.id}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {order.paymentId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Placed on {order.orderDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-teal-700">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : order.status === 'SHIPPED'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : order.status === 'PROCESSING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress Step Bar */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {ORDER_STEPS.map((step, idx) => {
                      const isComplete = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isComplete
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isComplete ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-medium uppercase tracking-tight ${
                              isCurrent
                                ? 'text-teal-800 font-bold'
                                : isComplete
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Shipping Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span>Itemized Manifest</span>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between items-center">
                          <span>
                            {item.quantity}x {item.medicineName}
                          </span>
                          <span className="font-medium text-slate-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Destination Address</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{order.shippingAddress}</p>
                    </div>
                    <div className="text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-2">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Tracked Carrier: Express Pharma Logistics</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
