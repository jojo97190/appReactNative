import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useUserContext } from "./usercontext";
import { useRouter } from "expo-router";

export default function AbsenceStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    refused: 0,
  });
  const [loading, setLoading] = useState(true);
  
  type User = {
    id: string;
    role: string | null;
  };

  const { user } = useUserContext() as { user: User };
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, arrêter le chargement
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      try {
        // Total
        const { count: total, error: totalError } = await supabase
          .from("demande_absence")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (totalError) throw totalError;

        // Pending (en attente)
        const { count: pending, error: pendingError } = await supabase
          .from("demande_absence")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("statut", "et");
        if (pendingError) throw pendingError;

        // Accepted
        const { count: accepted, error: acceptedError } = await supabase
          .from("demande_absence")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("statut", "acc");
        if (acceptedError) throw acceptedError;

        // Refused
        const { count: refused, error: refusedError } = await supabase
          .from("demande_absence")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("statut", "rf");
        if (refusedError) throw refusedError;

        setStats({ 
          total: total ?? 0, 
          pending: pending ?? 0, 
          accepted: accepted ?? 0, 
          refused: refused ?? 0 
        });
      } catch (error: any) {
        console.error("Erreur lors du chargement des stats :", error.message);
        setStats({ total: 0, pending: 0, accepted: 0, refused: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>

      <View style={styles.content}>
        {!user || !user.id ? (
          // Affichage si non connecté
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInEmoji}>🔒</Text>
            <Text style={styles.notLoggedInTitle}>Connexion requise</Text>
            <Text style={styles.notLoggedInText}>
              Veuillez vous connecter pour accéder à vos statistiques d'absence
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        ) : user.role === "admin" ? (
          // Affichage pour les admins (pas de statistiques)
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.title}>Bienvenue Administrateur</Text>
            <Text style={styles.subtitle}>Système de gestion des demandes d'absence</Text>
          </View>
        ) : (
          // Affichage pour les utilisateurs normaux
          <>
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeEmoji}>👋</Text>
              <Text style={styles.title}>Bienvenue</Text>
              <Text style={styles.subtitle}>Système de gestion des demandes d'absence</Text>
            </View>

            <View style={styles.statsBubble}>
              <Text style={styles.statsTitle}>📊 Statistiques</Text>

              {loading ? (
                <ActivityIndicator size="large" color="#6366f1" />
              ) : (
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#f59e0b" }]}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>En attente</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#10b981" }]}>{stats.accepted}</Text>
                    <Text style={styles.statLabel}>Acceptées</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#ef4444" }]}>{stats.refused}</Text>
                    <Text style={styles.statLabel}>Refusées</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f4f8" 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800", 
    color: "#1e293b",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  content: { 
    flex: 1, 
    padding: 24 
  },
  welcomeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  welcomeEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsBubble: {
    marginTop: 24,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#6366f1",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statsTitle: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 20,
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  notLoggedInEmoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  notLoggedInTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
