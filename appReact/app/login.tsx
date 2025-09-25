import { Text, View, StyleSheet } from "react-native";
import NavBar from "../components/NavBar";

export default function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Page de Connexion</Text>
        {/* Contenu de la page */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 35,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
