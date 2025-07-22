import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to ClerkBit</Text>
        <Text style={styles.subtitle}>
          Your AI assistant for Bitcoin-powered businesses
        </Text>

        <Pressable style={styles.connectButton} onPress={() => router.replace('(tabs)/wallet')}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.sendButton]}
            onPress={() => router.push('(tabs)/payment/send')}
          >
            <Text style={styles.buttonText}>Send</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.receiveButton]}
            onPress={() => router.push('(tabs)/payment/receive')}
          >
            <Text style={styles.buttonText}>Receive</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginBottom: 24,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#ef4444', // red
  },
  receiveButton: {
    backgroundColor: '#10b981', // green
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
