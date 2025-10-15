import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LoginBubble from "../components/LoginBubble";
import { useUserContext } from "../app/usercontext.js";

type User = {
  role: "admin" | "enseignant" | string | null;
};

export default function NavBar() {
  const router = useRouter();
  const { user } = useUserContext() as { user: User };

  return (
    <View style={styles.navbar}>
      {/* Boutons de navigation selon le rôle */}
      <View style={styles.buttonsContainer}>
        {/* Affiche les boutons seulement si connecté */}
        {user && user.role !== null && (
          <>
            {/* Accueil - visible pour tous */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.navButtonText}>Accueil</Text>
            </TouchableOpacity>

            {/* Manager - visible seulement pour admin */}
            {user.role === "admin" && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/manager")}
              >
                <Text style={styles.navButtonText}>Manager</Text>
              </TouchableOpacity>
            )}

            {/* Demande - visible seulement pour enseignant */}
            {user.role === "enseignant" && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/request")}
              >
                <Text style={styles.navButtonText}>Demande</Text>
              </TouchableOpacity>
            )}

            {/* Mes demandes - visible seulement pour enseignant */}
            {user.role === "enseignant" && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => router.push("/my-request")}
              >
                <Text style={styles.navButtonText}>Mes demandes</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* LoginBubble toujours à droite */}
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
    paddingVertical: 5,
  },
  navButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 8,
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
    marginTop: 10,
  },
});