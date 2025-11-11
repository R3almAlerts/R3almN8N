import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User } from 'lucide-react'; // Icons
import type { MenuItem } from '../types/menu.tsx'; // Type-only
import { useNavMenu } from '../hooks/useNavMenu.tsx';

interface NavMenuProps {
  items: MenuItem[];
  user?: { name: string; avatar?: string };
  onSearch?: (query: string) => void;
  loading?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = React.memo(({ items, user, onSearch, loading = false }) => {
  const { isOpen, toggleMenu, closeMenu } = useNavMenu();
  const navRef = useRef<HTMLElement>(null);

  // Outside click detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);

  // Keyboard nav (focus management)
  useEffect(() => {
    if (isOpen && navRef.current) {
      (navRef.current.querySelector('a') as HTMLElement)?.focus();
    }
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
    >
      {/* Desktop: Horizontal Mega Menu */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          {items.map((item) => (
            <div key={item.label} className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                onClick={() => {/* Toggle sub via state if needed */}}
                aria-haspopup="true"
                aria-expanded={false} // Dynamic later
              >
                {item.icon ? React.createElement(item.icon, { size: 20 }) : null}
                <span>{item.label}</span>
                {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
              </button>
              <AnimatePresence>
                {item.children && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 w-48 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    {item.children.map((child: MenuItem) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={closeMenu}
                        >
                          {child.label}
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
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onSearch?.(e.target.value)}
              disabled={loading}
            />
            {loading && <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          </div>
          {user && (
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={20} />
                )}
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              {/* Avatar Dropdown - Stub */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 w-48 z-50"
              >
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Hamburger Menu */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1 mx-4 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch?.(e.target.value)}
            disabled={loading}
          />
          {loading && <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
        </div>
        {user && (
          <div className="flex items-center space-x-2">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : <User size={20} />}
          </div>
        )}
      </div>

      {/* Mobile Slide-Down Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <ul className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {items.map((item) => (
                <li key={item.label} className="border-b border-gray-100 dark:border-gray-700">
                  <details className="p-4">
                    <summary className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600">
                      {item.icon ? React.createElement(item.icon, { size: 20 }) : null}
                      <span>{item.label}</span>
                    </summary>
                    {item.children && (
                      <ul className="mt-2 ml-6 space-y-1">
                        {item.children.map((child: MenuItem) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                              onClick={closeMenu}
                            >
                              {child.label}
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
});

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default NavMenu;