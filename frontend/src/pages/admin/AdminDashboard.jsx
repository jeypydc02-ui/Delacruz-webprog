import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600',
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const r = await api.get('/admin/stats'); return r.data.stats; },
    staleTime: 30_000,
  });

  const stats = [
    { label: 'Total Users',    value: data?.totalUsers    ?? '—', icon: Users,        color: '#3b82f6' },
    { label: 'Total Orders',   value: data?.totalOrders   ?? '—', icon: ShoppingCart, color: '#8b5cf6' },
    { label: 'Active Products',value: data?.totalProducts ?? '—', icon: Package,      color: '#10b981' },
    { label: 'Total Revenue',  value: data?.totalRevenue ? `₱${data.totalRevenue.toLocaleString()}` : '—', icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 8 }}>Dashboard</h2>
        <p style={{ fontSize: 13, color: '#9e9e9e' }}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #e8e8e8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15` }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>{isLoading ? '...' : value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid #e8e8e8', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={18} color="#9e9e9e" />
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>Recent Orders</h3>
          </div>
          <Link to="/admin/orders" style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600, textDecoration: 'underline' }}>View all →</Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 56, background: '#f2f2f2', borderRadius: 12 }} />)}
          </div>
        ) : !data?.recentOrders?.length ? (
          <p style={{ fontSize: 13, color: '#9e9e9e', textAlign: 'center', paddingY: 32 }}>No orders yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: 12, color: '#9e9e9e', borderBottom: '1.5px solid #e8e8e8' }}>
                  {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ paddingBottom: 12, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ borderCollapse: 'collapse' }}>
                {data.recentOrders.map((order, idx) => (
                  <tr key={order._id} style={{ borderBottom: idx < data.recentOrders.length - 1 ? '1px solid #f0f0f0' : 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ paddingY: 12, fontWeight: 700, color: '#1a1a2e' }}>{order.orderNumber}</td>
                    <td style={{ paddingY: 12, color: '#555' }}>{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail || 'Guest'}</td>
                    <td style={{ paddingY: 12, fontWeight: 600 }}>₱{order.total?.toLocaleString()}</td>
                    <td style={{ paddingY: 12 }}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: order.orderStatus === 'delivered' ? '#dcfce7' : order.orderStatus === 'pending' ? '#fef3c7' : '#e0e7ff', color: order.orderStatus === 'delivered' ? '#166534' : order.orderStatus === 'pending' ? '#92400e' : '#3730a3' }}>{order.orderStatus}</span></td>
                    <td style={{ paddingY: 12, color: '#9e9e9e', fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString('en-PH', { month:'short', day:'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
