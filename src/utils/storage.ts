import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Storage wrapper that works on both web and native
class Storage {
  private mmkv: MMKV | null = null;

  constructor() {
    // Only use MMKV on native platforms
    if (Platform.OS !== 'web') {
      this.mmkv = new MMKV();
    }
  }

  getString(key: string): string | undefined {
    if (Platform.OS === 'web') {
      // Use localStorage for web
      const value = localStorage.getItem(key);
      return value || undefined;
    }
    return this.mmkv?.getString(key);
  }

  set(key: string, value: string): void {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      this.mmkv?.set(key, value);
    }
  }

  delete(key: string): void {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      this.mmkv?.delete(key);
    }
  }
}

export const storage = new Storage();
