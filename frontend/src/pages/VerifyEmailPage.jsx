import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const [digits, setDigits]     = useState(['', '', '', '', '', '']);
  const [error, setError]       = useState('');
  const [resent, setResent]     = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs               = useRef([]);
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';
  const { verifyEmail, resendCode, isLoading } = useAuthStore();

  useEffect(() => { if (!email) navigate('/register'); }, [email]);

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleDigit = (idx, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return setError('Please enter all 6 digits.');
    setError('');
    const res = await verifyEmail(email, code);
    if (res.success) navigate('/', { replace: true });
    else setError(res.error);
  };

  const handleResend = async () => {
    setResent(false);
    const res = await resendCode(email);
    if (res.success) { setResent(true); setCountdown(60); setDigits(['', '', '', '', '', '']); inputRefs.current[0]?.focus(); }
    else setError(res.error);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#fafafa' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', padding: 32, textAlign: 'center' }}>
        {/* Icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: 'linear-gradient(135deg,#1a1a2e,#0f3460)' }}>
          <MailCheck size={28} color="#e8c547" />
        </div>

        {/* Logo */}
        <Link to="/" style={{ fontSize: 20, fontWeight: 900, color: '#1a1a2e', marginBottom: 4, textDecoration: 'none', display: 'block', fontFamily: 'Georgia, serif' }}>
          JEYP
        </Link>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>Check your email</h1>
        <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 4 }}>We sent a 6-digit code to</p>
        <p style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 13, marginBottom: 24 }}>{email}</p>

        {/* Messages */}
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}
        {resent && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', fontSize: 13, fontWeight: 600 }}>
            New code sent! Check your inbox.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* OTP inputs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }} onPaste={handlePaste}>
            {digits.map((d, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => (inputRefs.current[idx] = el)}
                value={d}
                onChange={(e) => handleDigit(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: 48,
                  height: 48,
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: 'center',
                  borderRadius: 12,
                  border: '1.5px solid #e8e8e8',
                  background: '#fff',
                  color: '#1a1a2e',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a1a2e'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              />
            ))}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length < 6}
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              background: '#e8c547',
              color: '#1a1a2e',
              border: 'none',
              cursor: digits.join('').length < 6 || isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading || digits.join('').length < 6 ? 0.6 : 1,
              transition: 'background 0.2s',
              marginBottom: 16,
            }}
            onMouseEnter={(e) => {
              if (!isLoading && digits.join('').length === 6) e.target.style.background = '#d4af37';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#e8c547';
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend code */}
        <p style={{ fontSize: 13, color: '#9e9e9e' }}>
          Didn't receive the code?{' '}
          {countdown > 0 ? (
            <span style={{ color: '#9e9e9e' }}>Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                fontWeight: 700,
                color: '#1a1a2e',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.opacity = 0.7}
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              Resend code
            </button>
          )}
        </p>

        {/* Wrong email link */}
        <p style={{ fontSize: 12, color: '#9e9e9e', marginTop: 16 }}>
          Wrong email?{' '}
          <Link
            to="/register"
            style={{
              color: '#1a1a2e',
              fontWeight: 600,
              textDecoration: 'underline',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = 0.7}
            onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            Go back
          </Link>
        </p>
      </div>
    </main>
  );
}
