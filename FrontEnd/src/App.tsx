import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavMenu from './components/NavMenu';
import SidebarMenu from './components/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';
import clsx from 'clsx';
import { MenuItem } from './types/menu';

// Lazy-load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Static menu items (dynamic fetch optional via useEffect)
const topMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/' },
  {
    label: 'Workflows',
    href: '/workflows',
    children: [
      { label: 'Templates', href: '/workflows/templates' },
      { label: 'Analytics', href: '/workflows/analytics' }
    ]
  },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Help', href: '/help' }
];

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleSearch = (query: string) => {
    // Integrate with your global search (e.g., navigate to /search?q=query or Supabase query)
    console.log('Global search:', query);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 border-4 border-primary-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Fixed Top Nav (Global Actions) */}
      <NavMenu
        menuItems={topMenuItems}
        onSearch={handleSearch}
        user={user}
        loading={authLoading}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <AnimatePresence mode="wait">
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20"
              >
                <Suspense fallback={<div className="p-8 text-center text-foreground">Loading...</div>}>
                  <Login />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          }
        />
        <Route
          path="/signup"
          element={
            <AnimatePresence mode="wait">
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20"
              >
                <Suspense fallback={<div className="p-8 text-center text-foreground">Loading...</div>}>
                  <Signup />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          }
        />
        <Route
          path="/about"
          element={
            <AnimatePresence mode="wait">
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20"
              >
                <Suspense fallback={<div className="p-8 text-center text-foreground">Loading...</div>}>
                  <About />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex min-h-screen"
                >
                  <SidebarMenu
                    isCollapsed={isCollapsed}
                    onCollapse={() => setIsCollapsed(!isCollapsed)}
                  />
                  <main
                    className={clsx(
                      'flex-1 transition-all duration-300 overflow-auto',
                      isCollapsed ? 'lg:pl-20' : 'lg:pl-80',
                      'pt-20'
                    )}
                  >
                    <div className="container mx-auto px-6 py-12 max-w-7xl glass rounded-lg shadow-xl"> {/* Glass for content depth */}
                      <Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="h-8 w-8 border-4 border-secondary-400 border-t-transparent rounded-full"
                          />
                        </div>
                      }>
                        <Routes>
                          <Route index element={<Home />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </main>
                </motion.div>
              </AnimatePresence>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Mobile Header (Fallback; integrated into NavMenu but preserved for non-protected) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-border md:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold gradient-text">
            NexusPro
          </h1>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;