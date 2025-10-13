import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LoginBubble from "../components/LoginBubble";
import { useUserContext } from "../app/usercontext.js"; // ✅ CONTEXTE UTILISATEUR

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

        {/* ✅ Affiche Accueil et Manager si admin */}
        {user.role === "admin" && (
          <>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.navButtonText}>Accueil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/manager")}
            >
              <Text style={styles.navButtonText}>Manager</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ✅ Affiche Request et My Request si enseignant */}
        {user.role === "enseignant" && (

          
          <> <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.navButtonText}>Accueil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/request")}
            >
              <Text style={styles.navButtonText}>Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/my-request")}
            >
              <Text style={styles.navButtonText}>My Request</Text>
            </TouchableOpacity>
          </>
        )}

      </View>

      {/* ✅ Bubble à droite */}
      <LoginBubble />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
  },
  navButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 6,
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
  },
});

