import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-light z-50">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className={`${sizes.lg} border-4 border-primary-light border-t-primary-pink rounded-full mx-auto`} />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className={`${sizes[size]} border-4 border-primary-light border-t-primary-pink rounded-full`} />
    </div>
  );
}
