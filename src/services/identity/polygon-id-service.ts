import { 
  IdentityWallet, 
  CredentialWallet, 
  ProofService,
  CircuitId,
  ProofQuery,
  CredentialRequest,
  ZeroKnowledgeProofRequest,
  AuthorizationRequestMessage,
  ProofGenerationOptions
} from '@0xpolygonid/js-sdk';

export class PolygonIDService {
  private identityWallet: IdentityWallet | null = null;
  private credentialWallet: CredentialWallet | null = null;
  private proofService: ProofService | null = null;

  // Inicializar el servicio
  async initialize() {
    try {
      // Configuración para desarrollo
      const config = {
        rpcUrl: 'https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID',
        contractAddress: '0x134B1BE34911E39A8397ec6289782989729807a4',
        chainId: 80001 // Mumbai testnet
      };

      // Crear wallets y servicios
      this.identityWallet = new IdentityWallet();
      this.credentialWallet = new CredentialWallet();
      this.proofService = new ProofService();

      console.log('Polygon ID service initialized');
    } catch (error) {
      console.error('Error initializing Polygon ID service:', error);
      throw error;
    }
  }

  // Crear identidad
  async createIdentity(): Promise<{ did: string; privateKey: string }> {
    try {
      if (!this.identityWallet) {
        throw new Error('Identity wallet not initialized');
      }

      // Generar identidad
      const identity = await this.identityWallet.createIdentity();
      
      return {
        did: identity.did,
        privateKey: identity.privateKey
      };
    } catch (error) {
      console.error('Error creating identity:', error);
      throw error;
    }
  }

  // Emitir credencial verificable
  async issueCredential(
    issuerDID: string,
    subjectDID: string,
    credentialType: string,
    data: any
  ) {
    try {
      if (!this.credentialWallet) {
        throw new Error('Credential wallet not initialized');
      }

      const credentialRequest: CredentialRequest = {
        credentialSchema: `https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/${credentialType}-v2.json-ld`,
        type: credentialType,
        credentialSubject: {
          id: subjectDID,
          ...data
        },
        expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };

      const credential = await this.credentialWallet.issueCredential(
        issuerDID,
        credentialRequest
      );

      return credential;
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  // Generar prueba de conocimiento cero
  async generateProof(
    credentialId: string,
    proofQuery: ProofQuery
  ) {
    try {
      if (!this.proofService) {
        throw new Error('Proof service not initialized');
      }

      const proofRequest: ZeroKnowledgeProofRequest = {
        id: credentialId,
        circuitId: CircuitId.AtomicQuerySigV2,
        optional: false,
        query: proofQuery
      };

      const proof = await this.proofService.generateProof(
        proofRequest,
        this.identityWallet!
      );

      return proof;
    } catch (error) {
      console.error('Error generating proof:', error);
      throw error;
    }
  }

  // Verificar credencial
  async verifyCredential(credential: any) {
    try {
      if (!this.credentialWallet) {
        throw new Error('Credential wallet not initialized');
      }

      const isValid = await this.credentialWallet.verifyCredential(credential);
      return isValid;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  }

  // Verificar prueba
  async verifyProof(proof: any) {
    try {
      if (!this.proofService) {
        throw new Error('Proof service not initialized');
      }

      const isValid = await this.proofService.verifyProof(proof);
      return isValid;
    } catch (error) {
      console.error('Error verifying proof:', error);
      return false;
    }
  }
} 