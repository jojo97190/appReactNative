import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NavBar() {
  const router = useRouter();

  const navButtons = [
    { title: "Accueil", route: "/" },
    { title: "Login", route: "/login" },
    { title: "Manager", route: "/manager" },
    { title: "Request", route: "/request" },
    { title: "My Request", route: "/my-request" },
  ];

  return (
    <View style={styles.navbar}>
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
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  navButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
});
