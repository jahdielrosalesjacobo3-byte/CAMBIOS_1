import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreditScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <Text style={styles.title}>Crédito (Monad)</Text>
        <Text style={styles.subtitle}>Colateral, préstamos y liquidaciones</Text>
        <View style={styles.row}>
          <View style={styles.metric}><Text style={styles.metricLabel}>Colateral</Text><Text style={styles.metricValue}>$0.00</Text></View>
          <View style={styles.metric}><Text style={styles.metricLabel}>Préstamo</Text><Text style={styles.metricValue}>$0.00</Text></View>
          <View style={styles.metric}><Text style={styles.metricLabel}>Health</Text><Text style={styles.metricValue}>—</Text></View>
        </View>
        <View style={styles.card}><Text style={styles.cardTitle}>Acciones</Text><Text style={styles.cardText}>Próximamente: Depositar colateral, pedir préstamo, pagar.</Text></View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20, minHeight: 600 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 20 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metric: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 12 },
  metricLabel: { color: '#666' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  cardText: { color: '#555' },
}); 