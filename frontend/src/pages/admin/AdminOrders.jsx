import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';
import { useToastStore } from '../../components/ui/Toast';

const STATUS_CONFIG = {
  pending:    { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',   dot: 'bg-yellow-400' },
  confirmed:  { bg: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500'   },
  processing: { bg: 'bg-purple-50 text-purple-700 border-purple-200',   dot: 'bg-purple-500' },
  shipped:    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',   dot: 'bg-indigo-500' },
  delivered:  { bg: 'bg-green-50 text-green-700 border-green-200',      dot: 'bg-green-500'  },
  cancelled:  { bg: 'bg-red-50 text-red-600 border-red-200',            dot: 'bg-red-500'    },
};
const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [filter, setFilter] = useState('');
  const qc    = useQueryClient();
  const toast = useToastStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: async () => {
      const r = await api.get('/orders', { params: { status: filter || undefined, limit: 50 } });
      return r.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, orderStatus, paymentStatus }) =>
      api.put(`/orders/${id}/status`, { orderStatus, paymentStatus }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-orders']);
      qc.invalidateQueries(['admin-stats']);
      toast.success('Order updated. Confirmation email sent.');
    },
    onError: () => toast.error('Failed to update order status.'),
  });

  const counts = data?.orders?.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Orders</h2>
        <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${filter === '' ? 'text-[#1a1a2e] border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
          style={filter === '' ? { background: 'linear-gradient(135deg,#e8c547,#f5d76e)' } : {}}>
          All {data?.total ? `(${data.total})` : ''}
        </button>
        {statuses.map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all capitalize ${filter === s ? 'text-[#1a1a2e] border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={filter === s ? { background: 'linear-gradient(135deg,#e8c547,#f5d76e)' } : {}}>
              {s} {counts[s] ? `(${counts[s]})` : ''}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1a1a2e] rounded-full animate-spin" />
            Loading orders...
          </div>
        ) : !data?.orders?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ShoppingBag size={40} className="mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1a1a2e' }}>
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Pay Action'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order, i) => {
                  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                  return (
                    <tr key={order._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-5 py-4">
                        <span className="font-black text-[#1a1a2e] text-xs tracking-wide">{order.orderNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1a1a2e] leading-tight">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                        </p>
                        <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        <span className="font-semibold text-[#1a1a2e]">{order.items?.length}</span>
                        <span className="text-gray-400"> items</span>
                      </td>
                      <td className="px-5 py-4 font-black text-[#1a1a2e]">₱{order.total?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border capitalize ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-orange-400'}`} />
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateStatus.mutate({ id: order._id, orderStatus: e.target.value })}
                            className={`appearance-none pr-7 pl-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer focus:outline-none capitalize ${cfg.bg}`}>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => updateStatus.mutate({ id: order._id, paymentStatus: e.target.value })}
                          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white cursor-pointer hover:border-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors">
                          {['pending', 'paid', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
