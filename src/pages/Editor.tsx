import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, MicOff, Image as ImageIcon, X, ArrowLeft, Settings2, Dice5, Save, Trash2, Bookmark, Zap, BrainCircuit, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import GlassCard from '../components/GlassCard';
import StyleSelector from '../components/StyleSelector';
import LoadingState from '../components/LoadingState';
import ResultCard from '../components/ResultCard';
import LiveCanvas from '../components/LiveCanvas';
import { generateArt, ArtStyle } from '../services/geminiService';
import { saveArtToHistory } from '../services/historyService';
import { getPresets, savePreset, deletePreset, StylePreset } from '../services/presetService';

export default function Editor() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>('Doodle');
  const [colorTheme, setColorTheme] = useState('Default');
  const [density, setDensity] = useState('Medium');
  const [creativity, setCreativity] = useState(0.7);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">("1:1");
  const [lighting, setLighting] = useState('Default');
  const [composition, setComposition] = useState('Default');
  const [drawingSpeed, setDrawingSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presets, setPresets] = useState<StylePreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [showLiveCanvas, setShowLiveCanvas] = useState(false);

  useEffect(() => {
    getPresets().then(setPresets);
  }, []);

  // Placeholder suggestions
  const placeholders = [
    "A futuristic city floating in the clouds...",
    "A cute robot watering plants...",
    "A dragon made of crystals...",
    "A cyberpunk street food vendor...",
    "A cat astronaut exploring Mars..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSurpriseMe = () => {
    const randomPrompts = [
      "A steampunk octopus making coffee",
      "A floating island made of candy",
      "A cyberpunk samurai in neon rain",
      "A wise old owl reading a glowing book",
      "A miniature garden inside a lightbulb"
    ];
    const random = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(random);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const image = await generateArt({
        prompt, 
        style, 
        referenceImage: referenceImage || undefined,
        colorTheme,
        density,
        temperature: creativity,
        aspectRatio,
        lighting,
        composition
      });
      setGeneratedImage(image);
      
      // Save to history
      await saveArtToHistory({
        imageUrl: image,
        prompt,
        style,
        colorTheme,
        density,
        aspectRatio,
        lighting,
        composition,
        creativity
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) return;
    const newPreset = await savePreset({
      name: presetName,
      style,
      colorTheme,
      density,
      creativity,
      drawingSpeed,
      aspectRatio,
      lighting,
      composition
    });
    setPresets([...presets, newPreset]);
    setPresetName('');
    setIsSavingPreset(false);
  };

  const handleLoadPreset = (p: StylePreset) => {
    setStyle(p.style);
    setColorTheme(p.colorTheme);
    setDensity(p.density);
    setCreativity(p.creativity);
    setDrawingSpeed(p.drawingSpeed);
    setAspectRatio(p.aspectRatio || "1:1");
    setLighting(p.lighting || "Default");
    setComposition(p.composition || "Default");
    setShowAdvanced(true);
  };

  const handleDeletePreset = async (id: string) => {
    await deletePreset(id);
    setPresets(presets.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0518] to-[#1a0b2e] text-white overflow-x-hidden selection:bg-purple-500/30 pb-32">
      <ParticlesBackground />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col items-center justify-center">
        
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
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
              AI Doodle Art
            </h1>
          </div>
          <p className="text-lg text-gray-400 font-light tracking-wide">
            Turn Your Thoughts into Art
          </p>
        </motion.div>

        {/* Main Interaction Area */}
        <div className="w-full max-w-3xl space-y-8">
          
          <GlassCard className="p-1">
            <div className="bg-black/40 rounded-[1.3rem] p-6 md:p-8 space-y-6">
              
              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full h-32 bg-gradient-to-br from-black/60 to-purple-900/10 border border-white/10 rounded-2xl p-4 pr-12 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/80 transition-all resize-none shadow-inner"
                />
                
                {/* Input Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleSurpriseMe}
                    className="p-2 rounded-xl hover:bg-white/10 text-yellow-400 hover:text-yellow-300 transition-colors"
                    title="Surprise Me"
                  >
                    <Dice5 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowLiveCanvas(true)}
                    className={`p-2 rounded-xl transition-colors ${showLiveCanvas ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    title="Live Drawing"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-xl transition-colors ${referenceImage ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    title="Upload reference image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    title="Voice Input"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Live Canvas Modal */}
              <AnimatePresence>
                {showLiveCanvas && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  >
                    <LiveCanvas 
                      onSave={(data) => {
                        setReferenceImage(data);
                        setShowLiveCanvas(false);
                      }}
                      onClose={() => setShowLiveCanvas(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reference Image Preview */}
              <AnimatePresence>
                {referenceImage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative inline-block"
                  >
                    <div className="relative group">
                      <img 
                        src={referenceImage} 
                        alt="Reference" 
                        className="h-20 w-20 object-cover rounded-lg border border-white/20"
                      />
                      <button
                        onClick={() => setReferenceImage(null)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Using as reference</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <StyleSelector selectedStyle={style} onSelect={setStyle} />
                  
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center px-4 py-3 rounded-xl border border-white/10 transition-colors ${showAdvanced ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'}`}
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Settings
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all flex-1
                      ${isLoading || !prompt.trim() 
                        ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                      }`}
                  >
                    {isLoading ? 'Generating...' : 'Generate Art 🎨'}
                  </motion.button>
                </div>

                {/* Advanced Settings */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Color Theme</label>
                          <select 
                            value={colorTheme}
                            onChange={(e) => setColorTheme(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Default">Default</option>
                            <option value="Pastel">Pastel</option>
                            <option value="Neon">Neon</option>
                            <option value="Monochrome">Monochrome</option>
                            <option value="Vibrant">Vibrant</option>
                            <option value="Earth Tones">Earth Tones</option>
                            <option value="Cinematic">Cinematic</option>
                            <option value="Vintage">Vintage</option>
                            <option value="Noir">Noir</option>
                            <option value="Pop Art">Pop Art</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Detail Density</label>
                          <select 
                            value={density}
                            onChange={(e) => setDensity(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Ultra-Low">Ultra-Low</option>
                            <option value="Low">Low (Minimalist)</option>
                            <option value="Medium">Medium (Balanced)</option>
                            <option value="High">High (Intricate)</option>
                            <option value="Ultra-High">Ultra-High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Aspect Ratio</label>
                          <select 
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as any)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3 (Classic)</option>
                            <option value="3:4">3:4 (Tall)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Lighting</label>
                          <select 
                            value={lighting}
                            onChange={(e) => setLighting(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Default">Default</option>
                            <option value="Cinematic">Cinematic</option>
                            <option value="Natural">Natural</option>
                            <option value="Studio">Studio</option>
                            <option value="Neon">Neon</option>
                            <option value="Dramatic">Dramatic</option>
                            <option value="Soft">Soft</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Composition</label>
                          <select 
                            value={composition}
                            onChange={(e) => setComposition(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="Default">Default</option>
                            <option value="Close-up">Close-up</option>
                            <option value="Wide Shot">Wide Shot</option>
                            <option value="Bird's Eye">Bird's Eye</option>
                            <option value="Rule of Thirds">Rule of Thirds</option>
                            <option value="Symmetrical">Symmetrical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-300 mb-2">Creativity Level</label>
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2">
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.1" 
                              value={creativity} 
                              onChange={(e) => setCreativity(parseFloat(e.target.value))}
                              className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <span className="text-xs text-gray-400 w-8">{Math.round(creativity * 100)}%</span>
                          </div>
                        </div>

                        {/* Sliders */}
                        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="flex items-center text-sm font-medium text-purple-300">
                                <Zap className="w-4 h-4 mr-2" />
                                Drawing Speed
                              </label>
                              <span className="text-xs text-gray-400">{drawingSpeed}x</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="3" 
                              step="0.5" 
                              value={drawingSpeed} 
                              onChange={(e) => setDrawingSpeed(parseFloat(e.target.value))}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>
                        </div>

                        {/* Presets Section */}
                        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-white/10">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold flex items-center text-white">
                              <Bookmark className="w-4 h-4 mr-2 text-purple-400" />
                              Saved Presets
                            </h3>
                            {!isSavingPreset ? (
                              <button 
                                onClick={() => setIsSavingPreset(true)}
                                className="text-xs flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save Current
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <input 
                                  autoFocus
                                  type="text"
                                  value={presetName}
                                  onChange={(e) => setPresetName(e.target.value)}
                                  placeholder="Preset name..."
                                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                                />
                                <button onClick={handleSavePreset} className="text-xs text-emerald-400 hover:text-emerald-300">Save</button>
                                <button onClick={() => setIsSavingPreset(false)} className="text-xs text-red-400 hover:text-red-300">Cancel</button>
                              </div>
                            )}
                          </div>

                          {presets.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No presets saved yet.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {presets.map(p => (
                                <div 
                                  key={p.id}
                                  className="group flex items-center bg-white/5 border border-white/10 rounded-lg pl-3 pr-1 py-1 hover:bg-white/10 transition-colors"
                                >
                                  <button 
                                    onClick={() => handleLoadPreset(p)}
                                    className="text-xs text-gray-300 group-hover:text-white mr-2"
                                  >
                                    {p.name}
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePreset(p.id)}
                                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </GlassCard>

          {/* Result Area */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="p-8 min-h-[400px] flex items-center justify-center">
                  <LoadingState />
                </GlassCard>
              </motion.div>
            ) : generatedImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-6">
                  <ResultCard 
                    imageUrl={generatedImage} 
                    prompt={prompt} 
                    onRegenerate={handleGenerate}
                  />
                </GlassCard>
              </motion.div>
            ) : null}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
