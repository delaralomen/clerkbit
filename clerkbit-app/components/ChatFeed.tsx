import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Pressable, Text } from 'react-native';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export const ChatFeed = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();

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
        headers: { 'Content-Type': 'application/json' },
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
  console.log('Color scheme is:', colorScheme);


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
          renderItem={({ item }) => {
            const isDark = colorScheme === 'dark';
            const isUser = item.sender === 'user';

            return (
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? {
                        ...styles.userBubble,
                        backgroundColor: isDark ? '#311453ff' : '#dac6f8ff',
                      }
                    : {
                        ...styles.botBubble,
                        backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0',
                      },
                ]}
              >
                <ThemedText>{item.text}</ThemedText>
              </View>
            );
          }}
          contentContainerStyle={styles.chatArea}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToOffset({
              offset: Number.MAX_SAFE_INTEGER,
              animated: true,
            })
          }
        />

        <View
  style={[
    styles.inputArea,
    {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
    },
  ]}
>
  <TextInput
  value={input}
  onChangeText={setInput}
  placeholder="Type a message..."
  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#888'}
  onSubmitEditing={sendMessage} // 👈 This line is key
  returnKeyType="send"          // 👈 (optional) shows "Send" button on mobile keyboard
  blurOnSubmit={false}          // 👈 (optional) keeps focus after submit
  style={[
    styles.input,
    {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f9f9f9',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
    },
  ]}
/>

  <Pressable onPress={sendMessage} style={[
  {
    backgroundColor: '#7C3AED', // Purple
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  }
]}>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
</Pressable>
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
    alignSelf: 'flex-end',
  },
  botBubble: {
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
  },
});
