import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';

export function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast('Passwords do not match', 'error');
      return;
    }
    if (form.password.length < 8) {
      toast('Password must be at least 8 characters', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.register(form);
      login(response);
      toast('Account created! Welcome 🎉', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail[0]?.msg || 'Registration failed'
        : detail || 'Registration failed';
      toast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      key: 'name',
      label: 'Full name',
      type: 'text',
      Icon: User,
      placeholder: 'Your name',
    },
    {
      key: 'email',
      label: 'Email address',
      type: 'email',
      Icon: Mail,
      placeholder: 'you@example.com',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">
          Create account
        </h1>
        <p className="text-text-secondary text-sm">
          Predict every match of the 2026 World Cup
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, type, Icon, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {label}
            </label>
            <div className="relative">
              <Icon
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type={type}
                value={(form as any)[key]}
                onChange={set(key)}
                required
                placeholder={placeholder}
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-fifa-blue focus:border-transparent transition"
              />
            </div>
          </div>
        ))}

        {/* Password fields */}
        {(['password', 'confirm_password'] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {field === 'password' ? 'Password' : 'Confirm password'}
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form[field]}
                onChange={set(field)}
                required
                minLength={field === 'password' ? 8 : undefined}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-fifa-blue focus:border-transparent transition"
              />
              {field === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-fifa-blue hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}