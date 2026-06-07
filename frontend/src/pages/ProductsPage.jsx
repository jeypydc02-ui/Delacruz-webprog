import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal, X, Search,
  ChevronDown, ChevronUp, Tag, Sparkles,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import { categories, sports, products as localProducts } from '../data/products';

const sortOptions = [
  { value: 'featured',   label: 'Featured'          },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated'          },
  { value: 'newest',     label: 'Newest'             },
];

const priceRanges = [
  { label: 'Under ₱3,000',    min: 0,     max: 3000   },
  { label: '₱3,000 – ₱6,000', min: 3000,  max: 6000   },
  { label: '₱6,000 – ₱10,000',min: 6000,  max: 10000  },
  { label: 'Over ₱10,000',    min: 10000, max: 999999 },
];

const allSizes = [5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,12,13,14];

/* category accent colours */
const categoryAccents = {
  men:   { from: '#1a1a2e', to: '#0f3460', label: "Men's"    },
  women: { from: '#4a1a4a', to: '#7b2d8b', label: "Women's"  },
  kids:  { from: '#0f4a2e', to: '#16803c', label: "Kids'"    },
  sale:  { from: '#7f1d1d', to: '#b91c1c', label: 'Sale'     },
  all:   { from: '#1a1a2e', to: '#0f3460', label: 'All Products' },
};

/* ── Collapsible filter section ── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 10px',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa' }}>
          {title}
        </span>
        {open
          ? <ChevronUp size={13} color="#ccc" />
          : <ChevronDown size={13} color="#ccc" />}
      </button>
      {open && children}
    </div>
  );
}

/* ── Skeleton card matching new ProductCard shape ── */
function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 14px rgba(26,26,46,0.06)' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%' }} />
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 11, borderRadius: 6, width: '45%' }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '82%' }} />
        <div className="skeleton" style={{ height: 11, borderRadius: 6, width: '55%' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters]   = useState(false);
  const [searchInput, setSearchInput]   = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions]   = useState([]);
  const [showSugg, setShowSugg]         = useState(false);
  const [priceRange, setPriceRange]     = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const searchRef = useRef(null);

  const activeCategory = searchParams.get('category') || 'all';
  const activeSport    = searchParams.get('sport')    || '';
  const activeSort     = searchParams.get('sort')     || 'featured';
  const searchQuery    = searchParams.get('search')   || '';
  const minRating      = searchParams.get('minRating')|| '';

  const { data: allProducts, isLoading } = useProducts({
    category: activeCategory, sport: activeSport, sort: activeSort, search: searchQuery,
  });

  const products = allProducts?.filter(p => {
    const price = p.salePrice || p.price;
    if (priceRange && (price < priceRange.min || price > priceRange.max)) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(s => p.sizes?.map(String).includes(String(s)))) return false;
    if (minRating && p.rating < Number(minRating)) return false;
    return true;
  });

  const handleSearchInput = useCallback((val) => {
    setSearchInput(val);
    if (val.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    const q = val.toLowerCase();
    const matches = localProducts
      .filter(p => p.name.toLowerCase().includes(q) || p.sport?.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q))
      .slice(0, 6)
      .map(p => ({ name: p.name, sport: p.sport, slug: p.slug }));
    setSuggestions(matches);
    setShowSugg(true);
  }, []);

  const applySearch = (val) => {
    setSearchInput(val); setSuggestions([]); setShowSugg(false);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val); else params.delete('search');
    setSearchParams(params);
  };

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({}); setSearchInput(''); setPriceRange(null); setSelectedSizes([]);
  };

  const toggleSize = (s) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const hasActiveFilters = activeCategory !== 'all' || activeSport || searchQuery ||
    activeSort !== 'featured' || priceRange || selectedSizes.length > 0 || minRating;

  const accent  = categoryAccents[activeCategory] || categoryAccents.all;
  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : activeSport
      ? activeSport
      : accent.label;

  useEffect(() => {
    const fn = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div style={{ background: 'linear-gradient(160deg,#f8f8f8,#eef0f5)', minHeight: '80vh' }}>
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 1.25rem 4rem' }}>

        {/* ── Category hero banner ── */}
        <div
          style={{
            borderRadius: '0 0 28px 28px',
            background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
            padding: '36px 32px 32px',
            marginBottom: 28,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative circles */}
          <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-30, right:80, width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:20, right:200, width:60, height:60, borderRadius:'50%', background:'rgba(232,197,71,0.08)', pointerEvents:'none' }} />

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12, position:'relative', zIndex:1 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <Sparkles size={14} color="rgba(232,197,71,0.8)" />
                <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>
                  JEYP Store
                </span>
              </div>
              <h1 style={{ fontSize:38, fontWeight:900, color:'#fff', letterSpacing:'-0.04em', lineHeight:1, fontFamily:'var(--font-display)' }}>
                {pageTitle}
              </h1>
              {products && (
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:6, fontWeight:500 }}>
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>

            {/* Sort + Filter buttons */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ position:'relative' }}>
                <select
                  value={activeSort}
                  onChange={(e) => setFilter('sort', e.target.value)}
                  style={{
                    appearance:'none',
                    background:'rgba(255,255,255,0.12)',
                    backdropFilter:'blur(8px)',
                    border:'1px solid rgba(255,255,255,0.18)',
                    borderRadius:999,
                    padding:'9px 36px 9px 14px',
                    fontSize:13,
                    fontWeight:600,
                    color:'#fff',
                    cursor:'pointer',
                    outline:'none',
                    minWidth:160,
                  }}
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value} style={{ color:'#1a1a2e' }}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} color="rgba(255,255,255,0.6)" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display:'flex', alignItems:'center', gap:7,
                  background: showFilters ? '#e8c547' : 'rgba(255,255,255,0.12)',
                  backdropFilter:'blur(8px)',
                  border:'1px solid rgba(255,255,255,0.18)',
                  borderRadius:999,
                  padding:'9px 16px',
                  fontSize:13,
                  fontWeight:700,
                  color: showFilters ? '#1a1a2e' : '#fff',
                  cursor:'pointer',
                  transition:'all 0.18s',
                }}
              >
                <SlidersHorizontal size={14} />
                Filters
                {hasActiveFilters && (
                  <span style={{ width:7, height:7, borderRadius:'50%', background: showFilters ? '#1a1a2e' : '#e8c547', display:'inline-block' }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {hasActiveFilters && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20, alignItems:'center' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#bbb', textTransform:'uppercase', letterSpacing:'0.1em' }}>Active:</span>
            {activeCategory !== 'all' && (
              <Chip label={`Category: ${accent.label}`} onRemove={() => setFilter('category','')} />
            )}
            {activeSport && (
              <Chip label={`Sport: ${activeSport}`} onRemove={() => setFilter('sport','')} />
            )}
            {searchQuery && (
              <Chip label={`"${searchQuery}"`} onRemove={() => applySearch('')} />
            )}
            {priceRange && (
              <Chip label={priceRange.label} onRemove={() => setPriceRange(null)} />
            )}
            {selectedSizes.map(s => (
              <Chip key={s} label={`Size ${s}`} onRemove={() => toggleSize(s)} />
            ))}
            {minRating && (
              <Chip label={`${minRating}★ & up`} onRemove={() => setFilter('minRating','')} />
            )}
            <button
              onClick={clearFilters}
              style={{ fontSize:12, fontWeight:700, color:'#C8102E', background:'none', border:'none', cursor:'pointer', padding:'4px 6px' }}
            >
              Clear all
            </button>
          </div>
        )}

        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

          {/* ── Filter sidebar ── */}
          <aside
            style={{
              width: 224,
              flexShrink: 0,
              display: showFilters ? 'block' : 'none',
            }}
            className="lg:block"
          >
            <div
              style={{
                position:'sticky', top:88,
                background:'#fff',
                borderRadius:18,
                padding:'20px 18px',
                boxShadow:'0 2px 16px rgba(26,26,46,0.08)',
                border:'1px solid rgba(26,26,46,0.05)',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <span style={{ fontSize:13, fontWeight:800, color:'#1a1a2e' }}>Filters</span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{ fontSize:11, fontWeight:700, color:'#C8102E', background:'none', border:'none', cursor:'pointer' }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search */}
              <FilterSection title="Search">
                <div ref={searchRef} style={{ position:'relative' }}>
                  <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#ccc', pointerEvents:'none' }} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => handleSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applySearch(searchInput)}
                    placeholder="Search products…"
                    className="input-base"
                    style={{ paddingLeft:32, fontSize:13, borderRadius:10, padding:'9px 12px 9px 32px' }}
                  />
                  {showSugg && suggestions.length > 0 && (
                    <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'#fff', border:'1px solid #eee', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', zIndex:40, overflow:'hidden' }}>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onMouseDown={() => applySearch(s.name)}
                          style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 12px', background:'none', border:'none', borderBottom:'1px solid #f5f5f5', cursor:'pointer', textAlign:'left' }}
                        >
                          <Search size={11} color="#ddd" />
                          <span style={{ fontSize:12, fontWeight:600, color:'#1a1a2e', flex:1 }}>{s.name}</span>
                          <span style={{ fontSize:11, color:'#bbb' }}>{s.sport}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Category */}
              <FilterSection title="Category">
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {categories.map(cat => {
                    const active = (cat.id === 'all' && activeCategory === 'all') || activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilter('category', cat.id === 'all' ? '' : cat.id)}
                        style={{
                          textAlign:'left', fontSize:13, padding:'7px 10px', borderRadius:8, border:'none', cursor:'pointer',
                          background: active ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'transparent',
                          color: active ? '#1a1a2e' : '#777',
                          fontWeight: active ? 700 : 500,
                          borderLeft: active ? '2px solid #e8c547' : '2px solid transparent',
                          transition:'all 0.15s',
                        }}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Sport */}
              <FilterSection title="Sport" defaultOpen={false}>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {['All Sports', ...sports].map((s, i) => {
                    const val    = i === 0 ? '' : s;
                    const active = activeSport === val;
                    return (
                      <button
                        key={s}
                        onClick={() => setFilter('sport', val)}
                        style={{
                          textAlign:'left', fontSize:13, padding:'7px 10px', borderRadius:8, border:'none', cursor:'pointer',
                          background: active ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'transparent',
                          color: active ? '#1a1a2e' : '#777',
                          fontWeight: active ? 700 : 500,
                          borderLeft: active ? '2px solid #e8c547' : '2px solid transparent',
                          transition:'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Price */}
              <FilterSection title="Price Range" defaultOpen={false}>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {[{ label:'Any Price', min:null }, ...priceRanges].map(r => {
                    const active = r.min === null ? !priceRange : priceRange?.label === r.label;
                    return (
                      <button
                        key={r.label}
                        onClick={() => setPriceRange(r.min === null ? null : r)}
                        style={{
                          textAlign:'left', fontSize:13, padding:'7px 10px', borderRadius:8, border:'none', cursor:'pointer',
                          background: active ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'transparent',
                          color: active ? '#1a1a2e' : '#777',
                          fontWeight: active ? 700 : 500,
                          borderLeft: active ? '2px solid #e8c547' : '2px solid transparent',
                          transition:'all 0.15s',
                        }}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Sizes */}
              <FilterSection title="Size" defaultOpen={false}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {allSizes.map(s => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        style={{
                          padding:'5px 9px', fontSize:11, fontWeight:700, borderRadius:7, cursor:'pointer',
                          border: active ? '1.5px solid #1a1a2e' : '1.5px solid #e5e5e5',
                          background: active ? '#1a1a2e' : '#fff',
                          color: active ? '#fff' : '#777',
                          transition:'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection title="Min Rating" defaultOpen={false}>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {[4,3,2].map(r => {
                    const active = minRating === String(r);
                    return (
                      <button
                        key={r}
                        onClick={() => setFilter('minRating', active ? '' : String(r))}
                        style={{
                          display:'flex', alignItems:'center', gap:6, textAlign:'left', fontSize:13, padding:'7px 10px', borderRadius:8, border:'none', cursor:'pointer',
                          background: active ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' : 'transparent',
                          color: active ? '#1a1a2e' : '#777',
                          fontWeight: active ? 700 : 500,
                          borderLeft: active ? '2px solid #e8c547' : '2px solid transparent',
                          transition:'all 0.15s',
                        }}
                      >
                        <span style={{ color:'#e8c547', letterSpacing:1 }}>{'★'.repeat(r)}<span style={{ color:'#ddd' }}>{'★'.repeat(5-r)}</span></span>
                        <span style={{ fontSize:11, color:'#bbb' }}>& up</span>
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div style={{ flex:1, minWidth:0 }}>
            {isLoading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }} className="md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products?.length === 0 ? (
              <div
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  padding:'5rem 1rem', textAlign:'center',
                  background:'#fff', borderRadius:20,
                  boxShadow:'0 2px 16px rgba(26,26,46,0.06)',
                  gap:12,
                }}
              >
                <div style={{ fontSize:52, lineHeight:1, marginBottom:4 }}>🔍</div>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1a2e' }}>No products found</h2>
                <p style={{ fontSize:14, color:'#bbb', maxWidth:280 }}>
                  Try adjusting your filters or searching with a different term.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-gold"
                  style={{ padding:'11px 28px', fontSize:13, marginTop:8 }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}
                className="md:grid-cols-3 xl:grid-cols-4"
              >
                {products.map(product => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Chip component ── */
function Chip({ label, onRemove }) {
  return (
    <span
      style={{
        display:'inline-flex', alignItems:'center', gap:5,
        background:'#fff',
        border:'1.5px solid #e5e5e5',
        borderRadius:999,
        padding:'4px 10px 4px 12px',
        fontSize:12,
        fontWeight:600,
        color:'#1a1a2e',
        boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#bbb' }}
      >
        <X size={11} />
      </button>
    </span>
  );
}