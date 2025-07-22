// components/ConnectedWalletView.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const transactions = [
  { id: '1', label: 'Payment from Alice', amount: '+0.002 BTC', type: 'in' },
  { id: '2', label: 'Sent to Node', amount: '-0.001 BTC', type: 'out' },
];

export default function ConnectedWalletView() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.balanceTitle}>Your Balance</Text>
      <Text style={styles.balanceAmount}>0.0452 BTC</Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton}><Text style={styles.actionText}>Send</Text></Pressable>
        <Pressable style={styles.actionButton}><Text style={styles.actionText}>Receive</Text></Pressable>
        <Pressable style={styles.actionButton}><Text style={styles.actionText}>Scan QR</Text></Pressable>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.transactionLabel}>{item.label}</Text>
            <Text style={[styles.amount, item.type === 'in' ? styles.in : styles.out]}>{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },
  balanceTitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  transaction: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionLabel: {
    color: '#475569',
  },
  amount: {
    fontWeight: '600',
  },
  in: {
    color: '#10b981',
  },
  out: {
    color: '#ef4444',
  },
});
