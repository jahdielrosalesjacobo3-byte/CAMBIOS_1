import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DIDService } from '../../src/services/identity/did-service';
import { DIDRegistration } from '../../src/types/did';

export default function DIDSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'generation' | 'verification' | 'backup'>('welcome');
  const [didRegistration, setDidRegistration] = useState<DIDRegistration | null>(null);
  const [loading, setLoading] = useState(false);
  
  const didService = new DIDService();
  
  const handleGenerateDID = async () => {
    setLoading(true);
    try {
      const registration = await didService.generateDID();
      setDidRegistration(registration);
      setStep('verification');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el DID. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinue = () => {
    setStep('backup');
  };
  
  const handleComplete = () => {
    router.push('/(auth)/identity-verification');
  };
  
  const renderWelcomeStep = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Crear tu Identidad Digital</Text>
      <Text style={styles.stepDescription}>
        Generaremos tu DID (Decentralized Identifier) único que te identificará en toda la red DeFi.
      </Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>¿Qué es un DID?</Text>
        <Text style={styles.infoText}>
          Un DID es tu identidad digital única en la blockchain. Es como tu pasaporte digital que te permite:
        </Text>
        <Text style={styles.infoBullet}>• Acceder a servicios DeFi sin repetir KYC</Text>
        <Text style={styles.infoBullet}>• Mantener control total de tus datos</Text>
        <Text style={styles.infoBullet}>• Ser interoperable entre plataformas</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGenerateDID}
        disabled={loading}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          style={styles.buttonGradient}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Generar DID</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  const renderVerificationStep = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Tu DID ha sido creado</Text>
      <Text style={styles.stepDescription}>
        Tu identidad digital única está lista. Guárdala de forma segura.
      </Text>
      
      <View style={styles.didCard}>
        <Text style={styles.didLabel}>Tu Identificador Único</Text>
        <Text style={styles.didText}>{didRegistration?.did}</Text>
        <Text style={styles.didSubtext}>DID: Decentralized Identifier</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Información del Registro</Text>
        <Text style={styles.infoText}>Transacción: {didRegistration?.blockchainTx}</Text>
        <Text style={styles.infoText}>Fecha: {new Date(didRegistration?.timestamp || 0).toLocaleString()}</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  const renderBackupStep = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Configurar Backup</Text>
      <Text style={styles.stepDescription}>
        Es crucial que guardes tu clave de recuperación de forma segura.
      </Text>
      
      <View style={styles.backupCard}>
        <Text style={styles.backupTitle}>Clave de Recuperación</Text>
        <Text style={styles.backupKey}>{didRegistration?.recoveryKey}</Text>
        <Text style={styles.backupWarning}>
          ⚠️ Guarda esta clave en un lugar seguro. Es la única forma de recuperar tu identidad si pierdes acceso.
        </Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Recomendaciones de Seguridad</Text>
        <Text style={styles.infoBullet}>• Guárdala en papel en un lugar seguro</Text>
        <Text style={styles.infoBullet}>• No la compartas con nadie</Text>
        <Text style={styles.infoBullet}>• Considera usar una bóveda digital</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Continuar a Verificación</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        {step === 'welcome' && renderWelcomeStep()}
        {step === 'verification' && renderVerificationStep()}
        {step === 'backup' && renderBackupStep()}
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
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  infoBullet: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
    paddingLeft: 10,
  },
  didCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  didLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  didText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  didSubtext: {
    fontSize: 12,
    color: '#999',
  },
  backupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  backupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  backupKey: {
    fontSize: 14,
    color: '#FFD700',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  backupWarning: {
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 16,
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