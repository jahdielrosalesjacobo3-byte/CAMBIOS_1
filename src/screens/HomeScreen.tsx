import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import walletService, { WalletBalance } from '../services/walletService';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadBalance();
    startListening();
    
    // Simular cambio de estado de conexión
    const interval = setInterval(() => {
      const online = Math.random() > 0.5; // Simular conexión intermitente
      setIsOnline(online);
      walletService.setOnlineStatus(online);
    }, 10000);

    return () => {
      clearInterval(interval);
      stopListening();
    };
  }, []);

  const loadBalance = () => {
    const walletBalance = walletService.getBalance();
    setBalance(walletBalance);
  };

  const startListening = async () => {
    try {
      await walletService.startListening();
      setIsListening(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar la escucha de transferencias');
    }
  };

  const stopListening = async () => {
    await walletService.stopListening();
    setIsListening(false);
  };

  const handleTransfer = () => {
    navigation.navigate('Transfer');
  };

  const handleReceive = () => {
    navigation.navigate('Receive');
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>WALLof</Text>
          <Text style={styles.subtitle}>Wallet Offline</Text>
          
          {/* Status Indicators */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#FF5722' }]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Conectado' : 'Modo Offline'}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: isListening ? '#4CAF50' : '#FF5722' }]} />
            <Text style={styles.statusText}>
              {isListening ? 'Escuchando' : 'Inactivo'}
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceAmount}>
            ${balance?.balance.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.addressText}>
            {balance?.address.slice(0, 10)}...{balance?.address.slice(-8)}
          </Text>
          
          {balance?.pendingTransactions.length > 0 && (
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingText}>
                {balance.pendingTransactions.length} transacción(es) pendiente(s)
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleTransfer}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Enviar</Text>
              <Text style={styles.buttonSubtext}>Transferir fondos</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Recibir</Text>
              <Text style={styles.buttonSubtext}>Esperar transferencia</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Métodos de Transferencia</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔊</Text>
              <Text style={styles.featureTitle}>Ultrasonido</Text>
              <Text style={styles.featureDesc}>Transferencia por ondas de sonido</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureTitle}>QR Code</Text>
              <Text style={styles.featureDesc}>Escanea y transfiere</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⛓️</Text>
              <Text style={styles.featureTitle}>Blockchain</Text>
              <Text style={styles.featureDesc}>Sincronización automática</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Historial</Text>
              <Text style={styles.featureDesc}>Ver transacciones</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={handleHistory}>
            <Text style={styles.quickButtonText}>📋 Historial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickButton}>
            <Text style={styles.quickButtonText}>⚙️ Configuración</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradient: {
    minHeight: height,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    marginRight: 15,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  pendingContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
  },
  pendingText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
