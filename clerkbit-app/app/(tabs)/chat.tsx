import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  from: 'user' | 'bot';
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hi! 👋 I'm ClerkBit. How can I help you today?", from: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: inputText.trim(),
      from: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botReply: Message = {
        id: `${Date.now()}-bot`,
        text: "Sure! I'm here to assist you with anything related to Bitcoin-powered businesses. What would you like to know?",
        from: 'bot',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 80 }]}> {/* here hardcoded padding to not make the navbar overlap text field */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubble: {
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#e2e8f0',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 16,
    color: '#fff',
  },
  inputBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
