export interface DIDDocument {
  id: string;                    // DID URI
  controller: string;            // Controlador del DID
  verificationMethod: {          // Métodos de verificación
    id: string;
    type: 'Ed25519VerificationKey2020' | 'EcdsaSecp256k1VerificationKey2019';
    controller: string;
    publicKeyJwk: any;
  }[];
  authentication: string[];      // Métodos de autenticación
  assertionMethod: string[];     // Métodos de aserción
  capabilityInvocation: string[]; // Métodos de invocación
  capabilityDelegation: string[]; // Métodos de delegación
  service: {                     // Servicios asociados
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
}

export interface DIDRegistration {
  did: string;
  didDocument: DIDDocument;
  privateKey: string;            // Clave privada (encriptada)
  recoveryKey: string;           // Clave de recuperación
  timestamp: number;
  blockchainTx: string;          // Transacción de registro
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;                // DID del emisor
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string;                  // DID del sujeto
    [key: string]: any;          // Datos de la credencial
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

export interface VCRequest {
  type: 'PERSONHOOD' | 'KYC' | 'CREDIT_SCORE' | 'TRADING_LICENSE';
  subjectDID: string;
  issuerDID: string;
  data: any;
  expirationDays?: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: 'ECDSA' | 'Ed25519';
}

export interface IdentityState {
  did?: string;
  didDocument?: DIDDocument;
  credentials: VerifiableCredential[];
  isVerified: boolean;
  verificationMethod: 'POLYGON_ID' | 'WORLDCOIN' | 'MANUAL';
} 