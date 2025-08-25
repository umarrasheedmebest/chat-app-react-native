import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, TextInput, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

import ThemePrefContext from "../context/ThemeContext";
import styles from "../styles/styles";
import {
  API_KEY_STORAGE_KEY,
  BACKEND_URL_STORAGE_KEY,
  CONTEXT_ENABLED_STORAGE_KEY,
  CONTEXT_SIZE_STORAGE_KEY,
} from "../constants/storageKeys";

export default function SettingsScreen() {
  const { colors, dark } = useTheme();
  const { themeDark, setThemeDarkPref } = useContext(ThemePrefContext);

  const [apiKey, setApiKey] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [contextEnabled, setContextEnabled] = useState(true);
  const [contextSize, setContextSize] = useState("6");

  // Load saved values on mount
  useEffect(() => {
    (async () => {
      try {
        const key = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        if (key) setApiKey(key);
      } catch { }

      try {
        const url = await AsyncStorage.getItem(BACKEND_URL_STORAGE_KEY);
        if (url) setBackendUrl(url);
      } catch { }

      try {
        const ctx = await AsyncStorage.getItem(CONTEXT_ENABLED_STORAGE_KEY);
        setContextEnabled(ctx === null ? true : ctx === "true");
      } catch { }

      try {
        const size = await AsyncStorage.getItem(CONTEXT_SIZE_STORAGE_KEY);
        setContextSize(size ? String(size) : "6");
      } catch { }
    })();
  }, []);

  // Save API key locally
  const saveApiKey = async (v) => {
    setApiKey(v);
    try {
      if (v) await AsyncStorage.setItem(API_KEY_STORAGE_KEY, v);
      else await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to save API key", e);
    }
  };

  // Save backend URL
  const saveBackendUrl = async (v) => {
    setBackendUrl(v);
    try {
      if (v) await AsyncStorage.setItem(BACKEND_URL_STORAGE_KEY, v);
      else await AsyncStorage.removeItem(BACKEND_URL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to save backend URL", e);
    }
  };

  // Toggle theme (AppNavigator persists + re-renders NavigationContainer)
  const toggleTheme = (val) => {
    setThemeDarkPref(val);
  };

  // Toggle sending multi-turn context
  const toggleContext = async (val) => {
    setContextEnabled(val);
    try {
      await AsyncStorage.setItem(CONTEXT_ENABLED_STORAGE_KEY, val ? "true" : "false");
    } catch (e) {
      console.warn("Failed to save context flag", e);
    }
  };

  // Save context window size
  const saveContextSize = async (v) => {
    const num = Math.max(1, Math.min(30, Number(v) || 1));
    setContextSize(String(num));
    try {
      await AsyncStorage.setItem(CONTEXT_SIZE_STORAGE_KEY, String(num));
    } catch (e) {
      console.warn("Failed to save context size", e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ padding: 16 }}>
        <Text style={[styles.label, { color: colors.text }]}>API Key (stored locally)</Text>
        <TextInput
          value={apiKey}
          onChangeText={saveApiKey}
          placeholder="Enter API key (optional)"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.settingsInput,
            { color: colors.text, borderColor: colors.border, backgroundColor: dark ? "#222" : "#fff" },
          ]}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 12, color: colors.text }]}>Backend URL (optional)</Text>
        <TextInput
          value={backendUrl}
          onChangeText={saveBackendUrl}
          placeholder="https://your-server.example.com"
          placeholderTextColor={dark ? "#aaa" : "#666"}
          style={[
            styles.settingsInput,
            { color: colors.text, borderColor: colors.border, backgroundColor: dark ? "#222" : "#fff" },
          ]}
          autoCapitalize="none"
        />

        <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={[styles.label, { color: colors.text }]}>Dark theme</Text>
          <Switch value={themeDark} onValueChange={toggleTheme} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={[styles.label, { color: colors.text }]}>Send conversation context</Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}
          >
            <Text style={{ flex: 1, color: colors.text }}>
              Include last messages when sending to backend
            </Text>
            <Switch value={contextEnabled} onValueChange={toggleContext} />
          </View>

          <Text style={[styles.label, { marginTop: 12, color: colors.text }]}>
            Context size (number of messages)
          </Text>
          <TextInput
            value={contextSize}
            onChangeText={saveContextSize}
            placeholder="6"
            keyboardType="numeric"
            placeholderTextColor={dark ? "#aaa" : "#666"}
            style={[
              styles.settingsInput,
              { color: colors.text, borderColor: colors.border, backgroundColor: dark ? "#222" : "#fff" },
            ]}
          />
        </View>

        <Text style={{ marginTop: 20, color: dark ? "#aaa" : "#666" }}>
          Notes: When conversation context is enabled the app POSTs {"{ messages: [{role,content}, ...] }"} to your
          backend's /chat. If no backend or network is available the app falls back to a local echo stub so you can
          test immediately.
        </Text>
      </View>
    </SafeAreaView>
  );
}
