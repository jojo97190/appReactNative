import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import NavBar from "../components/NavBar";
import {supabase} from './supabase.js';

export default function Manager() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("user_demandes")
        .select("*")
        .eq("statut", "et")
        .order("absence_date", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg(error.message);
      } else {
        const flat = (data || []).map((d) => ({
          id_absence: d.id_absence,
          nom: d.nom,
          prenom: d.prenom,
          email: d.email,
          role: d.role,
          du: d.absence_date,
          au: d.absence_dateFin,
          raison: d.raison,
          statut: d.statut,
          remplacement: d.date_remplacement,
          commentaire: d.commentaire,
        }));
        setRows(flat);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  
  const handleSetStatus = async (id_absence: number, newStatus: string) => {
    try {
      setBusyId(id_absence);

      // MAJ côté base 
      const { error } = await supabase
        .from("demande_absence")
        .update({ statut: newStatus })
        .eq("id_absence", id_absence);

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Retirer la demande de la liste après validation/refus
        setRows(prevRows => 
          prevRows.filter(row => row.id_absence !== id_absence)
        );
      }
    } catch (e) {
      setErrorMsg(String(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NavBar />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <NavBar />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur : {errorMsg}</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "validée":
        return "#10b981";
      case "refusée":
        return "#ef4444";
      case "en_attente":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "validée":
        return "Validée";
      case "refusée":
        return "Refusée";
      case "en_attente":
        return "En attente";
      default:
        return statut;
    }
  };

  const Card = ({ item }: { item: any }) => {
    const isBusy = busyId === item.id_absence;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>{item.prenom} {item.nom}</Text>
            <Text style={styles.cardSubtitle}>ID: {item.id_absence}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{item.email || "-"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rôle:</Text>
            <Text style={styles.value}>{item.role || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Période:</Text>
            <Text style={styles.value}>Du {item.du} au {item.au}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Raison:</Text>
            <Text style={styles.value}>{item.raison || "-"}</Text>
          </View>

          {item.remplacement && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Remplacement:</Text>
              <Text style={styles.value}>{item.remplacement}</Text>
            </View>
          )}

          {item.commentaire && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Commentaire:</Text>
              <Text style={styles.value}>{item.commentaire}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          {isBusy ? (
            <ActivityIndicator color="#3B82F6" />
          ) : (
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => handleSetStatus(item.id_absence, "validée")}
                style={[styles.btn, styles.btnSuccess]}
              >
                <Text style={styles.btnText}>✓ Valider</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSetStatus(item.id_absence, "refusée")}
                style={[styles.btn, styles.btnDanger]}
              >
                <Text style={styles.btnText}>✗ Refuser</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <NavBar />
      
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Gestion des demandes d'absence</Text>
        
        <FlatList
          data={rows}
          keyExtractor={(item, i) => String(item.id_absence ?? i)}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },

  content: {
    flex: 1,
    padding: 16,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 10,
  },

  listContainer: {
    paddingBottom: 20,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },

  cardHeaderLeft: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  cardBody: {
    padding: 16,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    width: 120,
  },

  value: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
  },

  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },

  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 14,
  },

  btnSuccess: { 
    backgroundColor: "#16a34a" 
  },

  btnDanger: { 
    backgroundColor: "#dc2626" 
  },

  btnWarning: { 
    backgroundColor: "#f59e0b" 
  },
});


