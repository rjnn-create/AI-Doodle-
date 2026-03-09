import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, ArrowLeft, Sparkles, Play, Download, AlertCircle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import GlassCard from '../components/GlassCard';
import LoadingState from '../components/LoadingState';
import { generateVideo } from '../services/geminiService';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function Animator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setLoadingKey(false);
    }
  };

  const handleOpenKeySelector = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true); // Assume success as per guidelines
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setGeneratedVideoUrl(null);

    try {
      const videoUrl = await generateVideo(prompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message?.toLowerCase() || "";
      if (errorMessage.includes("requested entity was not found") || 
          errorMessage.includes("permission_denied") || 
          errorMessage.includes("403")) {
        setHasApiKey(false);
        alert("Your API key may be invalid or lacks permission for this model. Please select a valid paid API key.");
      } else {
        alert("Something went wrong with video generation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingKey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white pb-32">
      <ParticlesBackground />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col items-center">
        
        {/* Back Button */}
        <div className="absolute top-8 left-4 md:left-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
              AI Animation
            </h1>
          </div>
          <p className="text-lg text-gray-400 font-light tracking-wide">
            Generate cinematic short clips from text
          </p>
        </motion.div>

        {!hasApiKey ? (
          <GlassCard className="max-w-md w-full p-8 text-center">
            <Key className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">API Key Required</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Video generation requires a paid Gemini API key. Please select a key from a paid Google Cloud project.
            </p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:underline block mb-6"
            >
              Learn about Gemini API billing
            </a>
            <button
              onClick={handleOpenKeySelector}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
            >
              Select API Key
            </button>
          </GlassCard>
        ) : (
          <div className="w-full max-w-3xl space-y-8">
            <GlassCard className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Video Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A neon hologram of a cat driving a futuristic car at top speed through a cyberpunk city..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-purple-300 mb-2">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {[
                        { id: '16:9', label: 'Landscape' },
                        { id: '9:16', label: 'Portrait' }
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setAspectRatio(ratio.id as any)}
                          className={`flex-1 py-2 rounded-xl border transition-all text-sm font-medium ${
                            aspectRatio === ratio.id 
                              ? 'bg-purple-500/20 border-purple-500 text-white' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {ratio.label} ({ratio.id})
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all
                      ${isLoading || !prompt.trim() 
                        ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        Generate Clip
                      </span>
                    )}
                  </motion.button>
                </div>

                {isLoading && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-purple-300 mb-1">Video generation in progress</p>
                      <p>This usually takes 1-3 minutes. Please stay on this page. We're crafting each frame with AI precision.</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <AnimatePresence mode="wait">
              {generatedVideoUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard className="p-4 overflow-hidden">
                    <div className={`relative rounded-xl overflow-hidden bg-black ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[600px] mx-auto'}`}>
                      <video 
                        src={generatedVideoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 flex justify-between items-center px-2">
                      <div className="text-sm text-gray-400">
                        <p className="font-medium text-white truncate max-w-[200px] md:max-w-md">{prompt}</p>
                        <p className="text-xs">720p • {aspectRatio}</p>
                      </div>
                      <a 
                        href={generatedVideoUrl} 
                        download="ai-animation.mp4"
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        title="Download Video"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
