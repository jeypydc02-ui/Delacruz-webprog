import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, ArrowLeft, CheckCircle, Truck, Home } from 'lucide-react';
import { api } from '../lib/api';

const steps = [
  { key: 'pending',    label: 'Order Placed',  icon: CheckCircle },
  { key: 'confirmed',  label: 'Confirmed',     icon: CheckCircle },
  { key: 'processing', label: 'Processing',    icon: Package },
  { key: 'shipped',    label: 'Shipped',       icon: Truck },
  { key: 'delivered',  label: 'Delivered',     icon: Home },
];

const statusIdx = (s) => steps.findIndex(st => st.key === s);

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => { const r = await api.get(`/orders/${id}`); return r.data.order; },
  });

  /* ── Loading skeleton ── */
  if (isLoading) return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 32, background: '#f2f2f2', borderRadius: 12, width: '30%' }} />
        <div style={{ height: 24, background: '#f2f2f2', borderRadius: 8, width: '20%' }} />
        <div style={{ height: 280, background: '#f2f2f2', borderRadius: 18 }} />
        <div style={{ height: 200, background: '#f2f2f2', borderRadius: 18 }} />
      </div>
    </main>
  );

  /* ── Error state ── */
  if (isError || !data) return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
      <p style={{ color: '#9e9e9e', marginBottom: 24 }}>Order not found.</p>
      <Link to="/orders" style={{ color: '#1a1a2e', fontWeight: 700, textDecoration: 'underline' }}>← Back to Orders</Link>
    </main>
  );

  const currentStep = statusIdx(data.orderStatus);
  const getStatusColor = (status) => {
    if (status === 'delivered') return { bg: '#dcfce7', text: '#166534' };
    if (status === 'cancelled') return { bg: '#fee2e2', text: '#991b1b' };
    if (status === 'shipped') return { bg: '#e0e7ff', text: '#3730a3' };
    return { bg: '#fef3c7', text: '#92400e' };
  };
  const statusColor = getStatusColor(data.orderStatus);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      {/* Back button */}
      <button onClick={() => window.history.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#9e9e9e', marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>{data.orderNumber}</h1>
          <p style={{ fontSize: 13, color: '#9e9e9e' }}>{new Date(data.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span style={{ background: statusColor.bg, color: statusColor.text, padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'capitalize' }}>
          {data.orderStatus}
        </span>
      </div>

      {/* Tracking */}
      {data.orderStatus !== 'cancelled' && (
        <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Order Tracking</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 2, background: '#f0f0f0', zIndex: 0 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #1a1a2e, #e8c547)', width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%`, transition: 'width 0.3s ease' }} />
            </div>
            {steps.map((step, idx) => {
              const done = idx <= currentStep;
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 10, position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', borderColor: done ? '#1a1a2e' : '#e0e0e0', background: done ? 'linear-gradient(135deg, #1a1a2e, #0f3460)' : '#fff', color: done ? '#e8c547' : '#9e9e9e', transition: 'all 0.3s' }}>
                    <Icon size={16} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: done ? '#1a1a2e' : '#9e9e9e', textAlign: 'center' }}>{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Items</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: i < data.items.length - 1 ? 16 : 0, borderBottom: i < data.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#f2f2f2', flexShrink: 0, border: '1px solid #e8e8e8' }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: '#9e9e9e' }}>Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', whiteSpace: 'nowrap' }}>₱{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ borderTop: '1.5px solid #e8e8e8', marginTop: 20, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#9e9e9e' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₱{data.subtotal?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#9e9e9e' }}>Delivery</span>
            <span style={{ fontWeight: 600, color: '#22c55e' }}>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, borderTop: '1.5px solid #e8e8e8', paddingTop: 12, marginTop: 4, color: '#1a1a2e' }}>
            <span>Total</span>
            <span>₱{data.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <MapPin size={16} color="#9e9e9e" />
            <h3 style={{ fontSize: 12, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</h3>
          </div>
          {data.shippingAddress && (
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>{data.shippingAddress.firstName} {data.shippingAddress.lastName}</p>
              <p>{data.shippingAddress.street}</p>
              <p>{data.shippingAddress.city}, {data.shippingAddress.province} {data.shippingAddress.zip}</p>
              <p style={{ color: '#9e9e9e', marginTop: 6 }}>{data.shippingAddress.phone}</p>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <CreditCard size={16} color="#9e9e9e" />
            <h3 style={{ fontSize: 12, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</h3>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>{data.paymentMethod}</p>
          <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'capitalize', background: data.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7', color: data.paymentStatus === 'paid' ? '#166534' : '#92400e' }}>
            {data.paymentStatus}
          </span>
        </div>
      </div>
    </main>
  );
}
