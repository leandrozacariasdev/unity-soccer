'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNavBar from '@/components/ui/bottom-nav-bar';

export function BottomNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95vw] max-w-[400px]">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <BottomNavBar stickyBottom />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}