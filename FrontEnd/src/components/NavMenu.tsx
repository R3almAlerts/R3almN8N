import React, { useState, useRef, useEffect, Suspense, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown, ChevronRight } from 'lucide-react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { MenuItem } from '../types/menu';

interface NavMenuProps {
  menuItems: MenuItem[];
  onSearch?: (query: string) => void;
  user?: { name: string; avatar?: string };
  loading?: boolean;
  brandTitle?: string; // Optional for mobile header
}

const NavMenu: React.FC<NavMenuProps> = memo(({ menuItems, onSearch, user, loading = false, brandTitle }) => {
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') action();
    if (e.key === 'Escape') closeMenu();
  }, []);

  const renderSubMenu = useCallback((items: MenuItem['children'], parentKey: string, isMobile = false) => (
    <ul className={`glass rounded-md py-2 w-48 z-50 shadow-lg ${!isMobile ? 'absolute top-full left-0 mt-1 border border-border/50 bg-gradient-to-b from-transparent to-white/5' : 'mt-2 pl-4 space-y-2 border-l border-border'}`}>
      {items?.map((item, idx) => (
        <li key={`${parentKey}-${idx}`}>
          <motion.div
            as={Link}
            to={item.href}
            className={`block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 truncate transition-colors ${isMobile ? 'py-1 pl-0' : ''}`}
            initial={{ opacity: 0, x: isMobile ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={closeMenu}
            title={item.label} // Tooltip for truncated
            whileTap={{ scale: 0.98 }} // Subtle ripple
          >
            {item.label}
          </motion.div>
        </li>
      ))}
    </ul>
  ), []);

  if (loading) {
    return (
      <nav className="flex items-center justify-between p-4 glass border-b border-border">
        <div className="space-x-4 flex-1">
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="h-6 w-24 bg-white/10 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
      </nav>
    );
  }

  return (
    <nav ref={navRef} role="navigation" aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      {/* Desktop: Horizontal Mega-Menu */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <ul className="flex space-x-8" role="menubar">
          {menuItems.map((item) => (
            <li key={item.label} className="relative group" role="none">
              <motion.button
                className="flex items-center space-x-1 text-foreground hover:text-primary-400 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
                onKeyDown={(e) => handleKeyDown(e, () => setActiveDropdown(item.label))}
                aria-expanded={activeDropdown === item.label}
                role="menuitem"
                tabIndex={0}
              >
                <span>{item.label}</span>
                {item.children && <ChevronDown className="h-4 w-4 transition-transform" style={{ transform: activeDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
              </motion.button>
              <AnimatePresence>
                {activeDropdown === item.label && item.children && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {renderSubMenu(item.children, item.label)}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-border bg-white/5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary-400 rounded-md w-64 transition-all backdrop-blur-sm"
              aria-label="Search workflows"
            />
          </div>
          {user && (
            <div className="relative group" role="menubar">
              <motion.button 
                className="flex items-center space-x-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
                whileHover={{ scale: 1.05 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                onKeyDown={(e) => handleKeyDown(e, () => setActiveDropdown(activeDropdown === 'user' ? null : 'user'))}
                aria-expanded={activeDropdown === 'user'}
                role="menuitem"
                tabIndex={0}
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
                    role="menu"
                  >
                    <li role="none"><Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 transition-colors" onClick={closeMenu}>Profile</Link></li>
                    <li role="none"><Link to="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-white/5 hover:text-primary-400 transition-colors" onClick={closeMenu}>Settings</Link></li>
                    <li role="none"><Link to="/logout" className="block px-4 py-2 text-sm text-destructive hover:bg-white/5 transition-colors" onClick={closeMenu}>Logout</Link></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Compact Header with Off-Canvas */}
      <div className="md:hidden flex items-center justify-between px-4 py-3" role="banner">
        <motion.button onClick={toggleMenu} className="p-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" aria-label="Toggle menu" aria-expanded={isOpen}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
        {brandTitle && (
          <h1 className="text-xl font-bold gradient-text flex-1 text-center mx-4 truncate">
            {brandTitle}
          </h1>
        )}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-5 w-5 text-muted-foreground cursor-pointer" onClick={toggleMenu} aria-label="Open search in menu" />
          </div>
          {user && (
            <motion.button 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              whileTap={{ scale: 0.98 }}
              onClick={toggleMenu}
              aria-label={`Open menu for ${user.name}`}
            >
              <User className="h-5 w-5 text-foreground" />
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="fixed top-0 left-0 h-full w-64 glass shadow-xl z-40 overflow-y-auto border-r border-border"
              role="menu"
            >
              <ul className="p-4 space-y-4">
                {menuItems.map((item) => (
                  <li key={item.label} className="border-b border-border pb-4" role="none">
                    <motion.button
                      className="flex items-center justify-between w-full text-left text-foreground"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      onKeyDown={(e) => handleKeyDown(e, () => setActiveDropdown(activeDropdown === item.label ? null : item.label))}
                      aria-expanded={activeDropdown === item.label}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.children && <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-90' : ''}`} />}
                    </motion.button>
                    <AnimatePresence>
                      {activeDropdown === item.label && item.children && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          {renderSubMenu(item.children, item.label, true)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
                <li className="pt-4 border-t border-border">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2 border border-border bg-white/5 text-foreground placeholder:text-muted-foreground rounded-md backdrop-blur-sm"
                      aria-label="Search"
                    />
                  </div>
                  {user && (
                    <div className="relative group">
                      <motion.button 
                        className="flex items-center space-x-3 w-full p-3 bg-secondary-500/10 rounded-md hover:bg-secondary-500/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                        aria-expanded={activeDropdown === 'user'}
                      >
                        <div className="h-8 w-8 bg-secondary-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-background" />
                        </div>
                        <span className="text-foreground font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </motion.button>
                      <AnimatePresence>
                        {activeDropdown === 'user' && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 pl-4 space-y-2 border-l border-border"
                            role="menu"
                          >
                            <li role="none"><Link to="/profile" className="block py-2 text-sm text-muted-foreground hover:text-primary-400" onClick={closeMenu}>Profile</Link></li>
                            <li role="none"><Link to="/settings" className="block py-2 text-sm text-muted-foreground hover:text-primary-400" onClick={closeMenu}>Settings</Link></li>
                            <li role="none"><Link to="/logout" className="block py-2 text-sm text-destructive hover:text-red-500" onClick={closeMenu}>Logout</Link></li>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-30 md:hidden" onClick={closeMenu} aria-hidden />}
      </div>
    </nav>
  );
});

NavMenu.displayName = 'NavMenu';

export default NavMenu;