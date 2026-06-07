import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

const validatePassword = (p) => {
  if (p.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(p)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(p)) return 'Password must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(p)) return 'Password must contain at least one special character.';
  return null;
};

const StrengthBar = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];
  const colors = ['#e0e0e0', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < score ? colors[score] : '#e0e0e0', transition: 'background 0.2s' }} />
        ))}
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: colors[score] }}>{label}</p>
    </div>
  );
};

export default function RegisterPage() {
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const { register, isLoading } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    const pwErr = validatePassword(form.password);
    if (pwErr) return setError(pwErr);
    const res = await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
    if (res.success) {
      toast.success('Account created! Please check your email for the verification code.');
      navigate('/verify-email', { state: { email: form.email } });
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
            Join thousands of JEYP members enjoying free delivery, exclusive deals, and early access to new drops.
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
          alignItems: 'center', padding: '3rem 1.5rem', background: '#fff', overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link
              to="/"
              style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', fontFamily: 'Georgia, serif', textDecoration: 'none' }}
            >
              JEYP
            </Link>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>Create account</h1>
          <p style={{ color: '#9e9e9e', fontSize: 14, marginBottom: 28 }}>Join the JEYP community today</p>

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>First Name</label>
                <input type="text" required placeholder="Juan" className="input-base" value={form.firstName} onChange={update('firstName')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Last Name</label>
                <input type="text" required placeholder="dela Cruz" className="input-base" value={form.lastName} onChange={update('lastName')} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Email Address</label>
              <input type="email" required placeholder="you@email.com" className="input-base" value={form.email} onChange={update('email')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>
                Phone <span style={{ fontWeight: 400, color: '#9e9e9e' }}>(optional)</span>
              </label>
              <input type="tel" placeholder="+63 900 000 0000" className="input-base" value={form.phone} onChange={update('phone')} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Min. 8 chars, uppercase, number, symbol"
                  className="input-base"
                  style={{ paddingRight: 48 }}
                  value={form.password}
                  onChange={update('password')}
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
              <StrengthBar password={form.password} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Confirm Password</label>
              <input type="password" required placeholder="Repeat password" className="input-base" value={form.confirm} onChange={update('confirm')} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
              style={{ padding: '14px', fontSize: 14, marginTop: 8, width: '100%' }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#9e9e9e', marginTop: 16 }}>
            By creating an account, you agree to JEYP's Terms of Service and Privacy Policy.
          </p>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#9e9e9e', marginTop: 16 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#1a1a2e' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
