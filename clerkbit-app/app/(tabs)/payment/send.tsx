import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function SendScreen() {
  const insets = useSafeAreaInsets();
  const [invoice, setInvoice] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSend = () => {
    // if (!invoice.trim()) return;

    // Simulate sending logic...
    setModalVisible(true);
    setInvoice('');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#c7d2fe', dark: '#ef4444' }}
      headerImage={null}
    >
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ThemedText type="title">Send Bitcoin ⚡</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Paste Lightning invoice (BOLT11)"
          placeholderTextColor="#94a3b8"
          value={invoice}
          onChangeText={setInvoice}
        />

        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={() => setInvoice('')}>
            <Text style={styles.secondaryButtonText}>Paste</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Scan QR 📷</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSend}>
          <Text style={styles.primaryButtonText}>Send</Text>
        </Pressable>
      </ThemedView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>✅ Payment Sent!</Text>
          <Text style={styles.modalMessage}>Your Bitcoin Lightning payment was successful.</Text>
          <Pressable style={styles.dismissButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.dismissButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#0f172a',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#16a34a',
  },
  modalMessage: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 16,
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dismissButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});