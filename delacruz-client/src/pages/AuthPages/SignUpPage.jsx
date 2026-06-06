import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { createUser } from '../../services/UserService';

const inputClasses =
  'mt-1.5 w-full rounded-xl border border-[#3d4a2e]/25 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#3d4a2e] focus:bg-white focus:ring-2 focus:ring-[#9AB17A]/30';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

// Enhancement 3: SignUp fully wired to backend
const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState({
    firstName: '', lastName: '', age: '', gender: '',
    contactNumber: '', email: '', username: '', password: '', address: '',
    type: 'viewer', // default role for self-registered users
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await createUser(form);
      navigate('/auth/signin', { state: { registered: true } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <span className="inline-block rounded-full bg-[#C3CC9B]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3d4a2e] mb-4">
          Get started
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Sign Up</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Create your account and start your pet adoption journey today.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {/* Name row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">First Name</label>
            <input name="firstName" type="text" placeholder="Juan" required className={inputClasses} value={form.firstName} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Last Name</label>
            <input name="lastName" type="text" placeholder="Dela Cruz" required className={inputClasses} value={form.lastName} onChange={handleChange} />
          </div>
        </div>

        {/* Age + Gender */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">Age</label>
            <input name="age" type="number" placeholder="25" required className={inputClasses} value={form.age} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Gender</label>
            <select name="gender" required className={inputClasses} value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Contact + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">Contact Number</label>
            <input name="contactNumber" type="tel" placeholder="09171234567" required className={inputClasses} value={form.contactNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <input name="email" type="email" placeholder="you@example.com" required className={inputClasses} value={form.email} onChange={handleChange} />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-zinc-700">Username</label>
          <input name="username" type="text" placeholder="juandelacruz" required className={inputClasses} value={form.username} onChange={handleChange} />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-zinc-700">Address</label>
          <input name="address" type="text" placeholder="Quezon City, Metro Manila" required className={inputClasses} value={form.address} onChange={handleChange} />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-zinc-700">Password</label>
          <input name="password" type="password" placeholder="••••••••" autoComplete="new-password" required className={inputClasses} value={form.password} onChange={handleChange} />
          <p className="mt-1.5 text-xs leading-5 text-zinc-400">Use at least 8 characters with letters, numbers, and symbols.</p>
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-semibold text-[#3d4a2e] transition hover:text-[#5a6e44] hover:underline">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
