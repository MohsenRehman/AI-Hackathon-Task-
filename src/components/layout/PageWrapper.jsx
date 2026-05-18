import React from 'react';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import useUiStore from '../../store/uiStore.js';
import { motion } from 'framer-motion';

const PageWrapper = ({ title, children }) => {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar Backdrop Overlay on Mobile */}
      {!sidebarCollapsed && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-35 md:hidden cursor-pointer"
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ml-0 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <Navbar title={title} />
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
