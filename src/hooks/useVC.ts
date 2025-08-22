import { useState } from 'react';
import { VCService } from '../services/identity/vc-service';
import { VerifiableCredential, VCRequest } from '../types/did';

export function useVC() {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const vcService = new VCService();
  
  // Emitir credencial verificable
  const issueVC = async (request: VCRequest): Promise<VerifiableCredential | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const credential = await vcService.issueVC(request);
      setCredentials(prev => [...prev, credential]);
      return credential;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error issuing VC');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar credencial
  const verifyVC = async (vc: VerifiableCredential): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const isValid = await vcService.verifyVC(vc);
      return isValid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying VC');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Generar prueba de conocimiento cero
  const generateZKProof = async (vc: VerifiableCredential, attributes: string[]): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const proof = await vcService.generateZeroKnowledgeProof(vc, attributes);
      return proof;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating ZK proof');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Revocar credencial
  const revokeVC = async (vcId: string, issuerDID: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const revoked = await vcService.revokeVC(vcId, issuerDID);
      if (revoked) {
        setCredentials(prev => prev.filter(vc => vc.id !== vcId));
      }
      return revoked;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error revoking VC');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar si credencial está revocada
  const isRevoked = async (vcId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const revoked = await vcService.isRevoked(vcId);
      return revoked;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error checking revocation');
      return true; // En caso de error, asumir que está revocada
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener credenciales por tipo
  const getCredentialsByType = (type: string): VerifiableCredential[] => {
    return credentials.filter(vc => vc.type.includes(type));
  };
  
  // Obtener credenciales válidas (no expiradas)
  const getValidCredentials = (): VerifiableCredential[] => {
    const now = new Date();
    return credentials.filter(vc => {
      if (!vc.expirationDate) return true;
      return new Date(vc.expirationDate) > now;
    });
  };
  
  // Agregar credencial
  const addCredential = (credential: VerifiableCredential) => {
    setCredentials(prev => [...prev, credential]);
  };
  
  // Remover credencial
  const removeCredential = (vcId: string) => {
    setCredentials(prev => prev.filter(vc => vc.id !== vcId));
  };
  
  // Limpiar estado
  const clearCredentials = () => {
    setCredentials([]);
    setError(null);
  };
  
  return {
    credentials,
    loading,
    error,
    issueVC,
    verifyVC,
    generateZKProof,
    revokeVC,
    isRevoked,
    getCredentialsByType,
    getValidCredentials,
    addCredential,
    removeCredential,
    clearCredentials,
  };
} 