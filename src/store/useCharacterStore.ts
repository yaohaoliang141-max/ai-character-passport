import { create } from 'zustand';
import { get, set } from 'idb-keyval';

export interface Character {
  id: string;
  name: string;
  basePrompt: string;
  appearanceTags: string;
  styleLighting: string;
  referenceImage: string | null; // Base64 string stored in IndexedDB
  createdAt: number;
}

interface CharacterState {
  characters: Character[];
  isLoading: boolean;
  loadCharacters: () => Promise<void>;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => Promise<void>;
  updateCharacter: (id: string, character: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'character-passport-data';

export const useCharacterStore = create<CharacterState>((set_state, get_state) => ({
  characters: [],
  isLoading: true,

  loadCharacters: async () => {
    try {
      const data = await get<Character[]>(STORAGE_KEY);
      if (data) {
        set_state({ characters: data });
      }
    } catch (error) {
      console.error('Failed to load characters from IndexedDB:', error);
    } finally {
      set_state({ isLoading: false });
    }
  },

  addCharacter: async (charData) => {
    const newChar: Character = {
      ...charData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    const newCharacters = [newChar, ...get_state().characters];
    set_state({ characters: newCharacters });
    await set(STORAGE_KEY, newCharacters);
  },

  updateCharacter: async (id, updates) => {
    const newCharacters = get_state().characters.map((char) =>
      char.id === id ? { ...char, ...updates } : char
    );
    set_state({ characters: newCharacters });
    await set(STORAGE_KEY, newCharacters);
  },

  deleteCharacter: async (id) => {
    const newCharacters = get_state().characters.filter((char) => char.id !== id);
    set_state({ characters: newCharacters });
    await set(STORAGE_KEY, newCharacters);
  },
}));
