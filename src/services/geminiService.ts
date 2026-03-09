import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || "" });

export type ArtStyle = 'Doodle' | 'Anime' | 'Cartoon' | 'Watercolor' | 'Sketch' | 'Cyberpunk';

export interface GenerationOptions {
  prompt: string;
  style: ArtStyle;
  referenceImage?: string;
  colorTheme?: string;
  density?: string;
  temperature?: number;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  lighting?: string;
  composition?: string;
}

export async function generateArt({ 
  prompt, 
  style, 
  referenceImage, 
  colorTheme, 
  density, 
  temperature = 0.7,
  aspectRatio = "1:1",
  lighting,
  composition
}: GenerationOptions): Promise<string> {
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
  
  if (density && density !== 'Medium') {
    finalPrompt += ` Detail Density: ${density}.`;
  }

  if (lighting && lighting !== 'Default') {
    finalPrompt += ` Lighting: ${lighting}.`;
  }

  if (composition && composition !== 'Default') {
    finalPrompt += ` Composition: ${composition}.`;
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
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
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

export async function generateVideo(prompt: string, aspectRatio: "16:9" | "9:16" = "16:9"): Promise<string> {
  // Veo models REQUIRE a user-selected paid API key (process.env.API_KEY)
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("A paid API key is required for video generation. Please select one in the UI.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no download link");

  // To fetch the video, append the Gemini API key to the `x-goog-api-key` header.
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });

  if (!response.ok) throw new Error("Failed to download video");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
