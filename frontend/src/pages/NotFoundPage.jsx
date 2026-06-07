import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p
        className="text-[10rem] font-black text-[#F5F5F5] leading-none select-none"
        style={{ fontFamily: 'Futura, "Trebuchet MS", Arial Narrow, Arial, sans-serif' }}
      >
        404
      </p>
      <h1
        className="text-3xl md:text-4xl font-black tracking-tight -mt-4 mb-4"
        style={{ fontFamily: 'Futura, "Trebuchet MS", Arial Narrow, Arial, sans-serif' }}
      >
        Page Not Found
      </h1>
      <p className="text-[#757575] mb-8 max-w-sm">
        Looks like this page ran away. Let's get you back to the good stuff.
      </p>
      <Link
        to="/"
        className="px-10 py-4 bg-[#111] text-white text-sm font-bold rounded-full hover:bg-[#333] transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
