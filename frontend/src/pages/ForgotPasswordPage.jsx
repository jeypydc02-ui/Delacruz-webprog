import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

export default function ForgotPasswordPage() {
  const [step, setStep]         = useState('email'); // 'email' | 'code' | 'reset'
  const [email, setEmail]       = useState('');
  const [code, setCode]         = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const navigate = useNavigate();

  const validatePassword = (p) => {
    if (p.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(p)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(p)) return 'Password must contain at least one number.';
    return null;
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('If that email exists, a reset code has been sent.');
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const verifyCode = (e) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) return setError('Enter the 6-digit code from your email.');
    setStep('reset');
    setSuccess('');
  };

  const doReset = async (e) => {
    e.preventDefault();
    setError('');
    const pwErr = validatePassword(newPass);
    if (pwErr) return setError(pwErr);
    if (newPass !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, newPassword: newPass });
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code.');
    } finally { setLoading(false); }
  };

  const Panel = () => (
    <div className="hidden lg:flex" style={{
      flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '3rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#fff', marginBottom: 8, fontFamily: 'Georgia, serif', letterSpacing: '-2px' }}>JEYP</div>
        <p style={{ color: '#e8c547', fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 32 }}>
          Just Elevate Your Performance
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7 }}>
          Don't worry — it happens to the best of us. We'll get you back into your account.
        </p>
      </div>
    </div>
  );

  const stepTitles = {
    email: { title: 'Forgot password?', sub: "Enter your email and we'll send a reset code." },
    code:  { title: 'Check your email', sub: `We sent a 6-digit code to ${email}` },
    reset: { title: 'Set new password', sub: 'Choose a strong password for your account.' },
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex' }}>
      <Panel />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '3rem 1.5rem', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/" style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', fontFamily: 'Georgia, serif', textDecoration: 'none' }}>JEYP</Link>
          </div>

          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9e9e9e', textDecoration: 'none', marginBottom: 24, fontWeight: 600 }}>
            <ArrowLeft size={15} /> Back to login
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>{stepTitles[step].title}</h1>
          <p style={{ color: '#9e9e9e', fontSize: 14, marginBottom: 28 }}>{stepTitles[step].sub}</p>

          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#fff5f5', border: '1px solid #ffc5c5', color: '#c0392b', fontSize: 14, fontWeight: 500 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', fontSize: 14, fontWeight: 500 }}>
              {success}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={sendCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Email Address</label>
                <input type="email" required placeholder="you@email.com" className="input-base" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '14px', fontSize: 14, width: '100%' }}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={verifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>6-Digit Code</label>
                <input
                  type="text" required placeholder="000000" maxLength={6} className="input-base"
                  style={{ letterSpacing: '0.3em', fontSize: 20, textAlign: 'center', fontWeight: 700 }}
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button type="submit" className="btn-gold" style={{ padding: '14px', fontSize: 14, width: '100%' }}>
                Verify Code
              </button>
              <button type="button" onClick={sendCode} disabled={loading}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9e9e9e', fontWeight: 600 }}>
                {loading ? 'Resending...' : "Didn't receive it? Resend code"}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={doReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} required placeholder="Min. 8 chars, 1 uppercase, 1 number"
                    className="input-base" style={{ paddingRight: 48 }}
                    value={newPass} onChange={(e) => setNewPass(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#444' }}>Confirm Password</label>
                <input type="password" required placeholder="Repeat password" className="input-base" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '14px', fontSize: 14, width: '100%' }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
