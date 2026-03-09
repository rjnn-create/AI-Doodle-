import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type ArtStyle = 'Doodle' | 'Anime' | 'Cartoon' | 'Watercolor' | 'Sketch' | 'Cyberpunk';

export interface GenerationOptions {
  prompt: string;
  style: ArtStyle;
  referenceImage?: string;
  colorTheme?: string;
  density?: string;
  temperature?: number;
}

export async function generateArt({ prompt, style, referenceImage, colorTheme, density, temperature = 0.7 }: GenerationOptions): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  
  const stylePrompts: Record<ArtStyle, string> = {
    Doodle: "simple line art doodle style, creative, minimal, white background",
    Anime: "anime style, vibrant colors, detailed, high quality",
    Cartoon: "cartoon style, fun, expressive, colorful",
    Watercolor: "watercolor painting style, soft edges, artistic, dreamy",
    Sketch: "pencil sketch style, rough lines, shading, monochrome",
    Cyberpunk: "cyberpunk style, neon lights, futuristic, dark background"
  };

  let finalPrompt = `Create an image with the following description: ${prompt}. Style: ${stylePrompts[style]}.`;
  
  if (colorTheme && colorTheme !== 'Default') {
    finalPrompt += ` Color Palette: ${colorTheme}.`;
  }
  
  if (density) {
    finalPrompt += ` Detail Density: ${density}.`;
  }

  try {
    const contents: any = {
      parts: [
        { text: finalPrompt }
      ]
    };

    // If there's a reference image, add it to the parts for editing/variation
    if (referenceImage) {
      // Extract base64 data from data URL
      const base64Data = referenceImage.split(',')[1];
      const mimeType = referenceImage.substring(referenceImage.indexOf(':') + 1, referenceImage.indexOf(';'));
      
      contents.parts.unshift({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        temperature: temperature,
        // responseMimeType is not supported for nano banana models, so we omit it
      }
    });

    // Extract image from response
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating art:", error);
    throw error;
  }
}
