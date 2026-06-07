import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  show: (message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    set({ toasts: [...get().toasts, { id, message, type, duration }] });
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  success: (msg, dur) => get().show(msg, 'success', dur),
  error:   (msg, dur) => get().show(msg, 'error',   dur),
  info:    (msg, dur) => get().show(msg, 'info',    dur),
  warning: (msg, dur) => get().show(msg, 'warning', dur),
}));

const icons = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  info:    <Info size={18} />,
  warning: <AlertCircle size={18} />,
};

const colors = {
  success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', text: '#15803d' },
  error:   { bg: '#fff1f2', border: '#fda4af', icon: '#dc2626', text: '#b91c1c' },
  info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', text: '#1d4ed8' },
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706', text: '#b45309' },
};

function ToastItem({ id, message, type, duration }) {
  const [visible, setVisible] = useState(false);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exit  = setTimeout(() => { setVisible(false); setTimeout(() => dismiss(id), 300); }, duration);
    return () => { clearTimeout(enter); clearTimeout(exit); };
  }, [id, duration, dismiss]);

  const c = colors[type] || colors.info;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: 12, padding: '12px 14px', minWidth: 280, maxWidth: 360,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      transform: visible ? 'translateX(0)' : 'translateX(110%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.28s cubic-bezier(.22,1,.36,1), opacity 0.28s ease',
      pointerEvents: 'auto',
    }}>
      <span style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}>{icons[type]}</span>
      <p style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: c.text, lineHeight: 1.4, margin: 0 }}>{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => dismiss(id), 300); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.icon, opacity: 0.6, padding: 0, flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none', alignItems: 'flex-end',
    }}>
      {toasts.map((t) => <ToastItem key={t.id} {...t} />)}
    </div>
  );
}
