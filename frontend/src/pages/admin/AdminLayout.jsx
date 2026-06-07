import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, BarChart2, Archive, ChevronRight, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../components/ui/Toast';

const links = [
  { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/products',    icon: Package,         label: 'Products'   },
  { to: '/admin/orders',      icon: ShoppingCart,    label: 'Orders'     },
  { to: '/admin/inventory',   icon: Archive,         label: 'Inventory'  },
  { to: '/admin/analytics',   icon: BarChart2,       label: 'Analytics'  },
  { to: '/admin/users',       icon: Users,           label: 'Users'      },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuthStore();
  const toast = useToastStore();

  const handleLogout = () => {
    logout();
    toast.info("You've been signed out.");
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setOpen(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
          textDecoration: 'none',
          color: active ? '#1a1a2e' : 'rgba(255,255,255,0.65)',
          background: active ? 'linear-gradient(135deg,#e8c547,#f5d76e)' : 'transparent',
          transition: 'all 0.18s',
          boxShadow: active ? '0 2px 8px rgba(232,197,71,0.35)' : 'none',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}}
      >
        <Icon size={16} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{label}</span>
        {active && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
      </Link>
    );
  };

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#e8c547,#f5d76e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>J</span>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px', lineHeight: 1 }}>JEYP</p>
            <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 14px 8px' }}>Navigation</p>
        {links.map((l) => <NavLink key={l.to} {...l} />)}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#1a1a2e', background: 'linear-gradient(135deg,#e8c547,#f5d76e)', flexShrink: 0 }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>{user?.firstName} {user?.lastName}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize', lineHeight: 1 }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: '#ff8080', background: 'rgba(255,107,107,0.1)',
            border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.2)'; e.currentTarget.style.color = '#ff5555'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; e.currentTarget.style.color = '#ff8080'; }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  const currentLabel = links.find(l => l.to === location.pathname)?.label || 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      {/* Desktop sidebar */}
      <aside className="lg:flex" style={{
        display: 'none', flexDirection: 'column',
        width: 240, flexShrink: 0, background: '#1a1a2e',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} onClick={() => setOpen(false)} />
          <aside style={{ position: 'relative', width: 260, display: 'flex', flexDirection: 'column', background: '#1a1a2e', zIndex: 1 }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex' }}
            >
              <X size={16} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #e8eaed',
          padding: '0 24px', height: 60,
          display: 'flex', alignItems: 'center', gap: 14,
          position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <button
            className="lg:hidden"
            style={{ display: 'flex', padding: 8, borderRadius: 8, border: 'none', background: '#f4f5f7', cursor: 'pointer', color: '#1a1a2e' }}
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8c547' }} />
            <h1 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>{currentLabel}</h1>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12.5, color: '#6b7280', textDecoration: 'none',
                fontWeight: 600, padding: '6px 12px', borderRadius: 8,
                background: '#f4f5f7', border: '1px solid #e8eaed',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e8eaed'; e.currentTarget.style.color = '#1a1a2e'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f4f5f7'; e.currentTarget.style.color = '#6b7280'; }}
            >
              <Store size={13} /> View Store
            </Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
