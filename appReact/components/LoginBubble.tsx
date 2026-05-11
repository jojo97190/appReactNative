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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleText: {
    fontSize: 24,
    color: "white",
  },
});