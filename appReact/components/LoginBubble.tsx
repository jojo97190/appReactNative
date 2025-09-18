import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function LoginBubble() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.bubbleButton}
      onPress={() => router.push("/login")}
    >
      <Text style={styles.bubbleText}>👤</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubbleButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  bubbleText: {
    fontSize: 24,
    color: "white",
  },
});