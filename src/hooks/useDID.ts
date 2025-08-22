import { useState, useEffect } from 'react';
import { DIDService } from '../services/identity/did-service';
import { DIDRegistration, DIDDocument } from '../types/did';

export function useDID() {
  const [did, setDid] = useState<string | null>(null);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const didService = new DIDService();
  
  // Generar nuevo DID
  const generateDID = async (): Promise<DIDRegistration | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const registration = await didService.generateDID();
      setDid(registration.did);
      setDidDocument(registration.didDocument);
      return registration;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating DID');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar DID
  const verifyDID = async (didToVerify: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const isValid = await didService.verifyDID(didToVerify);
      if (isValid) {
        setDid(didToVerify);
        const document = await didService.resolveDID(didToVerify);
        setDidDocument(document);
      }
      return isValid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying DID');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Recuperar DID
  const recoverDID = async (recoveryKey: string): Promise<DIDRegistration | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const registration = await didService.recoverDID(recoveryKey);
      if (registration) {
        setDid(registration.did);
        setDidDocument(registration.didDocument);
      }
      return registration;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error recovering DID');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Firmar datos con DID
  const signWithDID = async (data: string, privateKey: string, password: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const signature = await didService.signWithDID(data, privateKey, password);
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error signing with DID');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar firma con DID
  const verifyWithDID = async (data: string, signature: string, didToVerify: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const isValid = await didService.verifyWithDID(data, signature, didToVerify);
      return isValid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying signature');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Limpiar estado
  const clearDID = () => {
    setDid(null);
    setDidDocument(null);
    setError(null);
  };
  
  return {
    did,
    didDocument,
    loading,
    error,
    generateDID,
    verifyDID,
    recoverDID,
    signWithDID,
    verifyWithDID,
    clearDID,
  };
} 