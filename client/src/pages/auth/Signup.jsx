import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, CheckSquare, Shield } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

/**
 * Signup Page
 */
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background Decoration */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <CheckSquare size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Join TaskFlow and manage your team efficiently
          </p>
        </div>

        {/* Signup Form */}
        <div
          className="rounded-2xl p-8 animate-fade-in"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            animationDelay: '100ms',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={User}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={Mail}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={Lock}
              required
            />

            {/* Role Selector */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="flex items-center gap-1.5">
                  <Shield size={14} />
                  Select your role
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className="p-3 rounded-lg text-center transition-all duration-200"
                  style={{
                    background: formData.role === 'admin'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'var(--bg-tertiary)',
                    border: formData.role === 'admin'
                      ? '2px solid var(--color-secondary)'
                      : '2px solid var(--border-color)',
                    color: formData.role === 'admin'
                      ? '#a78bfa'
                      : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-lg block mb-1">👑</span>
                  <span className="text-sm font-semibold block">Admin</span>
                  <span className="text-xs block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Manage teams
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'member' })}
                  className="p-3 rounded-lg text-center transition-all duration-200"
                  style={{
                    background: formData.role === 'member'
                      ? 'rgba(6, 182, 212, 0.15)'
                      : 'var(--bg-tertiary)',
                    border: formData.role === 'member'
                      ? '2px solid var(--color-accent)'
                      : '2px solid var(--border-color)',
                    color: formData.role === 'member'
                      ? '#22d3ee'
                      : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-lg block mb-1">👤</span>
                  <span className="text-sm font-semibold block">Member</span>
                  <span className="text-xs block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Work on tasks
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg p-3 mb-4 text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              <UserPlus size={18} />
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold no-underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
