import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DIDDocument } from '../../types/did';

interface DIDCardProps {
  did: string;
  didDocument?: DIDDocument;
  onPress?: () => void;
  showDetails?: boolean;
}

export default function DIDCard({ did, didDocument, onPress, showDetails = false }: DIDCardProps) {
  const formatDID = (did: string) => {
    if (did.length > 30) {
      return `${did.substring(0, 15)}...${did.substring(did.length - 15)}`;
    }
    return did;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>Identidad Digital</Text>
        </View>
        
        <View style={styles.didContainer}>
          <Text style={styles.didLabel}>DID</Text>
          <Text style={styles.didText}>{formatDID(did)}</Text>
        </View>
        
        {showDetails && didDocument && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Controlador:</Text>
              <Text style={styles.detailValue}>{formatDID(didDocument.controller)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Métodos de Verificación:</Text>
              <Text style={styles.detailValue}>{didDocument.verificationMethod.length}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Servicios:</Text>
              <Text style={styles.detailValue}>{didDocument.service.length}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.statusText}>Activo</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  didContainer: {
    marginBottom: 15,
  },
  didLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  didText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'monospace',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
}); 