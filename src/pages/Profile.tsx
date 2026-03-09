import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import ParticlesBackground from '../components/ParticlesBackground';
import { User, Settings, CreditCard, Bell, Shield, LogOut, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white pb-32">
      <ParticlesBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <GlassCard className="p-8 flex flex-col md:flex-row items-center gap-6 border-white/5 hover:border-purple-500/30 transition-all duration-500">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 shadow-xl shadow-purple-500/20"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-1"
              >
                {user?.name || 'User'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 mb-4"
              >
                {user?.email}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider"
              >
                <Crown className="w-4 h-4 mr-2" />
                Pro Member
              </motion.div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-8 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all text-red-400 font-medium"
            >
              Sign Out
            </motion.button>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-8 h-full border-white/5 hover:border-purple-500/30 transition-all duration-500">
              <h2 className="text-xl font-bold mb-8 flex items-center">
                <Settings className="w-5 h-5 mr-3 text-purple-400" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <motion.button 
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  <span className="flex items-center text-gray-300 font-medium">
                    <Bell className="w-5 h-5 mr-4 text-gray-500" />
                    Notifications
                  </span>
                  <div className="w-11 h-6 bg-purple-600 rounded-full relative shadow-inner">
                    <motion.div 
                      layout
                      className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" 
                    />
                  </div>
                </motion.button>
                <motion.button 
                  whileHover={{ x: 5 }}
                  className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  <span className="flex items-center text-gray-300 font-medium">
                    <Shield className="w-5 h-5 mr-4 text-gray-500" />
                    Privacy & Security
                  </span>
                  <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Manage</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-8 h-full border-white/5 hover:border-blue-500/30 transition-all duration-500">
              <h2 className="text-xl font-bold mb-8 flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                Subscription
              </h2>
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 to-blue-900/10 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">Pro Plan</h3>
                        <p className="text-xs text-gray-500 mt-1">Next billing: Mar 24, 2026</p>
                      </div>
                      <span className="text-2xl font-black text-white">$19<span className="text-xs font-normal text-gray-500">/mo</span></span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      />
                    </div>
                    <div className="flex justify-between mt-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Usage</p>
                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">750 / 1000 Credits</p>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm shadow-xl shadow-white/5 hover:shadow-white/10 transition-all"
                >
                  Manage Subscription
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
