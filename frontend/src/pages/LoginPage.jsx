import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

export default function LoginPage() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const { login, isLoading }    = useAuthStore();
  const toast   = useToastStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back! You are now signed in.');
      navigate(from, { replace: true });
    } else setError(res.error);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex"
        style={{
          flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '3rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div
            style={{
              fontSize: 64, fontWeight: 900, color: '#fff', marginBottom: 8,
              fontFamily: 'Georgia, serif', letterSpacing: '-2px',
            }}
          >
            JEYP
          </div>
          <p style={{ color: '#e8c547', fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 32 }}>
            Just Elevate Your Performance
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7 }}>
            Sign in to access your orders, wishlist, and exclusive member deals.
          </p>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {['Free Delivery', 'Easy Returns', 'Member Deals'].map((b) => (
              <div
                key={b}
                style={{
                  borderRadius: 12, padding: '16px 8px', textAlign: 'center',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', padding: '3rem 1.5rem', background: '#fff',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link
              to="/"
              style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', fontFamily: 'Georgia, serif', textDecoration: 'none' }}
            >
              JEYP
            </Link>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: '#9e9e9e', fontSize: 14, marginBottom: 32 }}>Sign in to your JEYP account</p>

          {error && (
            <div
              style={{
                marginBottom: 16, padding: '12px 16px', borderRadius: 10,
                background: '#fff5f5', border: '1px solid #ffc5c5',
                color: '#c0392b', fontSize: 14, fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Email Address</label>
              <input
                type="email" required placeholder="you@email.com" className="input-base"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required placeholder="••••••••" className="input-base"
                  style={{ paddingRight: 48 }}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#9e9e9e', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
              style={{ padding: '14px', fontSize: 14, marginTop: 8, width: '100%' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#9e9e9e', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#1a1a2e' }}>Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
