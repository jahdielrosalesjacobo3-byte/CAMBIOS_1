import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VerifiableCredential } from '../../types/did';

interface VCCardProps {
  credential: VerifiableCredential;
  onPress?: () => void;
  showDetails?: boolean;
}

export default function VCCard({ credential, onPress, showDetails = false }: VCCardProps) {
  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'PERSONHOOD':
        return '👤';
      case 'KYC':
        return '📋';
      case 'CREDIT_SCORE':
        return '💳';
      case 'TRADING_LICENSE':
        return '📈';
      default:
        return '✅';
    }
  };

  const getCredentialColor = (type: string): [string, string] => {
    switch (type) {
      case 'PERSONHOOD':
        return ['#4CAF50', '#45a049'];
      case 'KYC':
        return ['#2196F3', '#1976D2'];
      case 'CREDIT_SCORE':
        return ['#FF9800', '#F57C00'];
      case 'TRADING_LICENSE':
        return ['#9C27B0', '#7B1FA2'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = () => {
    if (!credential.expirationDate) return false;
    return new Date(credential.expirationDate) < new Date();
  };

  const formatIssuer = (issuer: string) => {
    if (issuer.length > 25) {
      return `${issuer.substring(0, 12)}...${issuer.substring(issuer.length - 12)}`;
    }
    return issuer;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <LinearGradient 
        colors={getCredentialColor(credential.type[1] || 'DEFAULT')} 
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{getCredentialIcon(credential.type[1] || 'DEFAULT')}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{credential.type[1] || 'Credencial'}</Text>
            <Text style={styles.subtitle}>Verifiable Credential</Text>
          </View>
          <View style={[styles.statusBadge, isExpired() && styles.expiredBadge]}>
            <Text style={styles.statusText}>
              {isExpired() ? 'Expirada' : 'Válida'}
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Emisor:</Text>
            <Text style={styles.value}>{formatIssuer(credential.issuer)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Emisión:</Text>
            <Text style={styles.value}>{formatDate(credential.issuanceDate)}</Text>
          </View>
          
          {credential.expirationDate && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Expira:</Text>
              <Text style={[styles.value, isExpired() && styles.expiredText]}>
                {formatDate(credential.expirationDate)}
              </Text>
            </View>
          )}
        </View>
        
        {showDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Datos de la Credencial</Text>
            {Object.entries(credential.credentialSubject).map(([key, value]) => (
              key !== 'id' && (
                <View key={key} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{key}:</Text>
                  <Text style={styles.detailValue}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Text>
                </View>
              )
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.idText}>ID: {credential.id.substring(0, 20)}...</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 8,
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
    fontSize: 28,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  value: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  expiredText: {
    color: '#FFCDD2',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 11,
    color: 'white',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
  },
  idText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'monospace',
  },
}); 