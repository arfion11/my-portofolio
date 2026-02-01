import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, buttonVariants, scaleIn } from '../../utils/animations';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError('Email atau password salah. Coba lagi.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex items-center justify-center px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
        variants={scaleIn}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 200
          }}
        >
          <motion.div
            className="bg-blue-600 p-4 rounded-full"
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            <Lock size={32} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Admin Login
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Login untuk mengelola portfolio kamu
        </motion.p>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2"
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: { duration: 0.3 }
              }}
              exit={{
                opacity: 0,
                x: 20,
                transition: { duration: 0.2 }
              }}
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              placeholder="admin@example.com"
              required
              animate={{
                scale: focusedField === 'email' ? 1.02 : 1,
                boxShadow: focusedField === 'email'
                  ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  : '0 0 0 0px rgba(59, 130, 246, 0)'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              required
              animate={{
                scale: focusedField === 'password' ? 1.02 : 1,
                boxShadow: focusedField === 'password'
                  ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  : '0 0 0 0px rgba(59, 130, 246, 0)'
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            variants={buttonVariants}
            whileHover={!loading ? "hover" : undefined}
            whileTap={!loading ? "tap" : undefined}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Loading...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        {/* Info */}
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Kamu perlu membuat akun admin di Firebase Authentication terlebih dahulu.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
