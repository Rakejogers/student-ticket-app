'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [router]);

  const handleClose = () => {
    router.back();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: '-50%', x: '-50%' }}
          animate={{ scale: 1, opacity: 1, y: '-50%', x: '-50%' }}
          exit={{ scale: 0.9, opacity: 0, y: '-50%', x: '-50%' }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}