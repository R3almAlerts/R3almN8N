// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import clsx from 'clsx';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Sidebar */}
        <SidebarMenu isCollapsed={isCollapsed} onCollapse={() => setIsCollapsed(!isCollapsed)} />

        {/* Main Content */}
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
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NexusPro
          </h1>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;