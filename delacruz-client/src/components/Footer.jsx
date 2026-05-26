const Footer = ({ title, description, buttonText = 'Browse Pets', buttonHref = '#adopt' }) => {
  return (
    <footer className="border-t-2 border-[#3d4a2e] bg-[#3d4a2e]">
      {/* CTA Strip */}
      <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-[#FBE8CE]">
          {title ?? 'Ready to find your match?'}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#C3CC9B] max-w-md mx-auto">
          {description ??
            'Hundreds of dogs and cats are waiting. Start your adoption journey today — it takes less than five minutes to apply.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href={buttonHref}
            className="rounded-full bg-[#9AB17A] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3d4a2e] transition hover:bg-[#C3CC9B]"
          >
            {buttonText}
          </a>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-[#5a6e44] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="8" y="28" width="44" height="28" rx="4" fill="#9AB17A" />
              <polygon points="4,30 30,6 56,30" fill="#9AB17A" />
              <rect x="19" y="40" width="10" height="16" rx="5" fill="#3d4a2e" />
              <ellipse cx="38" cy="44" rx="4" ry="3" fill="#3d4a2e" />
              <ellipse cx="31" cy="39" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="36" cy="37" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="41" cy="37" rx="2" ry="2" fill="#3d4a2e" />
              <ellipse cx="45" cy="40" rx="2" ry="2" fill="#3d4a2e" />
            </svg>
            <span className="font-serif text-base font-bold text-[#FBE8CE] tracking-tight">
              HomeFound
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-5">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Articles', href: '/articles' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C3CC9B] transition hover:text-[#FBE8CE]"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-[#5a6e44]">
            © {new Date().getFullYear()} HomeFound. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;