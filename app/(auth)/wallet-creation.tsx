import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function WalletCreationScreen() {
  const router = useRouter();
  const [walletType, setWalletType] = useState<'non-custodial' | 'semi-custodial' | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  
  const handleCreateWallet = async (type: 'non-custodial' | 'semi-custodial') => {
    setWalletType(type);
    setLoading(true);
    
    try {
      // Simular creación de wallet
      await new Promise(resolve => setTimeout(resolve, 1500));
      setWalletCreated(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la wallet. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleComplete = () => {
    router.push('/(main)');
  };
  
  const renderWalletOptions = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Crear tu Wallet</Text>
      <Text style={styles.stepDescription}>
        Elige el tipo de wallet que mejor se adapte a tus necesidades de seguridad.
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, walletType === 'non-custodial' && styles.optionSelected]}
          onPress={() => handleCreateWallet('non-custodial')}
          disabled={loading}
        >
          <Text style={styles.optionIcon}>🔐</Text>
          <Text style={styles.optionTitle}>Non-Custodial</Text>
          <Text style={styles.optionDesc}>
            Control total de tus claves privadas
          </Text>
          <Text style={styles.optionFeatures}>
            ✅ Máxima seguridad{'\n'}
            ✅ Control total{'\n'}
            ✅ Sin intermediarios{'\n'}
            ⚠️ Responsabilidad total
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, walletType === 'semi-custodial' && styles.optionSelected]}
          onPress={() => handleCreateWallet('semi-custodial')}
          disabled={loading}
        >
          <Text style={styles.optionIcon}>🛡️</Text>
          <Text style={styles.optionTitle}>Semi-Custodial</Text>
          <Text style={styles.optionDesc}>
            Seguridad mejorada con recuperación
          </Text>
          <Text style={styles.optionFeatures}>
            ✅ Seguridad mejorada{'\n'}
            ✅ Recuperación fácil{'\n'}
            ✅ Soporte técnico{'\n'}
            ⚠️ Menos control directo
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Creando wallet...</Text>
        </View>
      )}
    </View>
  );
  
  const renderWalletCreated = () => (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>¡Wallet Creada!</Text>
      <Text style={styles.stepDescription}>
        Tu wallet ha sido creada exitosamente y vinculada a tu DID.
      </Text>
      
      <View style={styles.successCard}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>Wallet {walletType === 'non-custodial' ? 'Non-Custodial' : 'Semi-Custodial'}</Text>
        <Text style={styles.successDesc}>
          Tu wallet está lista para usar con todos los servicios DeFi.
        </Text>
      </View>
      
      <View style={styles.walletInfoCard}>
        <Text style={styles.walletInfoTitle}>Información de la Wallet</Text>
        <Text style={styles.walletInfoText}>Tipo: {walletType === 'non-custodial' ? 'Non-Custodial' : 'Semi-Custodial'}</Text>
        <Text style={styles.walletInfoText}>DID Vinculado: did:wallof:user:demo123</Text>
        <Text style={styles.walletInfoText}>Estado: Activa</Text>
        <Text style={styles.walletInfoText}>Fecha: {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>Funcionalidades Disponibles</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💳</Text>
          <Text style={styles.featureText}>Gestión de múltiples criptomonedas</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔄</Text>
          <Text style={styles.featureText}>Swaps y trading integrado</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🏦</Text>
          <Text style={styles.featureText}>Acceso a servicios de crédito</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🌱</Text>
          <Text style={styles.featureText}>Sistema gamificado Chinampa</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Ir al Dashboard</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        {!walletCreated ? renderWalletOptions() : renderWalletCreated()}
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
  walletInfoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  walletInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  walletInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
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