import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, RefreshCw, Maximize2 } from 'lucide-react';

interface ResultCardProps {
  imageUrl: string;
  prompt: string;
  onRegenerate: () => void;
}

export default function ResultCard({ imageUrl, prompt, onRegenerate }: ResultCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate "drawing" effect by revealing the image
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `doodlemind-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], 'doodle.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My AI Doodle',
          text: `Check out this art I generated with AI Doodle Art! Prompt: "${prompt}"`,
          files: [file]
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group rounded-2xl overflow-hidden bg-black/20 border border-white/10 aspect-square md:aspect-video flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-xs text-purple-300 font-mono animate-pulse">Finalizing sketch...</p>
          </div>
        )}
        
        {/* Image with "drawing" reveal animation */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: isLoaded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <motion.img
            src={imageUrl}
            alt={prompt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0, 
              scale: isLoaded ? 1 : 1.1,
            }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
          <button 
            onClick={() => window.open(imageUrl, '_blank')}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110"
            title="View Fullscreen"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110"
            title="Download"
          >
            <Download className="w-6 h-6" />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110"
            title="Share"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 truncate max-w-[60%] italic">
          "{prompt}"
        </p>
        <button
          onClick={onRegenerate}
          className="flex items-center px-4 py-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </button>
      </div>
    </div>
  );
}
