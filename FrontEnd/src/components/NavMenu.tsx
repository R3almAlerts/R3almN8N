import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { MenuItem } from '../types/menu';
import { useNavMenu } from '../hooks/useNavMenu';

interface NavMenuProps {
  items: MenuItem[];
  user?: { name: string; avatar?: string };
  onSearch?: (q: string) => void;
  loading?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ items, user, onSearch, loading = false }) => {
  const { isOpen, toggleMenu, closeMenu } = useNavMenu();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, closeMenu]);

  return (
    <nav ref={navRef} className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          {items.map((item) => (
            <div key={item.label} className="relative group">
              <button className="flex items-center space-x-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 transition">
                {item.icon && <item.icon size={20} />}
                <span className="font-medium">{item.label}</span>
                {item.children && <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />}
              </button>

              <AnimatePresence>
                {item.children && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <a
                          href={c.href}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              onChange={(e) => onSearch?.(e.target.value)}
              disabled={loading}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {user && (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : <User size={20} />}
                <span className="hidden lg:inline font-medium">{user.name}</span>
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
              >
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex-1 mx-3 relative">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            disabled={loading}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {user && (user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : <User size={20} />)}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <ul>
              {items.map((item) => (
                <li key={item.label} className="border-b border-gray-100 dark:border-gray-700">
                  <details className="group">
                    <summary className="flex items-center space-x-2 p-4 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {item.icon && <item.icon size={20} />}
                      <span className="font-medium">{item.label}</span>
                      {item.children && <ChevronDown size={16} className="ml-auto transition-transform group-open:rotate-180" />}
                    </summary>
                    {item.children && (
                      <ul className="ml-10 space-y-1 pb-2">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a href={c.href} onClick={closeMenu} className="block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavMenu;