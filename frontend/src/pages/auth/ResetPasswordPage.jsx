import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services';
import { Eye, EyeOff, Lock, ArrowRight, ArrowLeft, Loader2, Shield, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7F9] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <Shield className="w-8 h-8 text-[#E53935]" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#252525' }}>Invalid Reset Link</h2>
          <p className="text-sm text-gray-500 mb-6">
            This password reset link is invalid or missing a token. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}
          >
            Request New Link
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F9] px-4 py-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#252525' }}>Reset Password</h1>
          <p className="mt-2 text-gray-500">Create a new password for your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#252525' }}>Password Reset!</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sign In Now
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-3 rounded-xl text-sm font-medium text-red-600"
                      style={{ backgroundColor: '#FEE2E2' }}
                    >
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                          errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                        }`}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                          errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                        }`}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (v) => v === password || 'Passwords do not match',
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: '#E91E63' }}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-gray-400 mt-6"
        >
          &copy; 2026 Saarthi Bank. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
