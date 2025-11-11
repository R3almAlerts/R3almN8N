// src/pages/NotFound.tsx
import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-9xl font-bold text-gray-700">404</h1>
      <p className="text-2xl text-gray-400 mt-4">Page not found</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}