import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, Shield, CheckCircle } from 'lucide-react';

const passwordChecks = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { id: 'special', label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const roles = [
  { value: 'customer', label: 'Customer', desc: 'Apply for loans and manage finances' },
  { value: 'loan_officer', label: 'Loan Officer', desc: 'Process and manage loan applications' },
  { value: 'loan_auditor', label: 'Loan Auditor', desc: 'Audit and verify loan documents' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: '', email: '', mobile: '', password: '', confirmPassword: '', role: 'customer', terms: false },
  });

  const password = watch('password', '');

  const strength = useMemo(() => passwordChecks.filter((c) => c.test(password)).length, [password]);
  const strengthColor = ['#E53935', '#E53935', '#FF9800', '#FF9800', '#4CAF50', '#4CAF50'][strength];
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

  const onSubmit = async (data) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await signup({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: data.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F9] px-4 py-8">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#252525' }}>Create Account</h1>
          <p className="mt-2 text-gray-500">Join Saarthi Bank and start your financial journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8"
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                    errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                    errors.mobile ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                  }`}
                  {...register('mobile', {
                    required: 'Mobile number is required',
                    pattern: { value: /^[+]?[\d\s-]{10,15}$/, message: 'Enter a valid mobile number' },
                  })}
                />
              </div>
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <label
                    key={r.value}
                    className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                      watch('role') === r.value
                        ? 'border-[#E91E63] bg-[#FCE4EC]/50'
                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                    }`}
                  >
                    <input type="radio" value={r.value} className="sr-only" {...register('role')} />
                    <p className="text-sm font-semibold" style={{ color: '#252525' }}>{r.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{r.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
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
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#252525' }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 bg-white/50 outline-none transition-all text-sm ${
                      errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#E91E63]'
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
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
            </div>

            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white/80 rounded-xl p-3 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Password Strength</span>
                  <span className="text-xs font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: strengthColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {passwordChecks.map((check) => (
                    <div key={check.id} className="flex items-center gap-1.5">
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${check.test(password) ? 'text-green-500' : 'text-gray-300'}`}
                      />
                      <span className={`text-[10px] ${check.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#E91E63]"
                {...register('terms', { required: 'You must accept the terms' })}
              />
              <span className="text-sm text-gray-500 leading-tight">
                I agree to the{' '}
                <span className="font-semibold hover:underline cursor-pointer" style={{ color: '#E91E63' }}>Terms of Service</span>
                {' '}and{' '}
                <span className="font-semibold hover:underline cursor-pointer" style={{ color: '#E91E63' }}>Privacy Policy</span>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #E91E63, #E53935)' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#E91E63' }}>
                Sign In
              </Link>
            </p>
          </div>
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
