import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavMenu from './components/NavMenu';
import SidebarMenu from './components/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';
import clsx from 'clsx';
import { MenuItem } from './types/menu';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';

// Lazy-load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));

// QueryClient for React Query (user management caching)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 }, // 5 min cache
  },
});

// Static menu items (dynamic; adds Profile for logged-in users)
function getTopMenuItems(user: any): MenuItem[] {
  const baseItems: MenuItem[] = [
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
  if (user) {
    baseItems.push({ label: 'Profile', href: '/profile' });
    if (user.role === 'admin') {
      baseItems.push({ label: 'Users', href: '/users' });
    }
  }
  return baseItems;
}

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
          className="h-8 w-8 border-4 border-secondary-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const topMenuItems = getTopMenuItems(user);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Fixed Top Nav (Global Actions) - Always visible */}
      <NavMenu
        menuItems={topMenuItems}
        onSearch={handleSearch}
        user={user}
        loading={authLoading}
        brandTitle="NexusPro" // Optional prop for mobile header integration
      />

      <Routes>
        {/* Public Routes - Full-bleed, no sidebar */}
        <Route
          path="/login"
          element={
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20" // Offset for fixed nav
              >
                <Suspense fallback={
                  <div className="p-8 text-center glass rounded-xl mx-auto max-w-md mt-8">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                }>
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
                key={location.pathname}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20"
              >
                <Suspense fallback={
                  <div className="p-8 text-center glass rounded-xl mx-auto max-w-md mt-8">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                }>
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
                key={location.pathname}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex-1 pt-20"
              >
                <Suspense fallback={
                  <div className="p-8 text-center glass rounded-xl mx-auto max-w-md mt-8">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                }>
                  <About />
                </Suspense>
              </motion.div>
            </AnimatePresence>
          }
        />

        {/* Protected Routes - With sidebar */}
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
                      'pt-20' // Offset for fixed nav
                    )}
                  >
                    <div className="container mx-auto px-6 py-12 max-w-7xl glass rounded-lg shadow-xl">
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
                          <Route path="/profile" element={<UserProfile />} />
                          <Route path="/users" element={<UserList />} />
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
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;