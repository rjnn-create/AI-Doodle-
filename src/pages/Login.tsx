import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import ParticlesBackground from '../components/ParticlesBackground';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (userEmail: string) => {
    setIsLoggingIn(true);
    // Simulate a loading period for the animation
    setTimeout(() => {
      login(userEmail);
      navigate('/dashboard');
    }, 2500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      handleLoginSuccess(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white flex items-center justify-center p-4">
      <ParticlesBackground />
      
      <AnimatePresence mode="wait">
        {!isLoggingIn ? (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="w-full max-w-md relative z-10"
          >
            <GlassCard className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20 mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-400">Sign in to continue your creative journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center group"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <button
                  onClick={() => handleLoginSuccess('trial@doodleart.ai')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 rounded-xl font-medium text-emerald-300 transition-all flex items-center justify-center group"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start 7-Day Free Trial
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>No credit card required • Cancel anytime</p>
                  <p className="mt-4">Don't have an account? <span className="text-purple-400 cursor-pointer hover:underline">Sign up</span></p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="loading-state"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center relative z-10"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    rotate: -360,
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-transparent"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    filter: ['drop-shadow(0 0 0px rgba(168,85,247,0))', 'drop-shadow(0 0 20px rgba(168,85,247,0.6))', 'drop-shadow(0 0 0px rgba(168,85,247,0))']
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                AI Doodle Art
              </h2>
              <div className="flex items-center justify-center text-gray-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing your creative dashboard...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
