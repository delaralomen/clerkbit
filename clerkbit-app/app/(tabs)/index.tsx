import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ChatFeed } from '@/components/ChatFeed';
import { QRCodeDisplay } from '@/components/QRCodeDisplay'
import { createInvoice } from '@/services/LightningService';
import { BitcoinIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import PaymentPopup from '@/components/PaymentPopup';

import { useState } from 'react';
import { View, Button, Text, Pressable } from 'react-native';


export default function HomeScreen() {
  const [invoiceResponse, setInvoiceResponse] = useState<string | null>(null);
  const [isPaymentPopupVisible, setIsPaymentPopupVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const handlePayPressed = async () => {
    console.log("pay pressed")
    console.log(totalPrice)
    // API CALL HERE
    try {
      const response = await fetch("http://localhost:5050/order-total", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order total:", data);

      console.log(data.order_total)
      console.log(typeof(data.order_total))
      setTotalPrice(parseFloat(data.order_total))
      setIsPaymentPopupVisible(true);
    } catch (error) {
      console.error("Failed to fetch order total:", error);
      return null;
    }

  }

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ChatFeed />
      <Pressable
        style={[styles.payButton, { backgroundColor: '#7C3AED' }]}
        onPress={handlePayPressed}
      >
        <BitcoinIcon style={{ height: 25, width: 25, color: '#FFA500', marginRight: 0 }} />
        <Text style={styles.payButtonText}>Pay</Text>
      </Pressable>

      {/* Payment Popup */}
      <PaymentPopup
        visible={isPaymentPopupVisible}
        onClose={() => setIsPaymentPopupVisible(false)}
        total={totalPrice}
      />
    </SafeAreaView>

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
  payButton: {
    flexDirection: 'row',      // inline layout
    alignItems: 'center',      // vertical centering
    justifyContent: 'center',  // horizontal centering
    gap: 6,
    paddingVertical: 8,
    paddingLeft: 2,
    paddingRight: 7,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
