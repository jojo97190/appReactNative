import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LoginBubble from "../components/LoginBubble";

export default function NavBar() {
  const router = useRouter();

  const navButtons = [
    { title: "Accueil", route: "/" },
    { title: "Manager", route: "/manager" },
    { title: "Demande", route: "/request" },
    { title: "Mes demandes", route: "/my-request" },
  ];

  return (
    <View style={styles.navbar}>
      <View style={styles.buttonsContainer}>
        {navButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() => router.push(button.route as any)}
          >
            <Text style={styles.navButtonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <LoginBubble />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 0,
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
  },
  navButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
});
