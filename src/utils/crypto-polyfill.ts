import 'react-native-get-random-values';

// Polyfill para crypto en React Native
if (typeof global.crypto === 'undefined') {
  const { getRandomValues } = require('react-native-get-random-values');
  global.crypto = {
    getRandomValues,
    subtle: {
      generateKey: async (algorithm: any, extractable: boolean, keyUsages: string[]) => {
        // Implementación básica para desarrollo
        return {
          type: 'secret',
          extractable,
          algorithm,
          usages: keyUsages,
        };
      },
      exportKey: async (format: string, key: any) => {
        // Implementación básica para desarrollo
        return new ArrayBuffer(32);
      },
      importKey: async (format: string, keyData: any, algorithm: any, extractable: boolean, keyUsages: string[]) => {
        // Implementación básica para desarrollo
        return {
          type: 'secret',
          extractable,
          algorithm,
          usages: keyUsages,
        };
      },
      sign: async (algorithm: any, key: any, data: any) => {
        // Implementación básica para desarrollo
        return new ArrayBuffer(64);
      },
      verify: async (algorithm: any, key: any, signature: any, data: any) => {
        // Implementación básica para desarrollo
        return true;
      },
      encrypt: async (algorithm: any, key: any, data: any) => {
        // Implementación básica para desarrollo
        return new ArrayBuffer(data.byteLength);
      },
      decrypt: async (algorithm: any, key: any, data: any) => {
        // Implementación básica para desarrollo
        return new ArrayBuffer(32);
      },
      deriveKey: async (algorithm: any, baseKey: any, derivedKeyAlgorithm: any, extractable: boolean, keyUsages: string[]) => {
        // Implementación básica para desarrollo
        return {
          type: 'secret',
          extractable,
          algorithm: derivedKeyAlgorithm,
          usages: keyUsages,
        };
      },
      deriveBits: async (algorithm: any, baseKey: any, length: number) => {
        // Implementación básica para desarrollo
        return new ArrayBuffer(length / 8);
      },
    },
  } as Crypto;
} 