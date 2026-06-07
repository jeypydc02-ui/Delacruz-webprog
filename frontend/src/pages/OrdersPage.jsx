import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';

const statusColors = {
  pending:    { bg: '#fef9c3', color: '#854d0e' },
  confirmed:  { bg: '#dbeafe', color: '#1e40af' },
  processing: { bg: '#f3e8ff', color: '#6b21a8' },
  shipped:    { bg: '#e0e7ff', color: '#3730a3' },
  delivered:  { bg: '#dcfce7', color: '#166534' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b' },
};

function StatusBadge({ status }) {
  const style = statusColors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span
      style={{
        padding: '4px 12px', borderRadius: 999,
        background: style.bg, color: style.color,
        fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const r = await api.get('/orders/my-orders');
      return r.data.orders;
    },
    staleTime: 30_000,
  });

  return (
    <main
      style={{
        maxWidth: 800, margin: '0 auto',
        padding: '2.5rem 1rem', minHeight: '70vh',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Package size={20} color="#e8c547" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>My Orders</h1>
          <p style={{ fontSize: 13, color: '#9e9e9e', marginTop: 2 }}>Track and manage your purchases</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      ) : !data?.length ? (
        <div
          style={{
            textAlign: 'center', padding: '5rem 1rem',
            background: '#fff', borderRadius: 20,
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShoppingBag size={36} color="#e0e0e0" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>No orders yet</h2>
          <p style={{ fontSize: 14, color: '#9e9e9e', marginBottom: 24 }}>
            Start shopping and your orders will appear here.
          </p>
          <Link
            to="/products"
            className="btn-gold"
            style={{ padding: '12px 32px', fontSize: 14 }}
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className="card-lift"
              style={{
                background: '#fff', borderRadius: 16,
                border: '1px solid #f0f0f0',
                padding: '20px', display: 'block',
                textDecoration: 'none', transition: 'all 0.25s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: '#9e9e9e', fontWeight: 600, marginBottom: 2 }}>ORDER NUMBER</p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#1a1a2e' }}>{order.orderNumber}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
              </div>

              {/* Item thumbnails */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
                {order.items.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 56, height: 56, flexShrink: 0,
                      borderRadius: 10, overflow: 'hidden', background: '#f2f2f2',
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div
                    style={{
                      width: 56, height: 56, flexShrink: 0, borderRadius: 10,
                      background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#9e9e9e',
                    }}
                  >
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 12, color: '#9e9e9e' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#1a1a2e' }}>
                    ₱{order.total?.toLocaleString()}
                  </p>
                </div>
                <span style={{ fontSize: 13, color: '#9e9e9e', fontWeight: 600 }}>View details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
