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
import walletService from '../services/walletService';
import { TransferFormData } from '../types';

const { width, height } = Dimensions.get('window');

export default function TransferScreen({ navigation }: any) {
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
          [{ text: 'OK', onPress: () => navigation.goBack() }]
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
              style={styles.input}
              value={formData.amount.toString()}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                amount: parseFloat(text) || 0 
              }))}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección Destino</Text>
            <View style={styles.addressInputContainer}>
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={formData.toAddress}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  toAddress: text 
                }))}
                placeholder="0x..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.scanButton} onPress={scanQR}>
                <Text style={styles.scanButtonText}>📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transfer Button */}
          <TouchableOpacity
            style={[styles.transferButton, isTransferring && styles.transferButtonDisabled]}
            onPress={handleTransfer}
            disabled={isTransferring}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.transferButtonGradient}
            >
              {isTransferring ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.transferButtonText}>
                  Enviar por {formData.method === 'ultrasonic' ? 'Ultrasonido' : 'QR'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              {formData.method === 'ultrasonic' ? 'Instrucciones Ultrasonido:' : 'Instrucciones QR:'}
            </Text>
            <Text style={styles.instructionsText}>
              {formData.method === 'ultrasonic' 
                ? '1. Acerca los teléfonos\n2. Presiona enviar\n3. Los datos se transmitirán por ondas de sonido\n\n💡 Demo: Simula la transmisión de frecuencias'
                : '1. Genera un QR con los datos\n2. El destinatario escanea el código\n3. La transferencia se procesa offline\n\n💡 Demo: Simula el escaneo de QR'
              }
            </Text>
          </View>

          {/* Demo Info */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>🎯 Demo para Hackatón</Text>
            <Text style={styles.demoText}>
              Esta es una simulación para demostrar el concepto. En producción:
            </Text>
            <Text style={styles.demoText}>
              • Ultrasonido: Frecuencias reales 18-20kHz{'\n'}
              • QR: Escaneo real con cámara{'\n'}
              • Blockchain: Integración con Monad
            </Text>
          </View>
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
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  methodContainer: {
    marginBottom: 25,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  methodButtonActive: {
    backgroundColor: '#667eea',
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  methodText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInput: {
    flex: 1,
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
  transferButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  transferButtonDisabled: {
    opacity: 0.6,
  },
  transferButtonGradient: {
    padding: 20,
    alignItems: 'center',
  },
  transferButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionsContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  demoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 16,
    marginBottom: 5,
  },
});
