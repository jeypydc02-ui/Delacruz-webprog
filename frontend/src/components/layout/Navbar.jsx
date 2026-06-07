import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, LogOut, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../ui/Toast';

const navLinks = [
  {
    label: 'New & Featured', href: '/products',
    sub: [
      { label: 'New Arrivals',  href: '/products?sort=newest' },
      { label: 'Bestsellers',   href: '/products?sort=reviews' },
      { label: 'Running',       href: '/products?sport=Running' },
      { label: 'Basketball',    href: '/products?sport=Basketball' },
    ],
  },
  { label: "Men's",   href: '/products?category=men' },
  { label: "Women's", href: '/products?category=women' },
  { label: "Kids'",   href: '/products?category=kids' },
  { label: 'Sale',    href: '/products?category=sale', accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const userMenuRef = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const totalItems    = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart      = useCartStore((s) => s.openCart);
  const { user, logout } = useAuthStore();
  const toast = useToastStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false); setSearchOpen(false); setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const fn = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); setUserMenuOpen(false); toast.info("You've been signed out."); navigate('/'); };

  const iconBtn = {
    width: 38, height: 38, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#1a1a2e', transition: 'background 0.15s',
  };

  return (
    <>
      {/* Promo bar — only show when not logged in */}
      {!user && (
        <div style={{ background: '#1a1a2e', padding: '8px 16px', textAlign: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            Free delivery & returns for JEYP Members.{' '}
          </span>
          <Link to="/register" style={{ color: '#e8c547', fontWeight: 700, fontSize: 12, textDecoration: 'underline' }}>
            Join Now
          </Link>
        </div>
      )}

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>

            {/* Logo */}
            <Link
              to="/"
              style={{
                flexShrink: 0,
                marginRight: 16,
                fontSize: 24,
                fontWeight: 900,
                color: '#1a1a2e',
                fontFamily: 'Georgia, serif',
                letterSpacing: '-1px',
                textDecoration: 'none',
              }}
            >
              JEYP
            </Link>

            {/* Desktop nav */}
            <div
              className="hidden lg:flex"
              style={{ alignItems: 'center', gap: 2, flex: 1 }}
            >
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: link.accent ? '#e63946' : '#555',
                      transition: 'color 0.15s, background 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    className="hover:bg-gray-50 hover:text-gray-900"
                  >
                    {link.label}
                    {link.sub && <ChevronDown size={12} />}
                  </Link>
                  {link.sub && activeDropdown === link.label && (
                    <div
                      style={{
                        position: 'absolute', top: '100%', left: 0,
                        minWidth: 200, background: '#fff',
                        borderRadius: 12, border: '1px solid #f0f0f0',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        padding: '8px 0', zIndex: 200, marginTop: 4,
                      }}
                    >
                      {link.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          style={{
                            display: 'block', padding: '10px 16px',
                            fontSize: 14, color: '#555', textDecoration: 'none',
                            transition: 'background 0.15s, color 0.15s',
                          }}
                          className="hover:bg-gray-50 hover:text-gray-900"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={iconBtn}
                className="hover:bg-gray-100"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                style={{ ...iconBtn, position: 'relative', textDecoration: 'none' }}
                className="hover:bg-gray-100"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      background: '#e8c547', color: '#1a1a2e',
                      fontSize: 10, fontWeight: 900,
                      width: 16, height: 16, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                style={{ ...iconBtn, position: 'relative' }}
                className="hover:bg-gray-100"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute', top: 2, right: 2,
                      background: '#1a1a2e', color: '#fff',
                      fontSize: 10, fontWeight: 900,
                      width: 16, height: 16, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px 6px 6px', borderRadius: 999,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    className="hover:bg-gray-100"
                  >
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#1a1a2e', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 900, flexShrink: 0,
                      }}
                    >
                      {user.firstName?.[0]?.toUpperCase()}
                    </div>
                    <span className="hidden lg:block" style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                      {user.firstName}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      style={{
                        position: 'absolute', right: 0, top: '100%', marginTop: 8,
                        width: 220, background: '#fff', borderRadius: 14,
                        border: '1px solid #f0f0f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        padding: '8px 0', zIndex: 200,
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{user.firstName} {user.lastName}</p>
                        <p style={{ fontSize: 12, color: '#9e9e9e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                      </div>
                      {[
                        { to: '/profile', Icon: User,    label: 'My Profile' },
                        { to: '/orders',  Icon: Package, label: 'My Orders'  },
                      ].map(({ to, Icon, label }) => (
                        <Link
                          key={to} to={to}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', fontSize: 14, color: '#555',
                            textDecoration: 'none', transition: 'background 0.15s',
                          }}
                          className="hover:bg-gray-50"
                        >
                          <Icon size={15} /> {label}
                        </Link>
                      ))}
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link
                          to="/admin"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#b45309',
                            textDecoration: 'none', transition: 'background 0.15s',
                          }}
                          className="hover:bg-yellow-50"
                        >
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 4, paddingTop: 4 }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '10px 16px', fontSize: 14, color: '#e63946',
                            background: 'none', border: 'none', cursor: 'pointer',
                            textAlign: 'left', transition: 'background 0.15s',
                          }}
                          className="hover:bg-red-50"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 8, marginLeft: 8 }}>
                  <Link
                    to="/login"
                    style={{
                      padding: '6px 16px', fontSize: 14, fontWeight: 600,
                      color: '#555', textDecoration: 'none', borderRadius: 999,
                      border: '2px solid #e0e0e0', transition: 'border-color 0.15s, color 0.15s',
                    }}
                    className="hover:border-gray-900 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      padding: '8px 20px', fontSize: 14, fontWeight: 700,
                      color: '#1a1a2e', textDecoration: 'none', borderRadius: 999,
                      background: 'linear-gradient(135deg,#e8c547,#f5d76e)',
                      boxShadow: '0 2px 10px rgba(232,197,71,0.35)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Join JEYP
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden"
                style={iconBtn}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 0' }}>
              <form
                onSubmit={handleSearch}
                style={{ display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto' }}
              >
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)', color: '#9e9e9e',
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shoes, apparel..."
                    autoFocus
                    style={{
                      width: '100%', paddingLeft: 40, paddingRight: 16,
                      paddingTop: 12, paddingBottom: 12,
                      borderRadius: 999, border: '2px solid #e0e0e0',
                      fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                      background: '#f8f8f8',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1a1a2e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px', borderRadius: 999, border: 'none',
                    background: 'linear-gradient(135deg,#e8c547,#f5d76e)',
                    color: '#1a1a2e', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            <div
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 300,
                background: '#fff', padding: '24px 20px', overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  style={{ fontSize: 22, fontWeight: 900, color: '#1a1a2e', fontFamily: 'Georgia, serif', textDecoration: 'none' }}
                >
                  JEYP
                </Link>
                <button onClick={() => setMobileOpen(false)} style={{ ...iconBtn }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: '12px 8px',
                      fontSize: 16,
                      fontWeight: 600,
                      color: link.accent ? '#e63946' : '#1a1a2e',
                      borderBottom: '1px solid #f5f5f5',
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!user ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      flex: 1, padding: '12px', textAlign: 'center', fontSize: 14, fontWeight: 700,
                      border: '2px solid #1a1a2e', borderRadius: 999, color: '#1a1a2e', textDecoration: 'none',
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      flex: 1, padding: '12px', textAlign: 'center', fontSize: 14, fontWeight: 700,
                      background: 'linear-gradient(135deg,#e8c547,#f5d76e)',
                      borderRadius: 999, color: '#1a1a2e', textDecoration: 'none',
                    }}
                  >
                    Join JEYP
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 8 }}>
                    <p style={{ fontWeight: 700, color: '#1a1a2e' }}>{user.firstName} {user.lastName}</p>
                    <p style={{ fontSize: 12, color: '#9e9e9e' }}>{user.email}</p>
                  </div>
                  {[
                    { to: '/profile', label: 'My Profile' },
                    { to: '/orders',  label: 'My Orders'  },
                  ].map(({ to, label }) => (
                    <Link
                      key={to} to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{ padding: '8px 0', fontSize: 14, fontWeight: 600, color: '#555', textDecoration: 'none' }}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    style={{
                      padding: '8px 0', fontSize: 14, fontWeight: 600, color: '#e63946',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
