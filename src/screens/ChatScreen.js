import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView, View, Text, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import styles from "../styles/styles";
import {
  CHAT_STORAGE_KEY, API_KEY_STORAGE_KEY, BACKEND_URL_STORAGE_KEY,
  CONTEXT_ENABLED_STORAGE_KEY, CONTEXT_SIZE_STORAGE_KEY
} from "../constants/storageKeys";

export default function ChatScreen({ navigation }) {
  const { colors, dark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [backendUrl, setBackendUrl] = useState(null);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [contextSize, setContextSize] = useState(6);
  const flatListRef = useRef(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
      setApiKey(await AsyncStorage.getItem(API_KEY_STORAGE_KEY));
      setBackendUrl(await AsyncStorage.getItem(BACKEND_URL_STORAGE_KEY));
      setContextEnabled((await AsyncStorage.getItem(CONTEXT_ENABLED_STORAGE_KEY)) === "true");
      setContextSize(Number(await AsyncStorage.getItem(CONTEXT_SIZE_STORAGE_KEY)) || 6);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (msg) => setMessages((m) => [...m, msg]);

  const fetchAIResponse = async (messageText) => {
    if (backendUrl) {
      try {
        const res = await fetch(backendUrl.replace(/\/$/, "") + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(apiKey ? { "x-api-key": apiKey } : {}) },
          body: JSON.stringify(contextEnabled ? { messages } : { message: messageText }),
        });
        const j = await res.json();
        return j.response || `Echo: ${messageText}`;
      } catch (e) {
        console.warn("Backend failed, falling back:", e);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
    return `Echo: ${messageText}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now() + "-u", text: input, sender: "user", createdAt: new Date().toISOString() };
    setInput("");
    addMessage(userMsg);
    setTyping(true);
    try {
      const aiText = await fetchAIResponse(userMsg.text);
      addMessage({ id: Date.now() + "-a", text: aiText, sender: "ai", createdAt: new Date().toISOString() });
    } finally {
      setTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View style={[styles.bubbleRow, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : { backgroundColor: dark ? "#444" : "#E5E5EA" }
        ]}>
          <Text style={isUser ? styles.userText : { color: colors.text }}>{item.text}</Text>
          <Text style={[styles.timeText, { color: dark ? "#aaa" : "#333" }]}>
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.settingsBtn}>
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <FlatList ref={flatListRef} data={messages} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={styles.listContent} />
      {typing && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={colors.text} />
          <Text style={{ marginLeft: 8, color: colors.text }}>AI is typing...</Text>
        </View>
      )}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
        <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            placeholderTextColor={dark ? "#aaa" : "#666"}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? "#222" : "#fff" }]}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
