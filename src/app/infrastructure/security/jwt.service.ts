import { Injectable } from '@angular/core';

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class JWTService {
  private readonly SECRET_KEY = 'edu_platform_secret_key_2024';

  generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + (24 * 60 * 60) // 24 heures
    };

    // Simulation d'un JWT (en production, utiliser une vraie librairie JWT)
    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = this.base64UrlEncode(JSON.stringify(fullPayload));
    const signature = this.createSignature(`${header}.${payloadEncoded}`);

    return `${header}.${payloadEncoded}.${signature}`;
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const [header, payload, signature] = parts;
      
      // Vérifier la signature
      const expectedSignature = this.createSignature(`${header}.${payload}`);
      if (signature !== expectedSignature) {
        return null;
      }

      // Décoder le payload
      const decodedPayload = JSON.parse(this.base64UrlDecode(payload)) as JWTPayload;
      
      // Vérifier l'expiration
      const now = Math.floor(Date.now() / 1000);
      if (decodedPayload.exp < now) {
        return null;
      }

      return decodedPayload;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.verifyToken(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  getTokenExpirationDate(token: string): Date | null {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  }

  refreshToken(token: string): string | null {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    // Créer un nouveau token avec les mêmes données
    return this.generateToken({
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    });
  }

  private base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str += new Array(5 - str.length % 4).join('=');
    return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
  }

  private createSignature(data: string): string {
    // Simulation simple d'une signature (en production, utiliser HMAC)
    let hash = 0;
    const combined = data + this.SECRET_KEY;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return this.base64UrlEncode(hash.toString());
  }
}
