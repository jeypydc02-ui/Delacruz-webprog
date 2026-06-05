import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-[#3d4a2e]/25 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#3d4a2e] focus:bg-white focus:ring-2 focus:ring-[#9AB17A]/30';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignUpPage = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block rounded-full bg-[#C3CC9B]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3d4a2e] mb-4">
          Get started
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Sign Up</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Create your account and start your pet adoption journey today.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        {/* Name row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="text-sm font-medium text-zinc-700">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="Juan"
              autoComplete="given-name"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-sm font-medium text-zinc-700">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Dela Cruz"
              autoComplete="family-name"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClasses}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputClasses}
          />
          <p className="mt-1.5 text-xs leading-5 text-zinc-400">
            Use a secure password with letters, numbers, and symbols.
          </p>
        </div>

        {/* Terms note */}
        <p className="text-xs leading-5 text-zinc-400">
          By creating an account you agree to our{' '}
          <span className="font-medium text-[#3d4a2e] cursor-pointer hover:underline">Terms of Service</span>
          {' '}and{' '}
          <span className="font-medium text-[#3d4a2e] cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

        {/* Submit */}
        <Button type="submit" variant="primary" className={actionButtonClassName}>
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#faf7f2] px-3 text-xs text-zinc-400">or sign up with</span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple
          </Button>
        </div>
      </form>

      {/* Footer link */}
      <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link
          to="/auth/signin"
          className="font-semibold text-[#3d4a2e] transition hover:text-[#5a6e44] hover:underline"
        >
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
