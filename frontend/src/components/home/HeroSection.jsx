import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../data/products';

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const go = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((idx + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, go]);

  const slide = heroSlides[current];

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        maxHeight: '85vh',
        minHeight: '420px',
        overflow: 'hidden',
        background: '#111',
      }}
    >
      {/* Slides */}
      {heroSlides.map((s, idx) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 0.7s ease',
            opacity: idx === current ? 1 : 0,
          }}
        >
          <img
            src={s.image}
            alt={s.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: s.theme === 'dark'
                ? 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)'
                : 'linear-gradient(to right, rgba(255,255,255,0.85), rgba(255,255,255,0.4), transparent)',
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 1440, width: '100%', margin: '0 auto', padding: '0 2rem' }}>
          <div
            key={current}
            style={{
              maxWidth: 520,
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(16px)' : 'translateY(0)',
            }}
          >
            <p
              className="text-xs font-bold uppercase mb-2"
              style={{
                letterSpacing: '0.3em',
                color: slide.theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,17,0.6)',
              }}
            >
              {slide.subtitle}
            </p>
            <h1
              className="font-black leading-none tracking-tighter mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: slide.theme === 'dark' ? '#fff' : '#111',
              }}
            >
              {slide.title}
            </h1>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{
                maxWidth: 380,
                color: slide.theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#424242',
              }}
            >
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={slide.ctaLink}
                className="text-sm font-bold transition-all hover:scale-105"
                style={{
                  padding: '14px 32px',
                  borderRadius: 999,
                  background: slide.theme === 'dark' ? '#fff' : '#111',
                  color: slide.theme === 'dark' ? '#111' : '#fff',
                }}
              >
                {slide.cta}
              </Link>
              <Link
                to="/products"
                className="text-sm font-bold border-2 transition-all hover:scale-105"
                style={{
                  padding: '14px 32px',
                  borderRadius: 999,
                  borderColor: slide.theme === 'dark' ? '#fff' : '#111',
                  color: slide.theme === 'dark' ? '#fff' : '#111',
                  background: 'transparent',
                }}
              >
                Shop All
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(current - 1)}
        style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(current + 1)}
        style={{
          position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div
        style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, alignItems: 'center',
        }}
      >
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            style={{
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: idx === current ? 24 : 8,
              height: 8,
              background: idx === current ? '#fff' : 'rgba(255,255,255,0.5)',
              padding: 0,
            }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
