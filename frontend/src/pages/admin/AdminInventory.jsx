import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, AlertCircle, CheckCircle, Clock, BarChart2 } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';

function getStockStatus(stock) {
  if (stock === 0) return { cls: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500', label: 'Out of Stock' };
  if (stock <= 10) return { cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', label: 'Low Stock' };
  return { cls: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', label: 'In Stock' };
}

const filters = [
  { key: 'all', label: 'All Products', icon: Package,       color: '#6b7280' },
  { key: 'out', label: 'Out of Stock', icon: AlertCircle,   color: '#ef4444' },
  { key: 'low', label: 'Low Stock',    icon: AlertCircle,   color: '#f59e0b' },
  { key: 'ok',  label: 'In Stock',     icon: CheckCircle,   color: '#10b981' },
];

export default function AdminInventory() {
  const [filter, setFilter]       = useState('all');
  const [adjusting, setAdjusting] = useState(null);
  const [adjustment, setAdjustment] = useState('');
  const [reason, setReason]       = useState('');
  const [history, setHistory]     = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory', filter],
    queryFn: async () => {
      const r = await api.get('/admin/inventory', { params: { filter } });
      return r.data.products;
    },
  });

  const adjust = useMutation({
    mutationFn: ({ id, adjustment, reason }) =>
      api.put(`/admin/inventory/${id}`, { adjustment, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      setAdjusting(null); setAdjustment(''); setReason('');
    },
  });

  const loadHistory = async (id, name) => {
    const r = await api.get(`/admin/inventory/${id}/history`);
    setHistory({ name, logs: r.data.history });
  };

  const outOfStock = data?.filter(p => p.stock === 0).length || 0;
  const lowStock   = data?.filter(p => p.stock > 0 && p.stock <= 10).length || 0;
  const inStock    = data?.filter(p => p.stock > 10).length || 0;

  return (
    <AdminLayout>
      {/* History Modal */}
      {history && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-black text-[#1a1a2e]">Stock History</h3>
                <p className="text-xs text-gray-400 mt-0.5">{history.name}</p>
              </div>
              <button onClick={() => setHistory(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 font-bold">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">
              {!history.logs?.length ? (
                <div className="flex flex-col items-center py-8 text-gray-400">
                  <Clock size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">No history yet</p>
                </div>
              ) : history.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 mb-4 border-b border-gray-50 last:border-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black ${log.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {log.change > 0 ? '+' : ''}{log.change}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a2e] leading-tight">{log.reason}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.before} → {log.after} units</p>
                    <p className="text-xs text-gray-300">{new Date(log.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {log.changedBy && <p className="text-xs text-gray-300">by {log.changedBy.firstName} {log.changedBy.lastName}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Inventory</h2>
            <p className="text-gray-500 text-sm mt-1">Track and adjust stock levels for all products</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-red-500">{outOfStock}</div>
              <div className="text-xs text-red-400 font-medium mt-0.5">Out of Stock</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-yellow-600">{lowStock}</div>
              <div className="text-xs text-yellow-500 font-medium mt-0.5">Low Stock</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-green-600">{inStock}</div>
              <div className="text-xs text-green-500 font-medium mt-0.5">In Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${filter === key ? 'text-[#1a1a2e] border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            style={filter === key ? { background: 'linear-gradient(135deg,#e8c547,#f5d76e)' } : {}}>
            <Icon size={13} style={{ color: filter === key ? '#1a1a2e' : color }} />
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1a1a2e] rounded-full animate-spin" />
            Loading inventory...
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1a1a2e' }}>
                  {['Product', 'Category', 'Stock', 'Status', 'Level', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => {
                  const status = getStockStatus(p.stock);
                  const pct = Math.min(100, (p.stock / Math.max(p.stock, 100)) * 100);
                  const barColor = p.stock === 0 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : '#10b981';
                  return (
                    <tr key={p._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                            {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <span className="font-semibold text-[#1a1a2e] leading-tight">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 capitalize">{p.category}</td>
                      <td className="px-5 py-4">
                        <span className="text-2xl font-black text-[#1a1a2e]">{p.stock}</span>
                        <span className="text-xs text-gray-400 ml-1">units</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${status.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{Math.round(pct)}%</p>
                      </td>
                      <td className="px-5 py-4">
                        {adjusting === p._id ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <input type="number" value={adjustment} onChange={e => setAdjustment(e.target.value)}
                              placeholder="±qty"
                              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20" />
                            <input type="text" value={reason} onChange={e => setReason(e.target.value)}
                              placeholder="Reason"
                              className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20" />
                            <button onClick={() => adjust.mutate({ id: p._id, adjustment: Number(adjustment), reason })}
                              disabled={!adjustment || adjust.isPending}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-60 text-[#1a1a2e]"
                              style={{ background: 'linear-gradient(135deg,#e8c547,#f5d76e)' }}>Save</button>
                            <button onClick={() => setAdjusting(null)}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setAdjusting(p._id); setAdjustment(''); setReason(''); }}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100">
                              Adjust
                            </button>
                            <button onClick={() => loadHistory(p._id, p.name)}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors border border-gray-100" title="View history">
                              <Clock size={14} />
                            </button>
                          </div>
                        )}
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
