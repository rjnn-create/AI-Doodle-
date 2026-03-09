import { GoogleGenAI } from "@google/genai";

// --- Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// --- DOM Elements ---
const canvas = document.getElementById('doodleCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const brushTool = document.getElementById('brushTool');
const eraserTool = document.getElementById('eraserTool');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const promptInput = document.getElementById('promptInput');
const styleBtns = document.querySelectorAll('.style-btn');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const galleryGrid = document.getElementById('galleryGrid');
const canvasStatus = document.getElementById('canvasStatus');

// --- State ---
let isDrawing = false;
let history = [];
let currentStyle = 'Digital Art';
let isEraser = false;
let gallery = JSON.parse(localStorage.getItem('doodle_gallery') || '[]');

// --- Canvas Setup ---
function setupCanvas() {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    
    // Create temporary canvas to preserve drawing on resize
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Restore drawing
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Set initial background if empty
    if (history.length === 0) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
    }
    
    // Set brush settings
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Re-init lucide
    if (window.lucide) window.lucide.createIcons();
}

function saveToHistory() {
    if (history.length > 20) history.shift();
    history.push(canvas.toDataURL());
    if (undoBtn) undoBtn.disabled = history.length <= 1;
}

// --- Drawing Logic ---
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.beginPath();
        saveToHistory();
    }
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = brushSize.value;
    ctx.strokeStyle = isEraser ? 'white' : colorPicker.value;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (canvasStatus) canvasStatus.textContent = isEraser ? 'Erasing...' : 'Drawing...';
}

// --- Gallery Logic ---
function updateGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    gallery.slice().reverse().forEach((item) => {
        const div = document.createElement('div');
        div.className = 'relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer';
        div.innerHTML = `
            <img src="${item.url}" class="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p class="text-[10px] font-bold uppercase text-white px-2 text-center">${item.prompt}</p>
            </div>
        `;
        div.onclick = () => {
            resultImage.src = item.url;
            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
        };
        galleryGrid.appendChild(div);
    });
}

function addToGallery(url, prompt) {
    gallery.push({ url, prompt, timestamp: Date.now() });
    if (gallery.length > 12) gallery.shift();
    localStorage.setItem('doodle_gallery', JSON.stringify(gallery));
    updateGallery();
}

// --- Event Listeners ---
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});
canvas.addEventListener('touchend', stopDrawing);

clearBtn.addEventListener('click', () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
    if (canvasStatus) canvasStatus.textContent = 'Canvas cleared';
});

undoBtn.addEventListener('click', () => {
    if (history.length > 1) {
        history.pop();
        const img = new Image();
        img.src = history[history.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            undoBtn.disabled = history.length <= 1;
        };
    }
});

if (brushTool) {
    brushTool.addEventListener('click', () => {
        isEraser = false;
        brushTool.classList.add('bg-indigo-600', 'text-white');
        brushTool.classList.remove('hover:bg-zinc-800', 'text-zinc-400');
        if (eraserTool) {
            eraserTool.classList.remove('bg-indigo-600', 'text-white');
            eraserTool.classList.add('hover:bg-zinc-800', 'text-zinc-400');
        }
    });
}

if (eraserTool) {
    eraserTool.addEventListener('click', () => {
        isEraser = true;
        eraserTool.classList.add('bg-indigo-600', 'text-white');
        eraserTool.classList.remove('hover:bg-zinc-800', 'text-zinc-400');
        if (brushTool) {
            brushTool.classList.remove('bg-indigo-600', 'text-white');
            brushTool.classList.add('hover:bg-zinc-800', 'text-zinc-400');
        }
    });
}

styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStyle = btn.dataset.style;
    });
});

// --- AI Generation ---
async function generateArt() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a prompt!');
        return;
    }

    loadingOverlay.classList.remove('hidden');
    if (canvasStatus) canvasStatus.textContent = 'AI is processing...';
    
    try {
        const base64Canvas = canvas.toDataURL('image/png').split(',')[1];
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Canvas,
                            mimeType: 'image/png'
                        }
                    },
                    {
                        text: `Transform this doodle into a high-quality ${currentStyle} masterpiece. Prompt: ${prompt}. Maintain the composition but add incredible detail, lighting, and texture.`
                    }
                ]
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                resultImage.src = imageUrl;
                resultSection.classList.remove('hidden');
                resultSection.scrollIntoView({ behavior: 'smooth' });
                addToGallery(imageUrl, prompt);
                if (canvasStatus) canvasStatus.textContent = 'Masterpiece generated!';
            }
        }
    } catch (error) {
        console.error('Generation failed:', error);
        alert('Generation failed. Please check your API key and try again.');
        if (canvasStatus) canvasStatus.textContent = 'Generation failed';
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

generateBtn.addEventListener('click', generateArt);

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `ai-doodle-${Date.now()}.png`;
    link.href = resultImage.src;
    link.click();
});

// --- Initialization ---
window.addEventListener('load', () => {
    setupCanvas();
    updateGallery();
});
window.addEventListener('resize', setupCanvas);
