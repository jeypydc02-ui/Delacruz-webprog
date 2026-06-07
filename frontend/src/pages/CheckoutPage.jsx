import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Truck, RotateCcw, CreditCard, Smartphone, Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import { api } from '../lib/api';

const paymentMethods = [
  { id: 'GCash',               label: 'GCash',               icon: Smartphone },
  { id: 'PayMaya',             label: 'PayMaya',             icon: Smartphone },
  { id: 'Credit / Debit Card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'Cash on Delivery',    label: 'Cash on Delivery',    icon: Truck },
];

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      border: '1.5px solid #e8e8e8',
      padding: '22px 20px',
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 18 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, half }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: half ? 'span 1' : undefined }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>{label}</label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, clearCart, fetchCart } = useCartStore();
  const { user, token }      = useAuthStore();
  const navigate             = useNavigate();
  const toast                = useToastStore();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    if (!token) navigate('/login', { state: { from: '/checkout' }, replace: true });
    else fetchCart(); // Fetch cart from backend to ensure fresh data
  }, [token, navigate, fetchCart]);

  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '',        phone:  user?.phone || '',
    street: '', city: 'Quezon City', province: 'Metro Manila', zip: '',
  });
  const [payment, setPayment]   = useState('GCash');
  const [notes, setNotes]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [orderNum, setOrderNum] = useState('');

  const up = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const shippingAddress = { ...form };
      const res = token
        ? await api.post('/orders/checkout', { shippingAddress, paymentMethod: payment, notes })
        : await api.post('/orders/guest', {
            items: items.map(i => ({ productId: i.product._id || i.product.id, quantity: i.quantity, size: i.size, color: i.color })),
            shippingAddress, paymentMethod: payment, notes,
          });
      setOrderNum(res.data.order.orderNumber);
      clearCart();
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order. Please try again.');
    }
    setLoading(false);
  };

  /* ── Order confirmed ── */
  if (orderNum) return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 440, width: '100%', background: '#fff', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={36} color="#e8c547" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', marginBottom: 8 }}>Order Confirmed!</h1>
        <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 20 }}>Thank you for shopping with JEYP!</p>
        <div style={{ background: '#f8f8f8', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: '#9e9e9e', marginBottom: 4 }}>Order Number</p>
          <p style={{ fontWeight: 900, fontSize: 18, color: '#1a1a2e' }}>{orderNum}</p>
        </div>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
          We'll send a confirmation to <strong>{form.email}</strong>
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {user && <Link to="/orders" className="btn-dark" style={{ flex: 1, padding: '13px 0', fontSize: 13, textAlign: 'center', borderRadius: 999, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>My Orders</Link>}
          <Link to="/products" className="btn-gold" style={{ flex: 1, padding: '13px 0', fontSize: 13, textAlign: 'center', borderRadius: 999, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Continue Shopping</Link>
        </div>
      </div>
    </main>
  );

  /* ── Empty bag ── */
  if (!items.length) return (
    <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <ShoppingBag size={52} color="#e0e0e0" style={{ marginBottom: 16 }} />
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Your bag is empty</h1>
      <Link to="/products" className="btn-gold" style={{ marginTop: 12, padding: '12px 28px', fontSize: 13, borderRadius: 999, textDecoration: 'none' }}>Shop Now</Link>
    </main>
  );

  const inputStyle = {
    width: '100%', border: '2px solid #e0e0e0', borderRadius: 10,
    padding: '11px 14px', fontSize: 13, color: '#1a1a2e',
    background: '#fff', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  };

  return (
    <main style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 16px 60px' }}>
      <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 28 }}>Checkout</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* ── Left: form ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fff0f1', border: '1.5px solid #ffcdd2', color: '#e63946', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Contact */}
          <SectionCard title="Contact Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="First Name">
                <input required style={inputStyle} value={form.firstName} onChange={up('firstName')} placeholder="Juan"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
              <Field label="Last Name">
                <input required style={inputStyle} value={form.lastName} onChange={up('lastName')} placeholder="dela Cruz"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
              <Field label="Email">
                <input required type="email" style={{ ...inputStyle, gridColumn: 'span 2' }} value={form.email} onChange={up('email')} placeholder="you@email.com"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
              <Field label="Phone">
                <input type="tel" style={{ ...inputStyle, gridColumn: 'span 2' }} value={form.phone} onChange={up('phone')} placeholder="+63 900 000 0000"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Delivery Address">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Street Address">
                <input required style={inputStyle} value={form.street} onChange={up('street')} placeholder="123 Rizal Ave"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="City">
                  <input required style={inputStyle} value={form.city} onChange={up('city')}
                    onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </Field>
                <Field label="Province">
                  <input style={inputStyle} value={form.province} onChange={up('province')}
                    onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
                </Field>
              </div>
              <Field label="ZIP Code">
                <input required style={{ ...inputStyle, maxWidth: 160 }} value={form.zip} onChange={up('zip')} placeholder="1100"
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
              <Field label={<>Order Notes <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span></>}>
                <textarea style={{ ...inputStyle, height: 80, resize: 'none' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special instructions..."
                  onFocus={e => e.target.style.borderColor='#1a1a2e'} onBlur={e => e.target.style.borderColor='#e0e0e0'} />
              </Field>
            </div>
          </SectionCard>

          {/* Payment */}
          <SectionCard title="Payment Method">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {paymentMethods.map(({ id, label, icon: Icon }) => {
                const active = payment === id;
                return (
                  <label key={id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '13px 14px', borderRadius: 12, cursor: 'pointer',
                    border: `2px solid ${active ? '#1a1a2e' : '#e0e0e0'}`,
                    background: active ? '#f8f8f8' : '#fff',
                    transition: 'all 0.15s',
                  }}>
                    <input type="radio" name="payment" value={id} checked={active} onChange={() => setPayment(id)} style={{ display: 'none' }} />
                    <Icon size={16} color={active ? '#1a1a2e' : '#9e9e9e'} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#1a1a2e' : '#666', flex: 1 }}>{label}</span>
                    {active && (
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e8c547' }} />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </SectionCard>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-gold" style={{
            width: '100%', padding: '16px 0', fontSize: 15, fontWeight: 900,
            borderRadius: 999, letterSpacing: '0.02em',
            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Placing Order…' : `Place Order — ₱${total.toLocaleString()}`}
          </button>
        </form>

        {/* ── Right: order summary ── */}
        <div style={{ position: 'sticky', top: 100 }}>
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8e8e8', padding: '22px 20px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 18 }}>Order Summary</h2>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 280, overflowY: 'auto', marginBottom: 18 }}>
              {items.map(item => (
                <div key={item.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', background: '#f2f2f2', flexShrink: 0 }}>
                    {item.product.image && <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 3 }}
                      className="line-clamp-2">{item.product.name}</p>
                    <p style={{ fontSize: 11, color: '#9e9e9e', marginBottom: 4 }}>Size: {item.size} · Qty: {item.quantity}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e' }}>₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1.5px solid #f0f0f0', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>₱{total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#666' }}>Delivery</span>
                <span style={{ fontWeight: 700, color: '#2ecc71' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #f0f0f0', paddingTop: 12, marginTop: 2 }}>
                <span style={{ fontWeight: 900, fontSize: 15, color: '#1a1a2e' }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 16, color: '#1a1a2e' }}>₱{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Perks */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9e9e9e' }}>
                <Truck size={13} /><span>Free delivery for JEYP Members</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9e9e9e' }}>
                <RotateCcw size={13} /><span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}