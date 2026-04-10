import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Articles', to: '/articles' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-[#3d4a2e] bg-[#C3CC9B] text-[#3d4a2e]'
      : 'border-transparent text-[#3d4a2e] hover:border-[#3d4a2e] hover:bg-[#E4DFB5] hover:text-[#3d4a2e]',
  ].join(' ');

const Logo = () => (
  <svg width="44" height="44" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="HomeFound logo">
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

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#3d4a2e] bg-[#9AB17A]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        <NavLink to="/" className="flex items-center gap-3 group">
          <Logo />
          <div>
            <p className="font-serif text-xl font-bold leading-none text-[#3d4a2e] tracking-tight group-hover:text-[#2a3520] transition">
              HomeFound
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44] mt-0.5">
              Pet Adoptions
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
          <a
            href="#adopt"
            className="ml-3 rounded-full bg-[#3d4a2e] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FBE8CE] transition hover:bg-[#2a3520]"
          >
            Adopt Now
          </a>
        </nav>

        <button className="flex flex-col gap-1.5 md:hidden p-2" aria-label="Open menu">
          <span className="block h-0.5 w-5 bg-[#3d4a2e] rounded" />
          <span className="block h-0.5 w-5 bg-[#3d4a2e] rounded" />
          <span className="block h-0.5 w-3 bg-[#3d4a2e] rounded" />
        </button>
      </div>
    </header>
  );
};

export default NavBar;