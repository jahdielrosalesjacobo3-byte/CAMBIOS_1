import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TradingScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <Text style={styles.title}>Trading (0x)</Text>
        <Text style={styles.subtitle}>Swaps optimizados, órdenes limit/market</Text>
        <View style={styles.card}><Text style={styles.cardTitle}>Mercado</Text><Text style={styles.cardText}>Próximamente: Gráfico de precios y orderbook.</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Órdenes</Text><Text style={styles.cardText}>Próximamente: Crear orden limit/market.</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Portafolio</Text><Text style={styles.cardText}>Próximamente: Posiciones y PnL.</Text></View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20, minHeight: 600 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 20 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  cardText: { color: '#555' },
}); 