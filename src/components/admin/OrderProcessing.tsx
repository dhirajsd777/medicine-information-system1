import React from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  Receipt,
  Truck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/pharmacy';

interface OrderProcessingProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: number, status: OrderStatus) => void;
}

export const OrderProcessing: React.FC<OrderProcessingProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Order Dispatch & Shipment Processing</h2>
          </div>
          <p className="text-xs text-slate-500">
            Fulfill patient orders, update courier dispatch statuses, and track payment transactions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer & Shipping Destination</th>
                <th className="py-3.5 px-4">Items Manifest</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Ref</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <div>#{order.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{order.orderDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{order.userName}</div>
                    <div className="text-[11px] text-slate-500 max-w-xs truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{order.shippingAddress}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-[11px] text-slate-700">
                          <span className="font-semibold">{item.quantity}x</span> {item.medicineName}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {order.paymentId}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
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
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
