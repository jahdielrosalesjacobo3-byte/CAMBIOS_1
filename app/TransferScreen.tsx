import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import walletService from '../services/walletService';
import { TransferFormData } from '../types';

const { width, height } = Dimensions.get('window');

export default function TransferScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<TransferFormData>({
    toAddress: '',
    amount: 0,
    method: 'ultrasonic',
  });
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!formData.toAddress || formData.amount <= 0) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsTransferring(true);
    try {
      const result = await walletService.transferOffline(
        formData.toAddress,
        formData.amount,
        formData.method
      );

      if (result.success) {
        Alert.alert(
          '¡Éxito!',
          `Transferencia enviada por ${formData.method}\nID: ${result.transactionId}`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', result.error || 'Error en la transferencia');
      }
    } catch (error) {
      Alert.alert('Error', 'Error inesperado en la transferencia');
    } finally {
      setIsTransferring(false);
    }
  };

  const scanQR = () => {
    // Simular escaneo de QR
    Alert.alert(
      'Simulación QR',
      'En una implementación real, aquí se abriría la cámara para escanear un QR',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Simular QR', 
          onPress: () => {
            setFormData(prev => ({
              ...prev,
              toAddress: '0x' + Math.random().toString(16).substr(2, 40),
            }));
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enviar Dinero</Text>
        </View>

        {/* Transfer Form */}
        <View style={styles.formContainer}>
          {/* Method Selection */}
          <View style={styles.methodContainer}>
            <Text style={styles.sectionTitle}>Método de Transferencia</Text>
            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  formData.method === 'ultrasonic' && styles.methodButtonActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, method: 'ultrasonic' }))}
              >
                <Text style={styles.methodIcon}>🔊</Text>
                <Text style={[
                  styles.methodText,
                  formData.method === 'ultrasonic' && styles.methodTextActive
                ]}>
                  Ultrasonido
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  formData.method === 'qr' && styles.methodButtonActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, method: 'qr' }))}
              >
                <Text style={styles.methodIcon}>📱</Text>
                <Text style={[
                  styles.methodText,
                  formData.method === 'qr' && styles.methodTextActive
                ]}>
                  QR Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cantidad ($)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0"
              keyboardType="numeric"
              value={formData.amount.toString()}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                amount: parseFloat(text) || 0 
              }))}
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección Destino</Text>
            <View style={styles.addressInputContainer}>
              <TextInput
                style={styles.addressInput}
                placeholder="0x..."
                value={formData.toAddress}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  toAddress: text 
                }))}
              />
              <TouchableOpacity style={styles.scanButton} onPress={scanQR}>
                <Text style={styles.scanButtonText}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleTransfer}
            disabled={isTransferring}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.sendButtonGradient}
            >
              {isTransferring ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.sendButtonText}>
                  Enviar por {formData.method === 'ultrasonic' ? 'Ultrasonido' : 'QR Code'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instrucciones Ultrasonido:</Text>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>Acerca los teléfonos</Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>Presiona enviar</Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>Los datos se transmitirán por ondas de sonido</Text>
          </View>
          <View style={styles.demoNote}>
            <Text style={styles.demoIcon}>💡</Text>
            <Text style={styles.demoText}>Demo: Simula la transmisión de frecuencias</Text>
          </View>
        </View>

        {/* Hackathon Demo Section */}
        <View style={styles.demoContainer}>
          <View style={styles.demoHeader}>
            <Text style={styles.demoTitle}>Demo para Hackatón</Text>
            <Text style={styles.demoIcon}>🎯</Text>
          </View>
          <Text style={styles.demoDescription}>
            Esta es una simulación para demostrar el concepto.
          </Text>
          <Text style={styles.productionTitle}>En producción:</Text>
          <Text style={styles.productionItem}>• Ultrasonido: Frecuencias reales 18-20kHz</Text>
          <Text style={styles.productionItem}>• QR: Escaneo real con cámara</Text>
          <Text style={styles.productionItem}>• Blockchain: Integración con Monad</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  methodContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  methodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  methodTextActive: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
  },
  scanButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 18,
    color: 'white',
  },
  sendButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  sendButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginRight: 10,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  demoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
  },
  demoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#856404',
    flex: 1,
  },
  demoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  demoDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  productionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  productionItem: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
});
