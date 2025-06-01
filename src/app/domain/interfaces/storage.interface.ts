export interface IStorageService {
  // Méthodes de base
  setItem<T>(key: string, value: T): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
  
  // Méthodes avancées
  hasItem(key: string): boolean;
  getAllKeys(): string[];
  getSize(): number;
  
  // Méthodes avec expiration
  setItemWithExpiry<T>(key: string, value: T, expiryInMinutes: number): void;
  getItemWithExpiry<T>(key: string): T | null;
  
  // Méthodes sécurisées
  setSecureItem<T>(key: string, value: T): void;
  getSecureItem<T>(key: string): T | null;
}

export interface ISessionStorageService extends IStorageService {}
export interface ILocalStorageService extends IStorageService {}
