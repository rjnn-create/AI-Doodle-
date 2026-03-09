import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory, GeneratedArt } from '../services/historyService';
import GlassCard from '../components/GlassCard';
import ParticlesBackground from '../components/ParticlesBackground';
import { Plus, LogOut, Clock, LayoutGrid, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100
    }
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<GeneratedArt[]>([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white pb-32">
      <ParticlesBackground />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/20">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Creator Hub</span>
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-400 mt-1">Ready to turn your thoughts into art today?</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="flex-1 md:flex-none flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold transition-all shadow-xl shadow-purple-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Creation
            </motion.button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.header>

        {/* Stats / Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: LayoutGrid, label: "Total Creations", value: history.length, color: "blue" },
            { icon: Zap, label: "Credits Remaining", value: "750", valueSuffix: "/1000", color: "purple" },
            { icon: TrendingUp, label: "Current Streak", value: "5", valueSuffix: " days", color: "emerald" }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <GlassCard className="p-6 flex items-center space-x-4 hover:bg-white/5 transition-colors group cursor-default">
                <div className={`p-4 bg-${stat.color}-500/20 rounded-2xl text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    {stat.valueSuffix && <span className="text-gray-500 text-sm">{stat.valueSuffix}</span>}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Gallery Section */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="w-6 h-6 mr-3 text-purple-400" />
              Recent Masterpieces
            </h2>
            {history.length > 0 && (
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                View All
              </button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {history.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Plus className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No creations yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                  Your artistic journey starts here. Create your first AI-powered masterpiece.
                </p>
                <button
                  onClick={() => navigate('/create')}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
                >
                  Get Started
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.map((art, index) => (
                  <motion.div
                    key={art.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <GlassCard className="overflow-hidden border-white/5 group-hover:border-purple-500/30 transition-all duration-500">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={art.imageUrl} 
                          alt={art.prompt} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => window.open(art.imageUrl, '_blank')}
                              className="flex-1 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                            >
                              View Full
                            </button>
                            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold truncate text-white flex-1 mr-4">{art.prompt}</p>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                            {art.style}
                          </span>
                        </div>
                        <div className="flex items-center text-[11px] text-gray-500">
                          <Clock className="w-3 h-3 mr-1.5" />
                          <span>{new Date(art.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
