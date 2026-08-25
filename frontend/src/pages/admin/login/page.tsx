import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../admin/contexts/AdminAuthContext';
import { Button, Field, Notice } from '../../../components/admin/ui';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Portfolio CMS</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Sign in<span className="text-signal">.</span>
          </h1>
          <p className="mt-1.5 text-[13px] text-gray-500">Manage site content and the inbox.</p>
        </div>

        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              icon="ri-mail-line"
              required
            />

            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon="ri-lock-password-line"
              required
            />

            {error && <Notice tone="error">{error}</Notice>}

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              icon="ri-login-box-line"
              fullWidth
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <a
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-signal transition-colors"
        >
          <i className="ri-arrow-left-line" aria-hidden="true" />
          Back to portfolio
        </a>
      </div>
    </div>
  );
}
