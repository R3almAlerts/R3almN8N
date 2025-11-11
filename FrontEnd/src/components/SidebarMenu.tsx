// src/components/SidebarMenu.tsx
'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  Wrench, 
  Info, 
  Mail, 
  ChevronRight, 
  Search,
  User,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

// ──────────────────────────────────────────────────────────────
// Props to sync collapse state with App.tsx
// ──────────────────────────────────────────────────────────────
interface SidebarMenuProps {
  isCollapsed: boolean;
  onCollapse: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  { label: 'Home', icon: Home, href: '/' },
  {
    label: 'Products',
    icon: Package,
    children: [
      { label: 'Analytics Dashboard', icon: Package, href: '/products/analytics' },
      { label: 'E-commerce Suite', icon: Package, href: '/products/ecommerce' },
      { label: 'API Platform', icon: Package, href: '/products/api' },
      { label: 'Mobile SDK', icon: Package, href: '/products/mobile' },
    ]
  },
  {
    label: 'Services',
    icon: Wrench,
    children: [
      { label: 'Consulting', icon: Wrench, href: '/services/consulting' },
      { label: 'Technical Support', icon: Wrench, href: '/services/support' },
      { label: 'Training', icon: Wrench, href: '/services/training' },
    ]
  },
  { label: 'About', icon: Info, href: '/about' },
  { label: 'Contact', icon: Mail, href: '/contact' },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isCollapsed, onCollapse }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const filteredMenu = menuData
    .map(item => ({
      ...item,
      children: item.children?.filter(child => 
        child.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.children && item.children.length > 0)
    );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const MenuItemComponent = memo(({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const Icon = item.icon;
    const isActive = item.href && location.pathname === item.href;

    return (
      <div className={clsx({ 'ml-4': depth > 0 })}>
        <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.label)}
              className={clsx(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                'hover:bg-white/10 backdrop-blur-sm',
                depth === 0 ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-100 text-sm',
                !isCollapsed && 'pr-3'
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className={clsx(
                  'flex-shrink-0 transition-all duration-200',
                  depth === 0 ? 'w-5 h-5' : 'w-4 h-4',
                  isCollapsed && depth === 0 && 'w-6 h-6'
                )} />
                {!isCollapsed && <span className="truncate font-medium">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </motion.div>
              )}
            </button>
          ) : (
            <Link
              to={item.href!}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:text-white hover:bg-white/10',
                depth > 0 && 'text-sm text-gray-400 hover:text-gray-100'
              )}
            >
              <Icon className={clsx(
                'flex-shrink-0',
                depth === 0 ? 'w-5 h-5' : 'w-4 h-4',
                isCollapsed && depth === 0 && 'w-6 h-6'
              )} />
              {!isCollapsed && <span className="truncate font-medium">{item.label}</span>}
            </Link>
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map((child) => (
                  <MenuItemComponent key={child.label} item={child} depth={depth + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  });

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
            className="overflow-hidden"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NexusPro
            </h1>
          </motion.div>
          <button
            onClick={onCollapse}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 mt-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-4 mt-8 overflow-y-auto">
        <div className="space-y-2">
          {filteredMenu.map((item) => (
            <MenuItemComponent key={item.label} item={item} />
          ))}
        </div>
      </nav>

 {/* User Profile + Logout */}
      {!isCollapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.email || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">Premium</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NexusPro
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className={clsx(
          'fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-40',
          'lg:block hidden',
          isCollapsed ? 'w-20' : 'w-80'
        )}
      >
        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-2xl border-r border-white/10 z-50 lg:hidden mt-16"
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
                <div className="h-full overflow-y-auto pb-16">
                  {sidebarContent}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

SidebarMenu.displayName = 'SidebarMenu';

// ──────────────────────────────────────────────────────────────
// DEFAULT EXPORT – REQUIRED for `import SidebarMenu from '...'`
// ──────────────────────────────────────────────────────────────
export default SidebarMenu;