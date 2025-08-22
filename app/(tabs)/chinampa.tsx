import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChinampaScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <Text style={styles.title}>Chinampa & Trust Score</Text>
        <Text style={styles.subtitle}>Gamificación: frijolito en crecimiento</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progreso</Text>
          <Text style={styles.cardText}>Próximamente: Visualización de chinampa y crecimiento de frijoles según historial.</Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20, minHeight: 600 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 20 },
  subtitle: { color: 'rgba(255,255,255,0.85)', marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  cardText: { color: '#555' },
}); 