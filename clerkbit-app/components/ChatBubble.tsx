import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export const ChatBubble = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/chat")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        setMessage('Failed to fetch message.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.bubble}>
          <ThemedText>{message}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
});
