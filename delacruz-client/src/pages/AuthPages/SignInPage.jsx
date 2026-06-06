import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { loginUser } from '../../services/UserService';

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-[#3d4a2e]/25 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#3d4a2e] focus:bg-white focus:ring-2 focus:ring-[#9AB17A]/30';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('type', data.type);
      localStorage.setItem('firstName', data.firstName ?? '');
      localStorage.setItem('lastName', data.lastName ?? '');
      localStorage.setItem('email', data.email ?? email);

      // Viewers go to the public site; admin/editor go to dashboard
      const destination =
        data.type === 'admin' || data.type === 'editor' ? '/dashboard' : '/home';
      navigate(destination, { state: { firstName: data.firstName, type: data.type } });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <span className="inline-block rounded-full bg-[#C3CC9B]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3d4a2e] mb-4">
          Welcome back
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Log In</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Access your account and continue your adoption journey.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signin-email" className="text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className={actionButtonClassName}
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Log In'}
        </Button>
      </form>

      <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        No account yet?{' '}
        <Link to="/auth/signup" className="font-semibold text-[#3d4a2e] transition hover:text-[#5a6e44] hover:underline">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;
