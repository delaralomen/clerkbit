import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import QRCode from 'react-native-qrcode-svg';



interface WalletCard {
  id: string;
  type: 'credit' | 'ticket' | 'student';
  title: string;
  subtitle?: string;
  qrCodeData?: string; // Optional QR code data for student cards
}

const DUMMY_CARDS: WalletCard[] = [
  { id: '1', type: 'credit', title: 'Visa •••• 4242', subtitle: 'Expires 04/26' },
  { id: '2', type: 'ticket', title: 'Concert - Imagine Dragons' },  {
    id: '3',
    type: 'student',
    title: 'USI Student ID',
    subtitle: 'Alan Copa • 2024–2026',
    qrCodeData: 'https://www.usi.ch/en/authentication/BWFXH', // or a real QR code string
  }
];

export default function WalletScreen() {
  const [cards, setCards] = useState<WalletCard[]>(DUMMY_CARDS);

  const renderCard = ({ item }: { item: WalletCard }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.cardSubtitle}>{item.subtitle}</Text>}
        <Text style={styles.cardType}>Type: {item.type}</Text>
        {item.type === 'student' && item.qrCodeData && (
  <View style={{ marginTop: 12 }}>
    <QRCode value={item.qrCodeData} size={100} backgroundColor="white" />
  </View>
)}

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Wallet</ThemedText>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="add-circle-outline" size={28} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-vertical" size={24} color="#2563eb" style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
  data={cards}
  keyExtractor={(item) => item.id}
  renderItem={renderCard}
  contentContainerStyle={styles.listContainer}
  ListHeaderComponent={<View style={{ height: 40 }} />}
  showsVerticalScrollIndicator={false}
/>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8faff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
cardWrapper: {
  marginBottom: -100,
  paddingHorizontal: 4,
},
card: {
  height: 200,
  borderRadius: 20,
  backgroundColor: '#2563eb',
  padding: 20,
  justifyContent: 'space-between',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
  marginHorizontal: 4, // add soft side margin
  marginVertical: 12,  // similar to inbox card spacing
},

  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 6,
  },
  cardType: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
});
