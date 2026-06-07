import { Link } from 'react-router-dom';
import { AtSign, Globe, Rss, Send, MapPin } from 'lucide-react';

const footerLinks = [
  {
    title: 'Resources',
    links: [
      { label: 'Find a Store',       href: '#' },
      { label: 'Become a Member',    href: '#' },
      { label: 'Running Shoe Finder',href: '#' },
      { label: 'Product Advice',     href: '#' },
      { label: 'Send Us Feedback',   href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Get Help',        href: '#' },
      { label: 'Order Status',    href: '#' },
      { label: 'Delivery',        href: '#' },
      { label: 'Returns',         href: '#' },
      { label: 'Payment Options', href: '#' },
      { label: 'Contact Us',      href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About JEYP',    href: '#' },
      { label: 'News',          href: '#' },
      { label: 'Careers',       href: '#' },
      { label: 'Investors',     href: '#' },
      { label: 'Sustainability', href: '#' },
      { label: 'Impact',        href: '#' },
    ],
  },
];

const socials = [
  { Icon: AtSign, href: '#', label: 'Twitter / X' },
  { Icon: Globe,  href: '#', label: 'Instagram'   },
  { Icon: Rss,    href: '#', label: 'Facebook'    },
  { Icon: Send,   href: '#', label: 'YouTube'     },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Sale',  href: '#' },
  { label: 'Terms of Use',   href: '#' },
  { label: 'Cookie Policy',  href: '#' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #111118 0%, #0d0d14 100%)',
        color: '#fff',
        marginTop: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold accent line at top */}
      <div
        style={{
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #e8c547 30%, #f5d76e 50%, #e8c547 70%, transparent 100%)',
        }}
      />

      {/* Subtle background decoration */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,197,71,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,52,96,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '52px 24px 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Top row: brand + links ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 40,
            marginBottom: 48,
          }}
          className="lg:grid-cols-footer"
        >
          {/* Brand column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              gridColumn: '1 / -1',
            }}
          >
            {/* JEYP wordmark */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                  fontFamily: 'Arial Black, Impact, sans-serif',
                }}
              >
                JEYP
              </span>
              <div
                style={{
                  height: 24,
                  width: 2,
                  background: '#e8c547',
                  borderRadius: 2,
                  opacity: 0.8,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Premium Store
              </span>
            </div>

            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 1.6,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              Crafted for those who move with purpose. Quality gear, delivered with care.
            </p>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'rgba(255,255,255,0.07)',
                marginBottom: 28,
              }}
            />
          </div>

          {/* Links grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              gridColumn: '1 / -1',
            }}
          >
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#e8c547',
                    marginBottom: 16,
                  }}
                >
                  {section.title}
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        style={{
                          fontSize: 13,
                          color: 'rgba(255,255,255,0.5)',
                          textDecoration: 'none',
                          transition: 'color 0.15s',
                          display: 'inline-block',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#fff')}
                        onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Follow Us ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingBottom: 28,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            marginBottom: 24,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#e8c547',
                marginBottom: 12,
              }}
            >
              Follow Us
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e8c547';
                    e.currentTarget.style.color = '#1a1a2e';
                    e.currentTarget.style.borderColor = '#e8c547';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Location badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <MapPin size={13} color="#e8c547" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              Philippines
            </span>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            © 2026 JEYP Store. All rights reserved.
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 0', alignItems: 'center' }}>
            {legalLinks.map((link, i) => (
              <span key={link.label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ color: 'rgba(255,255,255,0.12)', margin: '0 10px', fontSize: 11 }}>
                    ·
                  </span>
                )}
                <Link
                  to={link.href}
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.3)')}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}