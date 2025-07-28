import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatFeed } from '@/components/ChatFeed';
import { QRCodeDisplay } from '@/components/QRCodeDisplay'
import { createInvoice } from '@/services/LightningService';

import React from 'react';
import { useState } from 'react';
import { View, Button, Text } from 'react-native';


export default function HomeScreen() {
  const [invoiceResponse, setInvoiceResponse] = useState<string | null>(null);

  const handlePress = async () => {
    try {
      const invoice = await createInvoice(10, "Button Test Invoice");
      console.log("Invoice created:", invoice);
      setInvoiceResponse(invoice.payment_request);
      console.log(123)
      console.log(invoice.payment_request)
      console.log(invoiceResponse)
    } catch (err) {
      console.error("Failed to create invoice:", err);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ChatFeed />
      <Button title="Create Invoice" onPress={handlePress} />
      {invoiceResponse ? (   // ✅ Only show if paymentString has a value
        <View style={styles.qrContainer}>
          <Text style={styles.title}>Scan to Pay</Text>
          <QRCodeDisplay value={invoiceResponse} size={500} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  testBox: {
    width: "100%",        // take full width
    height: 200,          // fixed height
    backgroundColor: "#eee", // light gray so it's visible
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  testText: {
    color: "#333",
    fontSize: 16,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
