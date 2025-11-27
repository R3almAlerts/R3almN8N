// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SidebarMenu from './components/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';   // ← ADD THIS LINE
import NotFound from './pages/NotFound';
import clsx from 'clsx';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <>
                    <SidebarMenu isCollapsed={isCollapsed} onCollapse={() => setIsCollapsed(!isCollapsed)} />
                    <main
                      className={clsx(
                        'flex-1 transition-all duration-300',
                        isCollapsed ? 'lg:pl-20' : 'lg:pl-80',
                        'pt-16 lg:pt-0'
                      )}
                    >
                      <div className="container mx-auto px-6 py-12 max-w-7xl">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </main>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NexusPro
              </h1>
            </div>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;