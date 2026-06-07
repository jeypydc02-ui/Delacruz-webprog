import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryTiles from '../components/home/CategoryTiles';
import { Link } from 'react-router-dom';

const sports = ['Running', 'Basketball', 'Football', 'Training', 'Lifestyle', 'Golf', 'Tennis', 'Skateboarding'];

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategoryTiles />

      {/* Promo Banner */}
      <section style={{ background: '#111', color: '#fff', padding: '5rem 1.5rem', margin: '2rem 0' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8,
            }}
          >
            Limited Time
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, lineHeight: 1.1,
            }}
          >
            Up to 40% Off — JEYP Sale
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
            Don't miss out on exclusive deals on top JEYP styles.
          </p>
          <Link
            to="/products?category=sale"
            style={{
              display: 'inline-block', padding: '14px 40px',
              background: '#fff', color: '#111',
              fontSize: 14, fontWeight: 700, borderRadius: 999,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            className="hover:bg-gray-100 hover:scale-105"
          >
            Shop Sale
          </Link>
        </div>
      </section>

      {/* Sports Grid */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 24, color: '#111',
          }}
        >
          Shop by Sport
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {sports.map((sport) => (
            <Link
              key={sport}
              to={`/products?sport=${encodeURIComponent(sport)}`}
              style={{
                padding: '10px 22px', border: '2px solid #e5e5e5',
                borderRadius: 999, fontSize: 14, fontWeight: 600,
                color: '#333', textDecoration: 'none',
                transition: 'all 0.2s', display: 'inline-block',
              }}
              className="hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              {sport}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
