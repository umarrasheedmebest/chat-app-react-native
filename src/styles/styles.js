import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", padding: 12, alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  settingsBtn: { padding: 8 },
  settingsText: { color: "#007AFF" },
  listContent: { paddingHorizontal: 12, paddingBottom: 8 },
  bubbleRow: { marginVertical: 6, flexDirection: "row" },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },
  bubble: { maxWidth: "75%", padding: 10, borderRadius: 12 },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  userText: { color: "#fff" },
  timeText: { fontSize: 10, marginTop: 6, opacity: 0.8, textAlign: "right" },
  inputRow: { flexDirection: "row", padding: 8, borderTopWidth: 1, alignItems: "center" },
  input: { flex: 1, height: 44, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  sendBtn: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#007AFF", borderRadius: 8 },
  sendText: { color: "#fff", fontWeight: "600" },
  typingRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 8 },
  label: { fontWeight: "600" },
  settingsInput: { marginTop: 8, height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
});
