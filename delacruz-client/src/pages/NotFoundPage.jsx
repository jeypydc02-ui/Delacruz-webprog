import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center px-4"
      style={{ background: '#FBE8CE' }}
    >
      {/* Card */}
      <div className="w-full max-w-md rounded-3xl border-2 border-[#3d4a2e] bg-[#E4DFB5] p-10 text-center shadow-lg">
        {/* Paw icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#3d4a2e] bg-[#C3CC9B]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Paw pad */}
            <ellipse cx="32" cy="42" rx="14" ry="12" fill="#3d4a2e" />
            {/* Toe beans */}
            <ellipse cx="14" cy="30" rx="6" ry="7" fill="#3d4a2e" />
            <ellipse cx="26" cy="23" rx="6" ry="7" fill="#3d4a2e" />
            <ellipse cx="38" cy="23" rx="6" ry="7" fill="#3d4a2e" />
            <ellipse cx="50" cy="30" rx="6" ry="7" fill="#3d4a2e" />
          </svg>
        </div>

        {/* 404 */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5a6e44]">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#3d4a2e]">Page Not Found</h1>
        <p className="mt-4 text-sm leading-7 text-[#5a6e44]">
          Looks like this page ran off the leash. The link you followed may be broken, or the page
          may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-full bg-[#3d4a2e] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FBE8CE] transition hover:bg-[#2a3520]"
          >
            Back Home
          </Link>
          <Link
            to="/articles"
            className="rounded-full border-2 border-[#3d4a2e] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3d4a2e] transition hover:bg-[#C3CC9B]"
          >
            Browse Articles
          </Link>
        </div>
      </div>

      {/* Subtle footer note */}
      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5a6e44]">
        HomeFound · Pet Adoptions
      </p>
    </div>
  );
};

export default NotFoundPage;