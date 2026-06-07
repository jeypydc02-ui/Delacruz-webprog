import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Trash2, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../ui/Toast';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, fetchCart } = useCartStore();
  const toast = useToastStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Fetch fresh cart data from backend when drawer opens (if logged in)
  useEffect(() => {
    if (isOpen && token) fetchCart();
  }, [isOpen, token, fetchCart]);

  const handleCheckout = () => {
    closeCart();
    navigate(token ? '/checkout' : '/login', token ? undefined : { state: { from: '/checkout' } });
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 200,
          backdropFilter: 'blur(2px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── Drawer Panel ── */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0,
          height: '100%', width: '100%', maxWidth: 420,
          background: '#fff',
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div style={{
          background: '#1a1a2e',
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="#e8c547" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '0.02em' }}>
              Your Bag
            </span>
            {totalQty > 0 && (
              <span style={{
                background: '#e8c547', color: '#1a1a2e',
                borderRadius: 999, fontSize: 11, fontWeight: 800,
                padding: '2px 7px', lineHeight: 1.5,
              }}>
                {totalQty}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: 16, textAlign: 'center', padding: '40px 0',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#f2f2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingBag size={36} color="#9e9e9e" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 6 }}>
                  Your bag is empty
                </p>
                <p style={{ fontSize: 13, color: '#9e9e9e' }}>
                  Sign in and start shopping.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-dark"
                style={{ padding: '12px 32px', fontSize: 13, marginTop: 8 }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, idx) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex', gap: 14,
                    padding: '16px 0',
                    borderBottom: idx < items.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: 88, height: 88, flexShrink: 0,
                    background: '#f2f2f2', borderRadius: 10, overflow: 'hidden',
                    border: '1px solid #e8e8e8',
                  }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 700, fontSize: 13, color: '#1a1a2e',
                      lineHeight: 1.35, marginBottom: 2,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {item.product.name}
                    </p>

                    <div style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 11, color: '#666', background: '#f5f5f5',
                        padding: '2px 7px', borderRadius: 4,
                      }}>
                        Size {item.size}
                      </span>
                      <span style={{
                        fontSize: 11, color: '#666', background: '#f5f5f5',
                        padding: '2px 7px', borderRadius: 4,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <span style={{
                          display: 'inline-block', width: 10, height: 10,
                          borderRadius: '50%', border: '1px solid #ccc',
                          background: item.color, flexShrink: 0,
                        }} />
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty stepper */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        border: '1.5px solid #e0e0e0', borderRadius: 999,
                        padding: '3px 10px',
                      }}>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          style={{
                            width: 20, height: 20, border: 'none', background: 'none',
                            cursor: 'pointer', color: '#666', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', padding: 0,
                          }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center', color: '#1a1a2e' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          style={{
                            width: 20, height: 20, border: 'none', background: 'none',
                            cursor: 'pointer', color: '#666', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', padding: 0,
                          }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Price + delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => { removeItem(item.key); toast.info('Item removed from cart.'); }}
                          style={{
                            width: 26, height: 26, border: 'none',
                            background: 'none', cursor: 'pointer',
                            color: '#bbb', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%', transition: 'all 0.15s', padding: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#e63946'; e.currentTarget.style.background = '#fff0f1'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#bbb'; e.currentTarget.style.background = 'none'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid #f0f0f0',
            padding: '18px 24px 24px',
            background: '#fff',
          }}>
            {/* Subtotal row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
                ₱{subtotal.toLocaleString()}
              </span>
            </div>
            {/* Delivery */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Delivery</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2ecc71' }}>Free</span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="btn-gold"
              style={{ width: '100%', padding: '14px 0', fontSize: 14, letterSpacing: '0.03em' }}
            >
              {token
                ? `Checkout — ₱${subtotal.toLocaleString()}`
                : 'Sign In to Checkout'}
            </button>

            {!token && (
              <p style={{
                textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 12,
              }}>
                Free delivery & returns for JEYP Members
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}