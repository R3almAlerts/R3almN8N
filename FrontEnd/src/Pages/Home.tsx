// src/pages/Home.tsx
import React from 'react';
import { Package, TrendingUp, Users, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to NexusPro
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl">
          Experience the future of professional dashboards with our sleek, dark-themed interface. 
          Built for performance, designed for elegance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Revenue', value: '$2.4M', change: '+12.5%' },
          { icon: Users, label: 'Active Users', value: '48.2K', change: '+8.3%' },
          { icon: Package, label: 'Products', value: '1,234', change: '+23.1%' },
          { icon: Settings, label: 'Services', value: '89', change: '+5.7%' },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 group hover:bg-white/10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-400" />
                <span className="text-sm font-medium text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Premium Components</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Beautifully crafted components with glassmorphism effects, gradient accents, 
            and smooth animations.
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Responsive design
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Dark mode optimized
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              Accessible
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Production Ready</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Built with React 18+, TypeScript, Tailwind CSS, and Framer Motion.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['TypeScript', 'Tailwind', 'Framer Motion', 'Lucide Icons'].map((tech) => (
              <div key={tech} className="py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-center text-sm font-medium">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}