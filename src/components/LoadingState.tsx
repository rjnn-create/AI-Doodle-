import { motion } from 'motion/react';
import { PenTool } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        {/* Animated glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-t-2 border-l-2 border-purple-500/50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-24 h-24 rounded-full border-b-2 border-r-2 border-blue-500/30"
        />
        
        {/* Centered Pen Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PenTool className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
      >
        Creating your imagination...
      </motion.p>
    </div>
  );
}
