import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingCart, Package, Star } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => { const r = await api.get('/admin/analytics'); return r.data.analytics; },
    staleTime: 60_000,
  });

  const monthly = data?.monthlySales || [];
  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);
  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalOrders  = monthly.reduce((s, m) => s + m.orders, 0);

  const stats = [
    { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#f59e0b' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: '#8b5cf6' },
    { label: 'Top Product Sales', value: data?.topProducts?.[0]?.totalSold || 0, icon: Package, color: '#10b981' },
    { label: 'Avg Order Value', value: totalOrders ? `₱${Math.round(totalRevenue / totalOrders).toLocaleString()}` : '—', icon: Star, color: '#3b82f6' },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 8 }}>Analytics & Reports</h2>
        <p style={{ fontSize: 13, color: '#9e9e9e' }}>Sales performance and business insights</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 128, background: '#f2f2f2', borderRadius: 18 }} />)}
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #e8e8e8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15` }}>
                    <Icon size={18} color={color} />
                  </div>
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Monthly revenue bar chart */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 20 }}>Monthly Revenue</h3>
            {monthly.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9e9e9e', textAlign: 'center', paddingY: 32 }}>No data yet</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
                {monthly.map((m, i) => {
                  const pct = (m.revenue / maxRevenue) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', group: true }}>
                      <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ width: '100%', height: `${Math.max(pct, 2)}%`, background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', borderRadius: '8px 8px 0 0', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                          title={`₱${m.revenue.toLocaleString()}`}>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#9e9e9e', fontWeight: 600 }}>{MONTHS[(m._id.month - 1)]}</span>
                      <span style={{ fontSize: 10, color: '#9e9e9e' }}>{m.orders} ord</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 24 }}>
            {/* Top products */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>Top Selling Products</h3>
              {!data?.topProducts?.length ? <p style={{ fontSize: 13, color: '#9e9e9e', textAlign: 'center', paddingY: 16 }}>No data yet</p> :
                data.topProducts.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingY: 12, borderBottom: i < data.topProducts.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#e8e8e8', width: 24, textAlign: 'center' }}>{i+1}</span>
                    {p.image && <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', background: '#f2f2f2', flexShrink: 0 }}><img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: '#9e9e9e' }}>{p.totalSold} sold</p>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', whiteSpace: 'nowrap' }}>₱{p.revenue?.toLocaleString()}</p>
                  </div>
                ))
              }
            </div>

            {/* Orders by status */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>Orders by Status</h3>
              {!data?.ordersByStatus?.length ? <p style={{ fontSize: 13, color: '#9e9e9e', textAlign: 'center', paddingY: 16 }}>No data yet</p> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.ordersByStatus.map((s, i) => {
                    const total = data.ordersByStatus.reduce((a, x) => a + x.count, 0);
                    const pct = Math.round((s.count / total) * 100);
                    const colorMap = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#6366f1', delivered: '#10b981', cancelled: '#ef4444' };
                    const color = colorMap[s._id] || '#9ca3af';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: color }} />
                        <span style={{ fontSize: 13, textTransform: 'capitalize', color: '#555', width: 100 }}>{s._id}</span>
                        <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: color, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', width: 32, textAlign: 'right' }}>{s.count}</span>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          </div>

          {/* Revenue by payment method */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>Revenue by Payment Method</h3>
            {!data?.revenueByPayment?.length ? <p style={{ fontSize: 13, color: '#9e9e9e', textAlign: 'center', paddingY: 16 }}>No data yet</p> :
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {data.revenueByPayment.map((p, i) => (
                  <div key={i} style={{ background: '#f9f9f9', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #e8e8e8' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9e9e9e', marginBottom: 8 }}>{p._id}</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: '#1a1a2e' }}>₱{p.total?.toLocaleString()}</p>
                    <p style={{ fontSize: 12, color: '#9e9e9e', marginTop: 4 }}>{p.count} orders</p>
                  </div>
                ))}
              </div>
            }
          </div>
        </>
      )}
    </AdminLayout>
  );
}
