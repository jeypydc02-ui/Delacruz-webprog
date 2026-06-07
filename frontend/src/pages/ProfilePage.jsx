import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Package, Lock, ChevronRight,
  Mail, Phone, Shield, Edit3, CheckCircle2,
  AlertCircle, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

/* ── Reusable field wrapper ── */
function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          color: '#9e9e9e',
          marginBottom: 7,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={15}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#c0c0c0',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

/* ── Section card ── */
function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 2px 20px rgba(26,26,46,0.07)',
        border: '1px solid rgba(26,26,46,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: '22px 28px',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(26,26,46,0.25)',
          }}
        >
          <Icon size={18} color="#e8c547" />
        </div>
        <div>
          <h2
            style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 12, color: '#b0b0b0', marginTop: 2 }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '26px 28px' }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, _setAuth, token } = useAuthStore();

  const [tab, setTab]       = useState('profile');
  const [form, setForm]     = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
  });
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirm:         '',
  });
  const [msg,     setMsg]     = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const update     = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const updatePass = (k) => (e) => setPassForm({ ...passForm, [k]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const res = await api.put('/auth/me', form);
      _setAuth(res.data.user, token);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm)
      return setError('Passwords do not match.');
    setLoading(true); setMsg(''); setError('');
    try {
      await api.put('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword:     passForm.newPassword,
      });
      setMsg('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    }
    setLoading(false);
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  const navItems = [
    { id: 'profile',   icon: User,   label: 'Profile',   desc: 'Personal details' },
    { id: 'password',  icon: Shield, label: 'Security',  desc: 'Change password'  },
  ];

  /* icon-input padding helper */
  const withIcon = { paddingLeft: 40 };
  const noIcon   = {};

  return (
    <div
      style={{
        background: 'linear-gradient(155deg, #f8f8f8 0%, #eef0f5 100%)',
        minHeight: '80vh',
      }}
    >
      <main
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '2.5rem 1.25rem 4rem',
        }}
      >
        {/* ── Page title ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Sparkles size={18} color="#e8c547" />
            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#1a1a2e',
                letterSpacing: '-0.5px',
              }}
            >
              My Account
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#b0b0b0', paddingLeft: 28 }}>
            Manage your profile, security, and order history
          </p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* ════════════════════════════════
              SIDEBAR  (desktop only)
          ════════════════════════════════ */}
          <aside
            className="hidden md:flex"
            style={{ width: 230, flexShrink: 0, flexDirection: 'column', gap: 10 }}
          >
            {/* User card */}
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(26,26,46,0.14)',
              }}
            >
              {/* Dark gradient header */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #0f3460 100%)',
                  padding: '26px 20px 22px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* decorative blobs */}
                <div
                  style={{
                    position: 'absolute', top: -30, right: -30,
                    width: 110, height: 110, borderRadius: '50%',
                    background: 'rgba(232,197,71,0.07)',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', bottom: -10, right: 20,
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'rgba(232,197,71,0.04)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Avatar */}
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8c547, #f5d76e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#1a1a2e',
                    marginBottom: 14,
                    boxShadow: '0 0 0 3px rgba(232,197,71,0.35), 0 6px 18px rgba(0,0,0,0.35)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {initials || '?'}
                </div>

                <p
                  style={{
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    marginBottom: 3,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {user?.firstName} {user?.lastName}
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 11,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {user?.email}
                </p>
              </div>

              {/* Nav list */}
              <div style={{ background: '#fff' }}>
                {navItems.map(({ id, icon: Icon, label, desc }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => { setTab(id); setMsg(''); setError(''); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '12px 18px',
                        background: active
                          ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                          : 'transparent',
                        color: active ? '#1a1a2e' : '#777',
                        fontWeight: active ? 700 : 500,
                        fontSize: 13,
                        border: 'none',
                        borderLeft: active ? '3px solid #e8c547' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: active
                            ? 'rgba(232,197,71,0.22)'
                            : '#f4f4f4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.18s',
                        }}
                      >
                        <Icon size={14} color={active ? '#a07a00' : '#bbb'} />
                      </div>
                      <div>
                        <div style={{ lineHeight: 1.2 }}>{label}</div>
                        <div
                          style={{
                            fontSize: 10,
                            color: active ? '#b8960f' : '#ccc',
                            fontWeight: 500,
                            marginTop: 1,
                          }}
                        >
                          {desc}
                        </div>
                      </div>
                    </button>
                  );
                })}

                <Link
                  to="/orders"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 18px',
                    color: '#777',
                    fontWeight: 500,
                    fontSize: 13,
                    textDecoration: 'none',
                    borderTop: '1px solid #f5f5f5',
                    borderLeft: '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: '#f4f4f4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Package size={14} color="#bbb" />
                  </div>
                  <div>
                    <div style={{ lineHeight: 1.2 }}>My Orders</div>
                    <div style={{ fontSize: 10, color: '#ccc', fontWeight: 500, marginTop: 1 }}>
                      Track purchases
                    </div>
                  </div>
                  <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#ddd' }} />
                </Link>
              </div>
            </div>
          </aside>

          {/* ════════════════════════════════
              MAIN CONTENT
          ════════════════════════════════ */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Mobile tab pills */}
            <div
              className="flex md:hidden"
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 5,
                marginBottom: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                gap: 6,
              }}
            >
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setMsg(''); setError(''); }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 8px',
                    borderRadius: 10,
                    border: 'none',
                    background: tab === id
                      ? 'linear-gradient(135deg, #1a1a2e, #0f3460)'
                      : 'transparent',
                    color: tab === id ? '#fff' : '#888',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
              <Link
                to="/orders"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '10px 8px',
                  borderRadius: 10,
                  color: '#888',
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: 'none',
                }}
              >
                <Package size={13} /> Orders
              </Link>
            </div>

            {/* Mobile user info bar */}
            <div
              className="flex md:hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                borderRadius: 16,
                padding: '16px 18px',
                marginBottom: 16,
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8c547, #f5d76e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#1a1a2e',
                  boxShadow: '0 0 0 2px rgba(232,197,71,0.4)',
                  flexShrink: 0,
                }}
              >
                {initials || '?'}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 11,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* ── Alert messages ── */}
            {msg && (
              <div
                style={{
                  marginBottom: 18,
                  padding: '13px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                {msg}
              </div>
            )}
            {error && (
              <div
                style={{
                  marginBottom: 18,
                  padding: '13px 18px',
                  borderRadius: 14,
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  color: '#9f1239',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <AlertCircle size={16} color="#e63946" style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* ════════
                PROFILE FORM
            ════════ */}
            {tab === 'profile' && (
              <SectionCard
                icon={Edit3}
                title="Personal Information"
                subtitle="Update your name and contact details"
              >
                <form onSubmit={handleProfileSave}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <Field label="First Name">
                      <input
                        className="input-base"
                        value={form.firstName}
                        onChange={update('firstName')}
                        style={{ fontSize: 14 }}
                      />
                    </Field>
                    <Field label="Last Name">
                      <input
                        className="input-base"
                        value={form.lastName}
                        onChange={update('lastName')}
                        style={{ fontSize: 14 }}
                      />
                    </Field>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Field label="Email Address" icon={Mail}>
                      <input
                        className="input-base"
                        value={user?.email}
                        disabled
                        style={{ ...withIcon, fontSize: 14, background: '#fafafa', color: '#b0b0b0', cursor: 'not-allowed' }}
                      />
                    </Field>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <Field label="Phone Number" icon={Phone}>
                      <input
                        className="input-base"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+63 900 000 0000"
                        style={{ ...withIcon, fontSize: 14 }}
                      />
                    </Field>
                  </div>

                  <div
                    style={{
                      paddingTop: 20,
                      borderTop: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ padding: '11px 30px', fontSize: 13 }}
                    >
                      {loading ? 'Saving…' : 'Save Changes'}
                    </button>
                    <span style={{ fontSize: 11, color: '#ccc' }}>
                      Changes take effect immediately
                    </span>
                  </div>
                </form>
              </SectionCard>
            )}

            {/* ════════
                PASSWORD FORM
            ════════ */}
            {tab === 'password' && (
              <SectionCard
                icon={Shield}
                title="Change Password"
                subtitle="Keep your account secure with a strong password"
              >
                <form onSubmit={handlePasswordChange}>
                  <div style={{ marginBottom: 16 }}>
                    <Field label="Current Password" icon={Lock}>
                      <input
                        type="password"
                        className="input-base"
                        value={passForm.currentPassword}
                        onChange={updatePass('currentPassword')}
                        required
                        style={{ ...withIcon, fontSize: 14 }}
                      />
                    </Field>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Field label="New Password" icon={Lock}>
                      <input
                        type="password"
                        className="input-base"
                        value={passForm.newPassword}
                        onChange={updatePass('newPassword')}
                        required
                        style={{ ...withIcon, fontSize: 14 }}
                      />
                    </Field>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <Field label="Confirm New Password" icon={Lock}>
                      <input
                        type="password"
                        className="input-base"
                        value={passForm.confirm}
                        onChange={updatePass('confirm')}
                        required
                        style={{ ...withIcon, fontSize: 14 }}
                      />
                    </Field>
                  </div>

                  {/* Password tips */}
                  <div
                    style={{
                      background: '#fafafa',
                      borderRadius: 12,
                      padding: '14px 16px',
                      marginBottom: 24,
                      fontSize: 12,
                      color: '#999',
                      lineHeight: 1.8,
                    }}
                  >
                    <p style={{ fontWeight: 700, color: '#666', marginBottom: 4 }}>
                      Password requirements:
                    </p>
                    <p>• At least 8 characters long</p>
                    <p>• Mix of uppercase and lowercase letters</p>
                    <p>• At least one number or symbol</p>
                  </div>

                  <div style={{ paddingTop: 4 }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ padding: '11px 30px', fontSize: 13 }}
                    >
                      {loading ? 'Updating…' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </SectionCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}