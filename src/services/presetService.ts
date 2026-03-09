import { get, set } from 'idb-keyval';
import { ArtStyle } from './geminiService';

export interface StylePreset {
  id: string;
  name: string;
  style: ArtStyle;
  colorTheme: string;
  density: string;
  creativity: number;
  drawingSpeed: number;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  lighting: string;
  composition: string;
}

const PRESETS_KEY = 'doodle_presets';

export async function savePreset(preset: Omit<StylePreset, 'id'>): Promise<StylePreset> {
  const presets = (await get<StylePreset[]>(PRESETS_KEY)) || [];
  const newPreset: StylePreset = {
    ...preset,
    id: crypto.randomUUID(),
  };
  await set(PRESETS_KEY, [...presets, newPreset]);
  return newPreset;
}

export async function getPresets(): Promise<StylePreset[]> {
  return (await get<StylePreset[]>(PRESETS_KEY)) || [];
}

export async function deletePreset(id: string): Promise<void> {
  const presets = (await get<StylePreset[]>(PRESETS_KEY)) || [];
  await set(PRESETS_KEY, presets.filter(p => p.id !== id));
}
