import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly SECRET_KEY = 'EduPlatform2024SecretKey!@#';

  encrypt(data: string): string {
    try {
      // Simulation d'un chiffrement simple (en production, utiliser crypto-js ou Web Crypto API)
      const encrypted = this.simpleEncrypt(data);
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData);
      return this.simpleDecrypt(decoded);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  hashPassword(password: string): string {
    // Simulation d'un hash de mot de passe (en production, utiliser bcrypt côté serveur)
    let hash = 0;
    const saltedPassword = password + this.SECRET_KEY;
    
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16);
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  generateSecureId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2);
    return `${timestamp}_${randomPart}`;
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  private simpleEncrypt(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
  }

  private simpleDecrypt(encryptedText: string): string {
    let result = '';
    for (let i = 0; i < encryptedText.length; i++) {
      const charCode = encryptedText.charCodeAt(i);
      const keyChar = this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
  }
}
