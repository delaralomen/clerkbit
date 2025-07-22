import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Dashboard from '@/components/wallet/Dashboard';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    // Integrate Lightning wallet connection logic

    //
    setConnected(true);
  };

  if (connected) {
    return <Dashboard />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#c7d2fe', dark: '#312e81' }}
      headerImage={null}
    >
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ThemedText type="title">Your Wallet 🪙</ThemedText>
        <ThemedText type="subtitle">Connect to view and manage your funds</ThemedText>

        <Pressable style={styles.connectButton} onPress={handleConnect}>
          <Text style={styles.connectButtonText}>Connect Wallet</Text>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  connectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#ef4444',
  },
  receiveButton: {
    backgroundColor: '#10b981',
  },
  historyButton: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
