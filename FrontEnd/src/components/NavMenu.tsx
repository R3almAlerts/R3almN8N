import React, { useState, useRef, useEffect, Suspense, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ChevronDown, ChevronRight } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { MenuItem } from '../types/menu';

interface NavMenuProps {
  menuItems: MenuItem[];
  onSearch?: (query: string) => void;
  user?: { name: string; avatar?: string };
  loading?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = memo(({ menuItems, onSearch, user, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  useOutsideClick(navRef, closeMenu);

  const renderSubMenu = (items: MenuItem['children'], parentKey: string) => (
    <ul className="absolute top-full left-0 mt-1 glass rounded-md py-2 w-48 z-50 shadow-lg">
      {items?.map((item, idx) => (
        <li key={`${parentKey}-${idx}`}>
          <motion.a
            href={item.href}
            className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 truncate transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={closeMenu}
          >
            {item.label}
          </motion.a>
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <nav className="flex items-center justify-between p-4 glass border-b border-border">
        <div className="space-x-4">
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
      </nav>
    );
  }

  return (
    <nav ref={navRef} role="navigation" aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      {/* Desktop: Horizontal Mega-Menu */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <ul className="flex space-x-8">
          {menuItems.map((item) => (
            <li key={item.label} className="relative group">
              <motion.button
                className="flex items-center space-x-1 text-foreground hover:text-primary-400 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>{item.label}</span>
                {item.children && <ChevronDown className="h-4 w-4" />}
              </motion.button>
              <AnimatePresence>
                {activeDropdown === item.label && item.children && renderSubMenu(item.children, item.label)}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-border bg-white/5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary-400 rounded-md w-64 transition-all backdrop-blur-sm"
            />
          </div>
          {user && (
            <div className="relative group">
              <motion.button 
                className="flex items-center space-x-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
                whileHover={{ scale: 1.05 }}
                animate={{ y: [0, -2, 0] }} // Subtle float integration
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
              >
                <User className="h-5 w-5 text-foreground" />
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </motion.button>
              {/* User Dropdown */}
              <AnimatePresence>
                {activeDropdown === 'user' && (
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full right-0 mt-1 glass rounded-md py-2 w-48 z-50 shadow-lg animate-float"
                  >
                    <li><a href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 transition-colors">Profile</a></li>
                    <li><a href="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 transition-colors">Settings</a></li>
                    <li><a href="/logout" className="block px-4 py-2 text-sm text-destructive hover:bg-white/5 transition-colors">Logout</a></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Hamburger Off-Canvas */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <motion.button onClick={toggleMenu} className="p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="fixed top-0 left-0 h-full w-64 glass shadow-xl z-40 overflow-y-auto border-r border-border"
            >
              <ul className="p-4 space-y-4">
                {menuItems.map((item) => (
                  <li key={item.label} className="border-b border-border pb-4">
                    <motion.button
                      className="flex items-center justify-between w-full text-left text-foreground"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.children && <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-90' : ''}`} />}
                    </motion.button>
                    <AnimatePresence>
                      {activeDropdown === item.label && item.children && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 space-y-2 pl-4"
                        >
                          {item.children.map((subItem, idx) => (
                            <li key={idx}>
                              <a href={subItem.href} className="block py-1 text-sm text-muted-foreground hover:text-primary-400 transition-colors" onClick={closeMenu}>
                                {subItem.label}
                              </a>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
                <li className="pt-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2 border border-border bg-white/5 text-foreground placeholder:text-muted-foreground rounded-md backdrop-blur-sm"
                    />
                  </div>
                  {user && (
                    <a href="/profile" className="flex items-center space-x-3 p-3 bg-secondary-500/10 rounded-md hover:bg-secondary-500/20 transition-colors">
                      <div className="h-8 w-8 bg-secondary-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-background" />
                      </div>
                      <span className="text-foreground">{user.name}</span>
                    </a>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-30 md:hidden" onClick={closeMenu} />}
      </div>
    </nav>
  );
});

NavMenu.displayName = 'NavMenu';

export default NavMenu;