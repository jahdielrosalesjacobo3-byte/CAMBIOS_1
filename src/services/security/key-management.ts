import { KeyPair } from '../../types/did';
import 'react-native-get-random-values';

export class KeyManagementService {
  // Generar par de claves ECDSA (simulado para desarrollo)
  async generateKeyPair(): Promise<KeyPair> {
    try {
      // Simulación para desarrollo - en producción usar crypto.subtle
      const publicKey = btoa(Math.random().toString(36) + Date.now().toString(36));
      const privateKey = btoa(Math.random().toString(36) + Date.now().toString(36));
      
      return {
        publicKey,
        privateKey,
        algorithm: 'ECDSA'
      };
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw new Error('Failed to generate key pair');
    }
  }
  
  // Exportar clave pública
  private async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }
  
  // Exportar clave privada
  private async exportPrivateKey(privateKey: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }
  
  // Encriptar clave privada
  async encryptPrivateKey(privateKey: string, password: string): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await this.deriveKey(password, salt);
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: salt },
        key,
        new TextEncoder().encode(privateKey)
      );
      
      return btoa(JSON.stringify({
        encrypted: Array.from(new Uint8Array(encrypted)),
        salt: Array.from(salt)
      }));
    } catch (error) {
      console.error('Error encrypting private key:', error);
      throw new Error('Failed to encrypt private key');
    }
  }
  
  // Desencriptar clave privada
  async decryptPrivateKey(encryptedKey: string, password: string): Promise<string> {
    try {
      const { encrypted, salt } = JSON.parse(atob(encryptedKey));
      const key = await this.deriveKey(password, new Uint8Array(salt));
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(salt) },
        key,
        new Uint8Array(encrypted)
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Error decrypting private key:', error);
      throw new Error('Failed to decrypt private key');
    }
  }
  
  // Derivar clave desde contraseña
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Generar clave de recuperación
  async generateRecoveryKey(): Promise<string> {
    const recoveryKey = crypto.getRandomValues(new Uint8Array(32));
    return btoa(String.fromCharCode(...recoveryKey));
  }
  
  // Verificar clave de recuperación
  async verifyRecoveryKey(recoveryKey: string, storedKey: string): Promise<boolean> {
    try {
      return recoveryKey === storedKey;
    } catch (error) {
      return false;
    }
  }
  
  // Firmar datos
  async signData(data: string, privateKey: string): Promise<string> {
    try {
      const key = await this.importPrivateKey(privateKey);
      const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        new TextEncoder().encode(data)
      );
      
      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
      console.error('Error signing data:', error);
      throw new Error('Failed to sign data');
    }
  }
  
  // Verificar firma
  async verifySignature(data: string, signature: string, publicKey: string): Promise<boolean> {
    try {
      const key = await this.importPublicKey(publicKey);
      const isValid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        key,
        new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0))),
        new TextEncoder().encode(data)
      );
      
      return isValid;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }
  
  // Importar clave privada
  private async importPrivateKey(privateKeyBase64: string): Promise<CryptoKey> {
    const privateKeyData = new Uint8Array(atob(privateKeyBase64).split('').map(c => c.charCodeAt(0)));
    return crypto.subtle.importKey(
      'pkcs8',
      privateKeyData,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
  }
  
  // Importar clave pública
  private async importPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
    const publicKeyData = new Uint8Array(atob(publicKeyBase64).split('').map(c => c.charCodeAt(0)));
    return crypto.subtle.importKey(
      'spki',
      publicKeyData,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
  }
} 