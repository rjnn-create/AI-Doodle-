import ParticlesBackground from '../components/ParticlesBackground';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Download, Search, Filter, Sparkles } from 'lucide-react';

const MOCK_GALLERY = [
  { id: 1, url: 'https://picsum.photos/seed/ai1/800/800', prompt: 'Cyberpunk city in rain', author: 'Alex', likes: 124 },
  { id: 2, url: 'https://picsum.photos/seed/ai2/800/600', prompt: 'Watercolor cat sleeping', author: 'Sarah', likes: 89 },
  { id: 3, url: 'https://picsum.photos/seed/ai3/600/800', prompt: 'Abstract geometric shapes', author: 'Mike', likes: 256 },
  { id: 4, url: 'https://picsum.photos/seed/ai4/800/800', prompt: 'Space astronaut floating', author: 'Emma', likes: 45 },
  { id: 5, url: 'https://picsum.photos/seed/ai5/800/600', prompt: 'Medieval castle sketch', author: 'John', likes: 167 },
  { id: 6, url: 'https://picsum.photos/seed/ai6/600/800', prompt: 'Neon robot portrait', author: 'Lisa', likes: 342 },
];

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
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100
    }
  }
};

export default function Explore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white pb-32">
      <ParticlesBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Community</span>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
              Explore Creations
            </h1>
            <p className="text-gray-400 mt-1">Discover what the AI Doodle Art community is imagining.</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search prompts..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {MOCK_GALLERY.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="break-inside-avoid"
            >
              <GlassCard className="group overflow-hidden border-white/5 hover:border-purple-500/30 transition-all duration-500">
                <div className="relative">
                  <img 
                    src={item.url} 
                    alt={item.prompt}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <p className="text-white font-medium truncate mb-2">"{item.prompt}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-300 font-medium">by @{item.author}</span>
                      <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-pink-400 backdrop-blur-md transition-all transform hover:scale-110">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all transform hover:scale-110">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
