import React from 'react';
import { StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function SendScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#c7d2fe', dark: '#312e81' }}
      headerImage={null}
    >
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ThemedText type="title">Send Bitcoin ⚡</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Paste Lightning invoice (BOLT11)"
          placeholderTextColor="#94a3b8"
        />

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Paste</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Scan QR 📷</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Send</Text>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
  },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#93c5fd',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1e3a8a',
    fontWeight: '600',
    fontSize: 16,
  },
});
