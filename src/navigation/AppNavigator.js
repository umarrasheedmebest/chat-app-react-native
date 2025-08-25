import React, { useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemePrefContext from "../context/ThemeContext";
import { THEME_STORAGE_KEY } from "../constants/storageKeys";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [themeDark, setThemeDark] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (t) setThemeDark(t === "dark");
    })();
  }, []);

  const setThemeDarkPref = (val) => {
    setThemeDark(val);
    AsyncStorage.setItem(THEME_STORAGE_KEY, val ? "dark" : "light").catch(() => { });
  };

  return (
    <ThemePrefContext.Provider value={{ themeDark, setThemeDarkPref }}>
      <NavigationContainer theme={themeDark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemePrefContext.Provider>
  );
}
