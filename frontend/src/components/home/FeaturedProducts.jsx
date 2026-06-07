import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useProducts';
import ProductCard from '../products/ProductCard';

function SkeletonCard() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 14px rgba(26,26,46,0.06)',
      }}
    >
      <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%' }} />
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 11, borderRadius: 6, width: '50%' }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '80%' }} />
        <div className="skeleton" style={{ height: 12, borderRadius: 6, width: '60%' }} />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '4rem 1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#e8c547',
              marginBottom: 4,
            }}
          >
            Top Picks
          </p>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#1a1a2e',
              fontFamily: 'var(--font-display)',
              lineHeight: 1,
            }}
          >
            Featured
          </h2>
        </div>

        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 700,
            color: '#1a1a2e',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: 999,
            border: '1.5px solid #e0e0e0',
            transition: 'all 0.18s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1a1a2e';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#1a1a2e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#1a1a2e';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        >
          Shop All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
        }}
        className="sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : products?.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
      </div>
    </section>
  );
}