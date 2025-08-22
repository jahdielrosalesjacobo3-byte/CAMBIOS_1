import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { VCService } from '../../src/services/identity/vc-service';
import { VerifiableCredential } from '../../src/types/did';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'polygon' | 'worldcoin' | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [credential, setCredential] = useState<VerifiableCredential | null>(null);
  
  const vcService = new VCService();
  
  const handleVerification = async (method: 'polygon' | 'worldcoin') => {
    setSelectedMethod(method);
    setLoading(true);
    
    try {
      // Simular proceso de verificación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Emitir credencial verificable
      const vc = await vcService.issueVC({
        type: 'PERSONHOOD',
        subjectDID: 'did:wallof:user:demo123',
        issuerDID: method === 'polygon' ? 'did:wallof:issuer:polygon-id' : 'did:wallof:issuer:worldcoin',
        data: {
          personhoodVerified: true,
          verificationMethod: method === 'polygon' ? 'Polygon ID' : 'Worldcoin',
          verificationDate: new Date().toISOString(),
          confidence: 0.99
        },
        expirationDays: 365
      });
      
      setCredential(vc);
      setVerificationComplete(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la verificación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleComplete = () => {
    router.push('/(auth)/wallet-creation');
  };
  
  const renderVerificationOptions = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Verificar tu Identidad</Text>
      <Text style={styles.stepDescription}>
        Elige un método para verificar que eres una persona real y única.
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, selectedMethod === 'polygon' && styles.optionSelected]}
          onPress={() => handleVerification('polygon')}
          disabled={loading}
        >
          <Text style={styles.optionIcon}>🔷</Text>
          <Text style={styles.optionTitle}>Polygon ID</Text>
          <Text style={styles.optionDesc}>
            Verificación con credenciales verificables en Polygon
          </Text>
          <Text style={styles.optionFeatures}>
            • Privacidad con ZK-Proofs{'\n'}
            • Sin revelar datos personales{'\n'}
            • Verificación instantánea
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, selectedMethod === 'worldcoin' && styles.optionSelected]}
          onPress={() => handleVerification('worldcoin')}
          disabled={loading}
        >
          <Text style={styles.optionIcon}>🌍</Text>
          <Text style={styles.optionTitle}>Worldcoin</Text>
          <Text style={styles.optionDesc}>
            Verificación biométrica con Proof of Personhood
          </Text>
          <Text style={styles.optionFeatures}>
            • Escaneo de iris{'\n'}
            • Verificación global{'\n'}
            • Una persona, una identidad
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Verificando identidad...</Text>
        </View>
      )}
    </View>
  );
  
  const renderVerificationComplete = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>¡Verificación Completada!</Text>
      <Text style={styles.stepDescription}>
        Tu identidad ha sido verificada exitosamente.
      </Text>
      
      <View style={styles.successCard}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Credencial Emitida</Text>
        <Text style={styles.successDesc}>
          Tu credencial verificable ha sido registrada en la blockchain.
        </Text>
      </View>
      
      <View style={styles.credentialCard}>
        <Text style={styles.credentialTitle}>Detalles de la Credencial</Text>
        <Text style={styles.credentialText}>ID: {credential?.id}</Text>
        <Text style={styles.credentialText}>Emisor: {credential?.issuer}</Text>
        <Text style={styles.credentialText}>Tipo: {credential?.type[1]}</Text>
        <Text style={styles.credentialText}>
          Emisión: {new Date(credential?.issuanceDate || '').toLocaleDateString()}
        </Text>
        {credential?.expirationDate && (
          <Text style={styles.credentialText}>
            Expira: {new Date(credential.expirationDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Continuar a Wallet</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        {!verificationComplete ? renderVerificationOptions() : renderVerificationComplete()}
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    minHeight: 800,
  },
  step: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  optionIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  optionDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  optionFeatures: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  successCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  successDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  credentialCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  credentialText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
}); 