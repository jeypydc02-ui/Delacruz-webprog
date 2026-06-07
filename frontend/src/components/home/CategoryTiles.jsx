import { Link } from 'react-router-dom';

const tiles = [
  {
    label: "Men's",
    href: '/products?category=men',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  },
  {
    label: "Women's",
    href: '/products?category=women',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
  },
  {
    label: "Kids'",
    href: '/products?category=kids',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  },
  {
    label: 'Sale',
    href: '/products?category=sale',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    accent: true,
  },
];

export default function CategoryTiles() {
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 1rem' }}>
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-3xl font-black tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: '#111' }}
        >
          Shop By Category
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
        className="md:grid-cols-4"
      >
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            to={tile.href}
            className="group"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
              aspectRatio: '3/4',
              background: '#f2f2f2',
              display: 'block',
            }}
          >
            <img
              src={tile.image}
              alt={tile.label}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
              className="group-hover:scale-105"
              loading="lazy"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.25rem',
              }}
            >
              <h3
                className="text-xl font-black"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: tile.accent ? '#FF6B6B' : '#fff',
                }}
              >
                {tile.label}
              </h3>
              <span
                className="text-xs font-medium group-hover:text-white transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
