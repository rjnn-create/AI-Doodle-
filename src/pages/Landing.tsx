import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Palette, Share2, MousePointer2, Pencil } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import GlassCard from '../components/GlassCard';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white overflow-hidden selection:bg-purple-500/30">
      <ParticlesBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AI Doodle Art</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-4">
            <Zap className="w-4 h-4 mr-2" />
            <span>V2.0 Now Live: Enhanced Sketch Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Turn Your Thoughts <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">
              Into Masterpieces
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The world's most advanced AI doodle generator. Transform simple text descriptions into 
            stunning, hand-drawn style artwork in seconds.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              <span className="flex items-center">
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium flex items-center">
              <MousePointer2 className="w-5 h-5 mr-2" />
              View Gallery
            </button>
          </div>
        </motion.div>

        {/* Floating Mockup Elements */}
        <div className="relative mt-24 h-[400px] md:h-[600px] w-full max-w-5xl mx-auto perspective-1000">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-10 md:-left-12 z-10 w-64 md:w-80">
            <GlassCard className="p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img src="https://picsum.photos/seed/doodle1/400/400" alt="Doodle" className="rounded-lg mb-3" />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">AI</div>
                "A cute robot watering plants"
              </div>
            </GlassCard>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute left-1/2 top-0 transform -translate-x-1/2 z-20 w-full md:w-[600px]"
          >
            <GlassCard className="p-2 bg-black/80 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                <div className="text-center space-y-4 p-8 relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="h-2 w-32 mx-auto bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    />
                  </div>
                  <p className="text-sm text-purple-300 font-mono">Generating masterpiece...</p>
                </div>
                
                {/* Hover Reveal Effect Mockup */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black">
                   <img src="https://picsum.photos/seed/hero/800/450" className="w-full h-full object-cover opacity-80" />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div style={{ y: y2 }} className="absolute right-0 bottom-10 md:-right-12 z-10 w-64 md:w-80">
            <GlassCard className="p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <img src="https://picsum.photos/seed/doodle2/400/400" alt="Doodle" className="rounded-lg mb-3" />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">AI</div>
                "Cyberpunk street food vendor"
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Palette, title: "Multiple Styles", desc: "From pencil sketches to vibrant watercolors, choose the perfect aesthetic." },
            { icon: Pencil, title: "Live Sketch Pad", desc: "Draw your ideas directly on our interactive canvas for AI to enhance." },
            { icon: Zap, title: "Lightning Fast", desc: "Powered by Gemini Flash, generate high-quality art in milliseconds." },
          ].map((feature, i) => (
            <div key={i}>
              <GlassCard className="p-8 hover:bg-white/5 transition-colors h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 text-purple-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
