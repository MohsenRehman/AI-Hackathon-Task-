import React from 'react';
import { X } from 'lucide-react';
import useUiStore from '../../store/uiStore.js';
import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({ id, title, children }) => {
  const { activeModal, closeModal } = useUiStore();
  const isOpen = activeModal === id;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden border border-surface-border"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h3 className="text-lg font-bold font-display text-slate-900">{title}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
