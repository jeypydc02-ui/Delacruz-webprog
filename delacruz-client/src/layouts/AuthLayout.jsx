import { Link, Outlet } from 'react-router-dom';

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="HomeFound logo">
    <rect x="8" y="28" width="44" height="28" rx="4" fill="#3d4a2e" />
    <polygon points="4,30 30,6 56,30" fill="#3d4a2e" />
    <rect x="19" y="40" width="10" height="16" rx="5" fill="#FBE8CE" />
    <ellipse cx="38" cy="44" rx="4" ry="3" fill="#FBE8CE" />
    <ellipse cx="31" cy="39" rx="2" ry="2" fill="#FBE8CE" />
    <ellipse cx="36" cy="37" rx="2" ry="2" fill="#FBE8CE" />
    <ellipse cx="41" cy="37" rx="2" ry="2" fill="#FBE8CE" />
    <ellipse cx="45" cy="40" rx="2" ry="2" fill="#FBE8CE" />
  </svg>
);

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-[#f5f0e8] text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">

        {/* Left decorative panel */}
        <div className="hidden lg:flex flex-col items-center justify-between border-r-2 border-[#3d4a2e]/20 bg-[#3d4a2e] p-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 self-start group">
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="28" width="44" height="28" rx="4" fill="#9AB17A" />
              <polygon points="4,30 30,6 56,30" fill="#9AB17A" />
              <rect x="19" y="40" width="10" height="16" rx="5" fill="#3d4a2e" />
              <ellipse cx="38" cy="44" rx="4" ry="3" fill="#3d4a2e" />
              <ellipse cx="31" cy="39" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="36" cy="37" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="41" cy="37" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="45" cy="40" rx="2" ry="2" fill="#3d4a2e" />
            </svg>
            <div>
              <p className="font-serif text-xl font-bold leading-none text-[#FBE8CE] tracking-tight">HomeFound</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9AB17A] mt-0.5">Pet Adoptions</p>
            </div>
          </Link>

          {/* Center illustration */}
          <div className="flex w-full max-w-sm items-center justify-center rounded-[2rem] border-2 border-dashed border-[#9AB17A]/40 bg-[#2a3520] p-10">
            <div className="relative aspect-square w-full max-w-[16rem] flex items-center justify-center">
              {/* Decorative paw pattern */}
              <div className="relative">
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <ellipse cx="90" cy="105" rx="42" ry="35" fill="#9AB17A" opacity="0.25" />
                  <ellipse cx="90" cy="100" rx="30" ry="25" fill="#9AB17A" opacity="0.4" />
                  <ellipse cx="55" cy="65" rx="16" ry="12" fill="#9AB17A" opacity="0.5" />
                  <ellipse cx="80" cy="52" rx="16" ry="12" fill="#9AB17A" opacity="0.5" />
                  <ellipse cx="107" cy="52" rx="16" ry="12" fill="#9AB17A" opacity="0.5" />
                  <ellipse cx="130" cy="65" rx="16" ry="12" fill="#9AB17A" opacity="0.5" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">🐾</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="self-start">
            <p className="text-lg font-serif font-bold text-[#FBE8CE] leading-snug max-w-xs">
              Every pet deserves a loving home.
            </p>
            <p className="mt-2 text-sm text-[#9AB17A]">
              Join thousands of families who found their perfect match.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <main className="flex items-center bg-[#faf7f2] px-6 py-12 sm:px-10 lg:px-16">
          {/* Mobile brand header */}
          <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-serif text-base font-bold text-[#3d4a2e]">HomeFound</span>
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md pt-12 lg:pt-0">
            <Outlet />
          </div>
        </main>

      </div>
    </section>
  );
};

export default AuthLayout;
