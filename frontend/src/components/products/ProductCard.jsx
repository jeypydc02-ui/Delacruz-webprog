import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToastStore } from '../ui/Toast';

/* Badge style map */
const badgeStyles = {
  'New':        { background: '#e8c547', color: '#1a1a2e' },
  'Just In':    { background: '#1a1a2e', color: '#fff'    },
  'Bestseller': { background: '#0f3460', color: '#e8c547' },
  'Sale':       { background: '#C8102E', color: '#fff'    },
  'Limited':    { background: '#7c3aed', color: '#fff'    },
};

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [imgError, setImgError]           = useState(false);
  const { toggle, isWishlisted }          = useWishlistStore();
  const wishlisted                        = isWishlisted(product._id || product.id);
  const toast                             = useToastStore();

  const displayPrice = product.salePrice || product.price;
  const discount     = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  const imgSrc = imgError
    ? `https://placehold.co/600x600/f2f2f2/9e9e9e?text=${encodeURIComponent(product.name)}`
    : product.image;

  const badge = product.badge
    ? (badgeStyles[product.badge] || { background: '#1a1a2e', color: '#fff' })
    : null;

  return (
    <div
      className="group"
      style={{
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 2px 14px rgba(26,26,46,0.07)',
        border: '1px solid rgba(26,26,46,0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(26,26,46,0.14)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 14px rgba(26,26,46,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* ── Image area ── */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          background: '#f5f5f5',
          flexShrink: 0,
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.55s ease',
          }}
          className="group-hover:scale-105"
          loading="lazy"
        />

        {/* gradient overlay on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,26,46,0.18) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.3s',
          }}
          className="group-hover:opacity-100"
        />

        {/* Badge */}
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.04em',
              background: badge.background,
              color: badge.color,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); toast[wishlisted ? 'info' : 'success'](wishlisted ? 'Removed from wishlist.' : `"${product.name}" added to wishlist! 🤍`); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: wishlisted ? '#fff' : 'rgba(255,255,255,0.88)',
            color: wishlisted ? '#C8102E' : '#aaa',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
            transition: 'all 0.18s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.color = '#C8102E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.color = wishlisted ? '#C8102E' : '#aaa';
          }}
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                background: '#1a1a2e',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 14px',
                borderRadius: 999,
                letterSpacing: '0.06em',
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Info panel ── */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {product.colors.slice(0, 5).map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(idx)}
                title={product.colorNames?.[idx]}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: color,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  outline: selectedColor === idx
                    ? `2px solid #1a1a2e`
                    : '2px solid #e0e0e0',
                  outlineOffset: 1,
                  transition: 'outline-color 0.15s',
                }}
              />
            ))}
            <span style={{ fontSize: 11, color: '#b0b0b0', marginLeft: 2, fontWeight: 500 }}>
              {product.colors.length} colors
            </span>
          </div>
        )}

        {/* Name + price row */}
        <Link
          to={`/products/${product.slug}`}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            {/* Left: name + subtitle + sport */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                className="line-clamp-2"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1a1a2e',
                  lineHeight: 1.3,
                  marginBottom: 2,
                }}
              >
                {product.name}
              </p>
              {product.subtitle && (
                <p
                  className="line-clamp-1"
                  style={{ fontSize: 11, color: '#9e9e9e', fontWeight: 500 }}
                >
                  {product.subtitle}
                </p>
              )}
              <p style={{ fontSize: 11, color: '#c0c0c0', marginTop: 1 }}>{product.sport}</p>
            </div>

            {/* Right: price */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: product.salePrice ? '#C8102E' : '#1a1a2e',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                ₱{displayPrice.toLocaleString()}
              </p>
              {product.salePrice && (
                <>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#bbb',
                      textDecoration: 'line-through',
                      lineHeight: 1.3,
                    }}
                  >
                    ₱{product.price.toLocaleString()}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 10,
                      fontWeight: 800,
                      color: '#C8102E',
                      background: '#fff0f0',
                      borderRadius: 4,
                      padding: '1px 5px',
                      marginTop: 2,
                    }}
                  >
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}