import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedText } from './ThemedText';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export const ChatFeed = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const flatListRef = useRef<FlatList>(null);

  // 👇 Auto-scroll to bottom on new messages
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: input,
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');

  try {
    const res = await fetch('http://localhost:5050/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: data.message,
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: 'Oops! Failed to fetch response.',
      },
    ]);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={80}
    >
      <View style={styles.inner}>
        <FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View
      style={[
        styles.bubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}>
      <ThemedText>{item.text}</ThemedText>
    </View>
  )}
  contentContainerStyle={styles.chatArea}
  onContentSizeChange={() =>
    flatListRef.current?.scrollToOffset({
        offset: Number.MAX_SAFE_INTEGER,
        animated: true,
    })
  }
/>

        <View style={styles.inputArea}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatArea: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  }
});
