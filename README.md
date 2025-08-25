# Chat App

A simple React Native chat app built with Expo and React Navigation.  
Supports light/dark themes with a Settings screen to toggle between them.

---

## 📂 Project Structure

```
App.js
│
├── Navigation
│   └── Stack Navigator
│       ├── ChatScreen.js
│       └── SettingsScreen.js
│
├── Theme Context (inside App.js)
│   ├── Provides dark/light mode
│   └── Accessible from any screen
│
screens/
│   ├── ChatScreen.js
│   │   ├── Input box for typing messages
│   │   ├── Send button
│   │   └── Echoes message back
│   │
│   └── SettingsScreen.js
│       └── Switch for Dark Mode toggle
│
README.md
package.json
```

---

## 🚀 Steps to Run the App

1. Clone or unzip the project.
2. Navigate to the project folder:
   ```bash
   cd chat-app
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
   *(or use `npm install` if you prefer npm)*

4. Start the project with Expo:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - Press **i** to launch iOS simulator
   - Press **a** to launch Android emulator

---

## 📝 Notes
- Make sure you have **Expo CLI** and the required simulators/emulators set up.  
- If you face issues with dependencies, try deleting `node_modules` and reinstalling.  

---

✅ You’re all set to run the app!
