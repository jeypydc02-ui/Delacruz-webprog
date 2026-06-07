import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/products/ProductCard';

export default function WishlistPage() {
  const { items, clear } = useWishlistStore();

  return (
    <main style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 20px', minHeight: '60vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: '#1a1a2e', marginBottom: 4 }}>
            Favourites
          </h1>
          <p style={{ fontSize: 13, color: '#9e9e9e' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            style={{ fontSize: 13, color: '#9e9e9e', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#1a1a2e'}
            onMouseLeave={e => e.target.style.color = '#9e9e9e'}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 80, gap: 16, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f2f2f2', borderRadius: '50%' }}>
            <Heart size={40} color="#e8e8e8" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#1a1a2e' }}>No favourites yet</p>
            <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 20 }}>
              Tap the heart icon on any product to save it here.
            </p>
          </div>
          <Link
            to="/products"
            style={{ marginTop: 8, padding: '12px 32px', background: '#1a1a2e', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 999, textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s' }}
            onMouseEnter={e => e.target.style.background = '#0f3460'}
            onMouseLeave={e => e.target.style.background = '#1a1a2e'}
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
