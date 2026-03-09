import { ArtStyle } from './geminiService';

export interface GeneratedArt {
  id: string;
  imageUrl: string;
  prompt: string;
  style: ArtStyle;
  timestamp: number;
  colorTheme?: string;
  density?: string;
}

import { get, set } from 'idb-keyval';

const HISTORY_KEY = 'doodle_history';

export async function saveArtToHistory(art: Omit<GeneratedArt, 'id' | 'timestamp'>): Promise<GeneratedArt> {
  const history = (await get<GeneratedArt[]>(HISTORY_KEY)) || [];
  const newArt: GeneratedArt = {
    ...art,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  // Prepend to history
  await set(HISTORY_KEY, [newArt, ...history]);
  return newArt;
}

export async function getHistory(): Promise<GeneratedArt[]> {
  return (await get<GeneratedArt[]>(HISTORY_KEY)) || [];
}

export async function clearHistory(): Promise<void> {
  await set(HISTORY_KEY, []);
}
