import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
// import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function ReceiveScreen() {
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const invoice =
    'lnbc1pj8sk9tpp5...s9dlw0x07wqg9xeyq96l73umz4n0vf6j3';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(invoice);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#dcfce7', dark: '#064e3b' }}
      headerImage={null}
    >
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ThemedText type="title">Receive Bitcoin ⚡</ThemedText>
        <ThemedText style={styles.subtitle}>
          Let your customer scan or copy your Lightning invoice.
        </ThemedText>

        {/* QR Placeholder */}
        <View style={styles.qrWrapper}>
          <Image
            source={require('@/assets/images/QR_Code_Example.svg.png')} // use a real QR later
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>

        {/* Invoice Text (truncated for display) */}
        <Text style={styles.invoiceText}>{invoice}</Text>

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={handleCopy}>
            <Text style={styles.secondaryButtonText}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share 🔗</Text>
          </Pressable>
        </View>
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
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
  },
  qrWrapper: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  invoiceText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
});
