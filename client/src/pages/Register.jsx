import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Loader';
import AuthShell, { PasswordInput } from '../components/layout/AuthShell';

const RULES = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',    test: (p) => /[0-9]/.test(p) },
];

const Register = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const failing = RULES.filter((r) => !r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (failing.length) {
      setError(`Password needs: ${failing.map((r) => r.label.toLowerCase()).join(', ')}.`);
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      const res = err.response?.data;
      const msg = res?.errors?.[0]?.message || res?.message || 'Could not reach the server. Is the API running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start shortening and tracking links."
      footer={<>Already have an account? <Link to="/login" className="link">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input
            id="name" type="text" name="name" value={form.name} onChange={onChange}
            placeholder="Ada Lovelace" required autoComplete="name" autoFocus className="input"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email" type="email" name="email" value={form.email} onChange={onChange}
            placeholder="you@company.com" required autoComplete="email" className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput
            id="password" name="password" value={form.password} onChange={onChange}
            required autoComplete="new-password"
          />
          <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.label} className={`inline-flex items-center gap-1 text-2xs ${ok ? 'text-success' : 'text-faint'}`}>
                  <Check className={`w-3 h-3 ${ok ? '' : 'opacity-40'}`} strokeWidth={2.5} />
                  {r.label}
                </li>
              );
            })}
          </ul>
        </div>

        {error && <p className="text-[13px] text-danger" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner size="sm" className="!text-primary-fg" /> : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
};

export default Register;
