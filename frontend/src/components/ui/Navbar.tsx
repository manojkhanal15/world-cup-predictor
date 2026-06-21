import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/predictor', label: 'Predictor' },
    { to: '/blog', label: 'History' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fifa-blue to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform">
              <Trophy size={16} className="text-gold" />
            </div>
            <span className="font-extrabold text-text-primary tracking-tight">
              WC <span className="text-gold">2026</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-fifa-blue/20 text-fifa-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* User badge — desktop */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                  <User size={14} className="text-text-secondary" />
                  <span className="text-sm text-text-primary font-medium">
                    {user?.name}
                  </span>
                  {isAdmin && <Shield size={12} className="text-gold" />}
                </div>

                {/* Logout — desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-red-400 hover:bg-red-900/10 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>

                {/* Hamburger — mobile */}
                <button
                  className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-fifa-blue text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-fifa-blue/20 text-fifa-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <div className="px-3 py-2 text-sm text-text-secondary">
                  Signed in as{' '}
                  <span className="text-text-primary font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}