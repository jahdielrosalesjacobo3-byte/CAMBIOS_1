import { DIDDocument, DIDRegistration, KeyPair } from '../../types/did';
import { KeyManagementService } from '../security/key-management';

export class DIDService {
  private keyManagement: KeyManagementService;
  
  constructor() {
    this.keyManagement = new KeyManagementService();
  }
  
  // Generar DID único
  async generateDID(): Promise<DIDRegistration> {
    try {
      // 1. Generar par de claves criptográficas
      const keyPair = await this.keyManagement.generateKeyPair();
      
      // 2. Crear DID URI (did:wallof:user:unique-id)
      const did = `did:wallof:user:${this.generateUniqueId()}`;
      
      // 3. Crear DID Document
      const didDocument = this.createDIDDocument(did, keyPair.publicKey);
      
      // 4. Simular registro en blockchain (Monad)
      const tx = await this.registerOnBlockchain(didDocument);
      
      // 5. Encriptar clave privada (usando contraseña temporal)
      const encryptedPrivateKey = await this.keyManagement.encryptPrivateKey(
        keyPair.privateKey, 
        'temp-password-123'
      );
      
      // 6. Generar clave de recuperación
      const recoveryKey = await this.keyManagement.generateRecoveryKey();
      
      return {
        did,
        didDocument,
        privateKey: encryptedPrivateKey,
        recoveryKey,
        timestamp: Date.now(),
        blockchainTx: tx.hash
      };
    } catch (error) {
      console.error('Error generating DID:', error);
      throw new Error('Failed to generate DID');
    }
  }
  
  // Crear DID Document
  private createDIDDocument(did: string, publicKey: string): DIDDocument {
    const verificationMethodId = `${did}#keys-1`;
    
    return {
      id: did,
      controller: did,
      verificationMethod: [
        {
          id: verificationMethodId,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyJwk: {
            kty: 'EC',
            crv: 'P-256',
            x: publicKey.substring(0, 32),
            y: publicKey.substring(32, 64)
          }
        }
      ],
      authentication: [verificationMethodId],
      assertionMethod: [verificationMethodId],
      capabilityInvocation: [verificationMethodId],
      capabilityDelegation: [verificationMethodId],
      service: [
        {
          id: `${did}#linked-domain`,
          type: 'LinkedDomains',
          serviceEndpoint: 'https://wallof.app'
        }
      ]
    };
  }
  
  // Generar ID único
  private generateUniqueId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}${random}`.substring(0, 16);
  }
  
  // Simular registro en blockchain
  private async registerOnBlockchain(didDocument: DIDDocument): Promise<{ hash: string }> {
    // Simular transacción blockchain
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`
    };
  }
  
  // Verificar DID
  async verifyDID(did: string): Promise<boolean> {
    try {
      // 1. Resolver DID desde blockchain
      const didDocument = await this.resolveDID(did);
      
      if (!didDocument) {
        return false;
      }
      
      // 2. Verificar estructura del DID Document
      if (!this.validateDIDDocument(didDocument)) {
        return false;
      }
      
      // 3. Verificar firma criptográfica (simulado)
      return this.verifySignature(didDocument);
    } catch (error) {
      console.error('Error verifying DID:', error);
      return false;
    }
  }
  
  // Resolver DID
  async resolveDID(did: string): Promise<DIDDocument | null> {
    try {
      // Simular resolución desde blockchain
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Por ahora, retornamos un DID Document simulado
      return {
        id: did,
        controller: did,
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        capabilityInvocation: [],
        capabilityDelegation: [],
        service: []
      };
    } catch (error) {
      console.error('Error resolving DID:', error);
      return null;
    }
  }
  
  // Validar DID Document
  private validateDIDDocument(didDocument: DIDDocument): boolean {
    return !!(
      didDocument.id &&
      didDocument.controller &&
      didDocument.verificationMethod &&
      didDocument.verificationMethod.length > 0
    );
  }
  
  // Verificar firma (simulado)
  private verifySignature(didDocument: DIDDocument): boolean {
    // Simular verificación de firma
    return true;
  }
  
  // Recuperar DID
  async recoverDID(recoveryKey: string): Promise<DIDRegistration | null> {
    try {
      // 1. Verificar clave de recuperación
      const isValid = await this.keyManagement.verifyRecoveryKey(recoveryKey, recoveryKey);
      
      if (!isValid) {
        throw new Error('Invalid recovery key');
      }
      
      // 2. Recuperar DID desde almacenamiento seguro (simulado)
      return this.retrieveFromSecureStorage(recoveryKey);
    } catch (error) {
      console.error('Error recovering DID:', error);
      return null;
    }
  }
  
  // Recuperar desde almacenamiento seguro (simulado)
  private async retrieveFromSecureStorage(recoveryKey: string): Promise<DIDRegistration | null> {
    // Simular recuperación desde almacenamiento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Por ahora, retornamos null (no hay datos almacenados)
    return null;
  }
  
  // Firmar datos con DID
  async signWithDID(data: string, privateKey: string, password: string): Promise<string> {
    try {
      // 1. Desencriptar clave privada
      const decryptedPrivateKey = await this.keyManagement.decryptPrivateKey(privateKey, password);
      
      // 2. Firmar datos
      return await this.keyManagement.signData(data, decryptedPrivateKey);
    } catch (error) {
      console.error('Error signing with DID:', error);
      throw new Error('Failed to sign with DID');
    }
  }
  
  // Verificar firma con DID
  async verifyWithDID(data: string, signature: string, did: string): Promise<boolean> {
    try {
      // 1. Resolver DID para obtener clave pública
      const didDocument = await this.resolveDID(did);
      
      if (!didDocument || !didDocument.verificationMethod[0]) {
        return false;
      }
      
      // 2. Extraer clave pública
      const publicKey = didDocument.verificationMethod[0].publicKeyJwk;
      
      // 3. Verificar firma
      return await this.keyManagement.verifySignature(data, signature, JSON.stringify(publicKey));
    } catch (error) {
      console.error('Error verifying with DID:', error);
      return false;
    }
  }
} 