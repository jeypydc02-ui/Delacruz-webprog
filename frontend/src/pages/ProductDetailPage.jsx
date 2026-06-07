import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ZoomIn, ChevronLeft, ChevronRight, Send, X } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import ProductCard from '../components/products/ProductCard';
import { products as localProducts } from '../data/products';
import { api } from '../lib/api';

// True when VITE_API_URL is set in .env — switches the app from local mock data to real backend
const USE_REAL_API = !!import.meta.env.VITE_API_URL;

function StarRating({ rating, size = 14, interactive = false, value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || value || 0) : rating;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(star => (
        <Star key={star} size={size}
          style={{
            color: star <= display ? '#e8c547' : '#e0e0e0',
            fill: star <= display ? '#e8c547' : '#e0e0e0',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const qc = useQueryClient();
  const { data: product, isLoading, isError } = useProduct(slug);
  const [selectedSize, setSelectedSize]         = useState(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activeImg, setActiveImg]               = useState(0);
  const [zoomed, setZoomed]                     = useState(false);
  const [sizeError, setSizeError]               = useState(false);
  const [added, setAdded]                       = useState(false);
  const [reviewForm, setReviewForm]             = useState({ rating: 0, title: '', body: '' });
  const [reviewError, setReviewError]           = useState('');
  const [reviewSuccess, setReviewSuccess]       = useState(false);

  const addItem  = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);
  const { toggle, isWishlisted } = useWishlistStore();
  const { user, token } = useAuthStore();
  const toast = useToastStore();

  // Normalize product ID — local mock products use numeric `id`, DB products use `_id`
  const productId = product?._id || product?.id;

  const { data: reviewData } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const r = await api.get(`/products/${productId}/reviews`);
      return r.data;
    },
    // Only hit the API when VITE_API_URL is set AND product has a real MongoDB ObjectId
    enabled: USE_REAL_API && !!product?._id && /^[a-f\d]{24}$/i.test(product._id),
  });

  const submitReview = useMutation({
    mutationFn: (data) => api.post(`/products/${productId}/reviews`, data),
    onSuccess: () => {
      setReviewSuccess(true);
      setReviewForm({ rating: 0, title: '', body: '' });
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      qc.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (err) => setReviewError(err.response?.data?.message || 'Failed to submit review.'),
  });

  // Derive userReview before early returns so useEffect hook order stays consistent
  const reviewsEarly   = reviewData?.reviews || [];
  const userReviewEarly = user ? reviewsEarly.find(r => r.user === user._id || r.user?._id === user._id) : null;

  // Pre-fill form when user's existing review loads — hook must be before early returns
  useEffect(() => {
    if (userReviewEarly) {
      setReviewForm({ rating: userReviewEarly.rating, title: userReviewEarly.title || '', body: userReviewEarly.body });
    }
  }, [userReviewEarly?._id]);

  /* ── Loading skeleton ── */
  if (isLoading) return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
        <div style={{ aspectRatio: '1/1', background: '#f2f2f2', borderRadius: 20, maxHeight: 480 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[240, 160, 120, 200].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: i === 0 ? 32 : 18, width: w, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );

  /* ── Error state ── */
  if (isError || !product) return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Product not found</h1>
      <button onClick={() => navigate('/products')} className="btn-dark" style={{ padding: '12px 28px', fontSize: 14 }}>
        Back to Products
      </button>
    </div>
  );

  const displayPrice  = product.salePrice || product.price;
  const wishlisted    = isWishlisted(productId);
  const related       = localProducts.filter(p => p.sport === product.sport && (p._id || p.id) !== productId).slice(0, 4);
  const allImages     = [product.image, ...(product.images || [])].filter(Boolean);
  const isOutOfStock  = product.stock === 0;
  const isLowStock    = product.stock > 0 && product.stock <= 10;

  // Always load from DB — no fallback to hardcoded/local data
  const reviews        = reviewsEarly;
  const liveRating     = reviewData?.rating ?? 0;
  const liveNumReviews = reviewData?.numReviews ?? 0;
  const userReview     = userReviewEarly;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!token) { navigate('/login', { state: { from: `/products/${slug}` } }); return; }
    if (!selectedSize) { setSizeError(true); toast.warning('Please select a size first.'); return; }
    setSizeError(false);
    addItem(product, selectedSize, product.colors?.[selectedColorIdx]);
    toast.success(`"${product.name}" added to cart! 🛒`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.rating) return setReviewError('Please select a rating.');
    if (!reviewForm.body.trim()) return setReviewError('Please write a review.');
    // Guard: can't post without a real MongoDB _id
    if (!USE_REAL_API || !product._id) return setReviewError('Please configure VITE_API_URL to submit reviews.');
    submitReview.mutate(reviewForm);
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px 48px' }}>

      {/* ── Breadcrumb ── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9e9e9e', marginBottom: 24, flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#9e9e9e', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#1a1a2e'} onMouseLeave={e => e.target.style.color='#9e9e9e'}>Home</Link>
        <span>/</span>
        <Link to="/products" style={{ color: '#9e9e9e', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color='#1a1a2e'} onMouseLeave={e => e.target.style.color='#9e9e9e'}>Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} style={{ color: '#9e9e9e', textDecoration: 'none', textTransform: 'capitalize' }} onMouseEnter={e => e.target.style.color='#1a1a2e'} onMouseLeave={e => e.target.style.color='#9e9e9e'}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* ── Main grid: image + info ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: 40,
        marginBottom: 64,
        alignItems: 'start',
      }}>

        {/* Images column */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 64, flexShrink: 0 }}>
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
                  border: `2px solid ${activeImg === i ? '#1a1a2e' : 'transparent'}`,
                  cursor: 'pointer', padding: 0, background: '#f2f2f2',
                  transition: 'border-color 0.15s',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              onClick={() => setZoomed(true)}
              style={{
                position: 'relative', borderRadius: 20, overflow: 'hidden',
                background: '#f2f2f2', cursor: 'zoom-in',
                aspectRatio: '1/1', maxHeight: 520,
              }}
            >
              <img
                src={allImages[activeImg] || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              {/* Badge */}
              {product.badge && (
                <span style={{
                  position: 'absolute', top: 14, left: 14,
                  background: product.badge === 'Sale' ? '#e63946' : '#1a1a2e',
                  color: '#fff', fontSize: 11, fontWeight: 800,
                  padding: '4px 10px', borderRadius: 999, letterSpacing: '0.05em',
                }}>{product.badge}</span>
              )}
              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#333', color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 20px', borderRadius: 999 }}>Out of Stock</span>
                </div>
              )}
              {/* Low stock */}
              {isLowStock && !isOutOfStock && (
                <span style={{ position: 'absolute', top: 14, right: 14, background: '#ff6b35', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
                  Only {product.stock} left!
                </span>
              )}
              {/* Zoom hint */}
              <div style={{ position: 'absolute', bottom: 12, right: 12, width: 32, height: 32, background: 'rgba(255,255,255,0.92)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                <ZoomIn size={14} color="#1a1a2e" />
              </div>
              {/* Prev/Next */}
              {allImages.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p - 1 + allImages.length) % allImages.length); }}
                    style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(p => (p + 1) % allImages.length); }}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Info panel ── */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 6 }}>{product.sport}</p>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#1a1a2e', lineHeight: 1.2, marginBottom: 4 }}>{product.name}</h1>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 14 }}>{product.subtitle}</p>

          {/* FIX: Display actual live rating, not hardcoded/stale value */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <StarRating rating={liveRating} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e' }}>{Number(liveRating).toFixed(1)}</span>
            <span style={{ fontSize: 13, color: '#9e9e9e' }}>({liveNumReviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 900, color: product.salePrice ? '#e63946' : '#1a1a2e' }}>
              ₱{displayPrice.toLocaleString()}
            </span>
            {product.salePrice && (
              <>
                <span style={{ fontSize: 17, color: '#bbb', textDecoration: 'line-through' }}>₱{product.price.toLocaleString()}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#e63946', background: '#fff0f1', padding: '2px 8px', borderRadius: 999 }}>
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>
                Color: <span style={{ fontWeight: 400, color: '#666' }}>{product.colorNames?.[selectedColorIdx]}</span>
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {product.colors.map((color, idx) => (
                  <button key={idx} onClick={() => setSelectedColorIdx(idx)} style={{
                    width: 32, height: 32, borderRadius: '50%', background: color, cursor: 'pointer',
                    border: ['#FFFFFF','#F5F5F5','#fff','#f5f5f5'].includes(color) ? '1px solid #e0e0e0' : 'none',
                    outline: selectedColorIdx === idx ? `3px solid #1a1a2e` : '3px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline 0.15s, transform 0.15s',
                    transform: selectedColorIdx === idx ? 'scale(1.1)' : 'scale(1)',
                  }} title={product.colorNames?.[idx]} />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: sizeError ? '#e63946' : '#1a1a2e' }}>
                {sizeError ? '⚠ Please select a size' : 'Select Size'}
              </p>
              <button style={{ fontSize: 11, color: '#9e9e9e', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Size Guide</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {product.sizes?.map(size => (
                <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  disabled={isOutOfStock}
                  style={{
                    padding: '10px 4px', fontSize: 13, fontWeight: 600,
                    borderRadius: 10, cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    border: `2px solid ${selectedSize === size ? '#1a1a2e' : sizeError ? '#ffcdd2' : '#e0e0e0'}`,
                    background: selectedSize === size ? '#1a1a2e' : '#fff',
                    color: selectedSize === size ? '#fff' : isOutOfStock ? '#bbb' : '#1a1a2e',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isOutOfStock && selectedSize !== size) e.currentTarget.style.borderColor = '#1a1a2e'; }}
                  onMouseLeave={e => { if (selectedSize !== size) e.currentTarget.style.borderColor = sizeError ? '#ffcdd2' : '#e0e0e0'; }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: 1, padding: '15px 0', borderRadius: 999, fontSize: 14, fontWeight: 800,
                border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                background: isOutOfStock ? '#e0e0e0' : added ? '#2ecc71' : '#1a1a2e',
                color: isOutOfStock ? '#9e9e9e' : '#fff',
                transition: 'background 0.2s, transform 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!isOutOfStock && !added) e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Bag!' : 'Add to Bag'}
            </button>
            <button
              onClick={() => { toggle(product); toast[wishlisted ? 'info' : 'success'](wishlisted ? 'Removed from wishlist.' : `"${product.name}" saved to wishlist! 🤍`); }}
              style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${wishlisted ? '#e63946' : '#e0e0e0'}`,
                background: wishlisted ? '#fff0f1' : '#fff',
                color: wishlisted ? '#e63946' : '#1a1a2e',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Shipping perks */}
          <div style={{ background: '#f8f8f8', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <Truck size={16} color="#2ecc71" style={{ flexShrink: 0 }} />
              <span><strong>Free Delivery</strong> <span style={{ color: '#666' }}>— for JEYP Members</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#666' }}>
              <RotateCcw size={16} style={{ flexShrink: 0, color: '#9e9e9e' }} />
              <span>Free returns within 30 days</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>About this Product</h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{product.description}</p>
          </div>
          {product.materials && (
            <div style={{ marginBottom: 10 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Materials</h3>
              <p style={{ fontSize: 13, color: '#666' }}>{product.materials}</p>
            </div>
          )}
          {product.careInstructions && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Care Instructions</h3>
              <p style={{ fontSize: 13, color: '#666' }}>{product.careInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Zoom modal ── */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <img src={allImages[activeImg]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12 }} />
          <button onClick={() => setZoomed(false)} style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Reviews ── */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 900, color: '#1a1a2e' }}>Customer Reviews</h2>
          {/* FIX: Show live computed rating average in section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRating rating={liveRating} size={16} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>{Number(liveRating).toFixed(1)}</span>
            <span style={{ fontSize: 13, color: '#9e9e9e' }}>({liveNumReviews.toLocaleString()} reviews)</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
          {/* Review list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '32px 20px', textAlign: 'center' }}>
                <p style={{ color: '#9e9e9e', fontSize: 13 }}>No reviews yet. Be the first to review!</p>
              </div>
            ) : reviews.map((r, i) => (
              <div key={r._id || i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', marginBottom: 3 }}>{r.userName}</p>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <span style={{ fontSize: 11, color: '#9e9e9e' }}>{new Date(r.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {r.title && <p style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e', marginTop: 8 }}>{r.title}</p>}
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginTop: 4 }}>{r.body}</p>
              </div>
            ))}
          </div>

          {/* Write a review */}
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 16, fontSize: 15 }}>{userReview ? 'Edit Your Review' : 'Write a Review'}</h3>
            {!token ? (
              <p style={{ fontSize: 13, color: '#666' }}>Please <Link to="/login" style={{ fontWeight: 700, color: '#1a1a2e' }}>sign in</Link> to leave a review.</p>
            ) : !USE_REAL_API ? (
              /* No VITE_API_URL configured — running in local mock mode */
              <div style={{ padding: '8px 0' }}>
                <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 6 }}>Reviews require a live backend.</p>
                <p style={{ fontSize: 12, color: '#bbb' }}>Add <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace' }}>VITE_API_URL</code> to your <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace' }}>.env.local</code> to enable.</p>
              </div>
            ) : reviewSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: '#2ecc71', fontWeight: 700, fontSize: 14 }}>✓ {userReview ? 'Review updated!' : 'Review submitted!'}</p>
                <button onClick={() => setReviewSuccess(false)} style={{ marginTop: 8, fontSize: 12, color: '#9e9e9e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit again</button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviewError && <p style={{ fontSize: 12, color: '#e63946', fontWeight: 600 }}>{reviewError}</p>}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 }}>Your Rating</label>
                  <StarRating rating={reviewForm.rating} size={22} interactive value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 }}>Title (optional)</label>
                  <input className="input-base" style={{ fontSize: 13 }} value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Summary of your review" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 }}>Review</label>
                  <textarea className="input-base" style={{ fontSize: 13, height: 96, resize: 'none' }} value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} placeholder="What did you think?" required />
                </div>
                <button type="submit" disabled={submitReview.isPending} className="btn-gold" style={{ padding: '12px 0', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Send size={14} /> {submitReview.isPending ? (userReview ? 'Updating…' : 'Submitting…') : (userReview ? 'Update Review' : 'Submit Review')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900, color: '#1a1a2e' }}>You Might Also Like</h2>
            <Link to={`/products?sport=${product.sport}`} style={{ fontSize: 12, color: '#9e9e9e', textDecoration: 'underline' }}>View All</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
            {related.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}