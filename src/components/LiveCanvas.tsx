import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Eraser, Pencil, Trash2, Check, X, Minus, Plus, Undo2 } from 'lucide-react';

interface LiveCanvasProps {
  onSave: (imageData: string) => void;
  onClose: () => void;
}

export default function LiveCanvas({ onSave, onClose }: LiveCanvasProps) {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<any[]>([]);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 500, height: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(500, containerRef.current.offsetWidth - 32);
        setStageSize({ width, height: 400 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, strokeWidth, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    if (!lastLine) return;
    
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleSave = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      onSave(uri);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 p-4 bg-black/95 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl w-full max-w-xl">
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20">
            <Pencil className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Live Sketch Pad</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative bg-white rounded-2xl overflow-hidden cursor-crosshair shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border border-white/5">
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#000000"
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="flex flex-wrap items-center justify-between w-full gap-4 mt-2">
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setTool('pen')}
            className={`p-2.5 rounded-xl transition-all ${tool === 'pen' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40' : 'text-gray-400 hover:text-white'}`}
            title="Pencil"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2.5 rounded-xl transition-all ${tool === 'eraser' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40' : 'text-gray-400 hover:text-white'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={handleUndo}
            disabled={lines.length === 0}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            disabled={lines.length === 0}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stroke</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 2))} className="p-1 text-gray-400 hover:text-white transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono font-bold text-purple-400 w-6 text-center">{strokeWidth}</span>
            <button onClick={() => setStrokeWidth(Math.min(30, strokeWidth + 2))} className="p-1 text-gray-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Check className="w-5 h-5" />
          Apply Sketch
        </button>
      </div>
    </div>
  );
}
