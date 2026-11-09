import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Loader';
import AuthShell, { PasswordInput } from '../components/layout/AuthShell';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not reach the server. Is the API running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Enter your details to continue."
      footer={<>No account yet? <Link to="/register" className="link">Create one</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email" type="email" name="email" value={form.email} onChange={onChange}
            placeholder="you@company.com" required autoComplete="email" autoFocus className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput
            id="password" name="password" value={form.password} onChange={onChange}
            required autoComplete="current-password"
          />
        </div>

        {error && <p className="text-[13px] text-danger" role="alert">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Spinner size="sm" className="!text-primary-fg" /> : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
