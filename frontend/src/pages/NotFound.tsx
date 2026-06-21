import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">⚽</div>
        <h1 className="text-6xl font-extrabold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-bold text-text-secondary mb-4">Page not found</h2>
        <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
          Looks like this ball went out of bounds. Let's get you back on the pitch.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            Back to dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}