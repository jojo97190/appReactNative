import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function AbsenceStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    refused: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Total
        const { count: total, error: totalError } = await supabase
          .from("demandes_absence")
          .select("*", { count: "exact", head: true });
        if (totalError) throw totalError;

        // Pending
        const { count: pending, error: pendingError } = await supabase
          .from("demandes_absence")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");
        if (pendingError) throw pendingError;

        // Accepted
        const { count: accepted, error: acceptedError } = await supabase
          .from("demandes_absence")
          .select("*", { count: "exact", head: true })
          .eq("status", "acc");
        if (acceptedError) throw acceptedError;

        // Refused
        const { count: refused, error: refusedError } = await supabase
          .from("demandes_absence")
          .select("*", { count: "exact", head: true })
          .eq("status", "rf");
        if (refusedError) throw refusedError;

        setStats({ total, pending, accepted, refused });
      } catch (error) {
        console.error("Erreur lors du chargement des stats :", error.message);
        setStats({ total: 0, pending: 0, accepted: 0, refused: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Page d'accueil</Text>
        <Text>Bienvenue sur la page d'accueil !</Text>

        <View style={styles.statsBubble}>
          <Text style={styles.statsTitle}>Vos demandes</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <>
              <Text>Total : {stats.total}</Text>
              <Text>En attente : {stats.pending}</Text>
              <Text>Acceptées : {stats.accepted}</Text>
              <Text>Refusées : {stats.refused}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  content: { flex: 1, padding: 20 },
  statsBubble: {
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  statsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
