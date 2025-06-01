import { Injectable } from '@angular/core';
import { ILocalStorageService } from '../../domain/interfaces/storage.interface';
import { EncryptionService } from '../security/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements ILocalStorageService {
  private readonly prefix = 'edu_platform_';

  constructor(private encryptionService: EncryptionService) {}

  setItem<T>(key: string, value: T): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) return null;

    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isLocalStorageAvailable()) return;
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    if (!this.isLocalStorageAvailable()) return;
    const keys = this.getAllKeys();
    keys.forEach(key => localStorage.removeItem(key));
  }

  hasItem(key: string): boolean {
    if (!this.isLocalStorageAvailable()) return false;
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  getAllKeys(): string[] {
    if (!this.isLocalStorageAvailable()) return [];
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  getSize(): number {
    return this.getAllKeys().length;
  }

  setItemWithExpiry<T>(key: string, value: T, expiryInMinutes: number): void {
    if (!this.isLocalStorageAvailable()) return;
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + (expiryInMinutes * 60 * 1000)
    };
    this.setItem(key, item);
  }

  getItemWithExpiry<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) return null;
    const itemStr = localStorage.getItem(this.getKey(key));
    if (!itemStr) {
      return null;
    }

    try {
      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        this.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading expired item from localStorage:', error);
      return null;
    }
  }

  setSecureItem<T>(key: string, value: T): void {
    if (!this.isLocalStorageAvailable()) return;
    try {
      const serializedValue = JSON.stringify(value);
      const encrypted = this.encryptionService.encrypt(serializedValue);
      localStorage.setItem(this.getKey(key), encrypted);
    } catch (error) {
      console.error('Error saving secure item to localStorage:', error);
    }
  }

  getSecureItem<T>(key: string): T | null {
    if (!this.isLocalStorageAvailable()) return null;
    try {
      const encrypted = localStorage.getItem(this.getKey(key));
      if (!encrypted) return null;

      const decrypted = this.encryptionService.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error reading secure item from localStorage:', error);
      return null;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }
}
