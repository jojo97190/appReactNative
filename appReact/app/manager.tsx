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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Réinitialiser l'heure à minuit pour comparer seulement les dates

        // Traiter les demandes et refuser automatiquement celles dont la date est passée ou aujourd'hui
        const processedData = await Promise.all(
          (data || []).map(async (d) => {
            const absenceDate = new Date(d.absence_date);
            absenceDate.setHours(0, 0, 0, 0);

            // Si la date de début est aujourd'hui ou dans le passé, refuser automatiquement
            if (absenceDate <= today) {
              await supabase
                .from("demande_absence")
                .update({ statut: "rf" })
                .eq("id_absence", d.id_absence);
              
              return null; // Ne pas inclure dans la liste
            }

            return {
              id_absence: d.id_absence,
              nom: d.nom,
              prenom: d.prenom,
              email: d.email,
              role: d.role,
              du: d.absence_date,
              au: d.absence_dateFin,
              raison: d.raison,
              statut: d.statut,
              date_remplacement: d.date_remplacement,
              heure_remplacement_deb: d.heure_remplacement_deb,
              heure_remplacement_fin: d.heure_remplacement_fin,
              salle_remplacement: d.salle_remplacement,
              classe: d.classe,
              commentaire: d.commentaire,
            };
          })
        );

        // Filtrer les demandes refusées automatiquement (null)
        setRows(processedData.filter(item => item !== null));
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
        <View style={styles.header}>
          <NavBar />
        </View>
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
        <View style={styles.header}>
          <NavBar />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur : {errorMsg}</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "acc":
        return "#10b981";
      case "rf":
        return "#ef4444";
      case "et":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "acc":
        return "Validée";
      case "rf":
        return "Refusée";
      case "et":
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
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{item.email || "-"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Période:</Text>
            <Text style={styles.value}>Du {item.du} au {item.au}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Raison:</Text>
            <Text style={styles.value}>{item.raison || "-"}</Text>
          </View>

          {item.commentaire && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Commentaire:</Text>
              <Text style={styles.value}>{item.commentaire}</Text>
            </View>
          )}

          {/* Section Remplacement */}
          {item.date_remplacement && (
            <View style={styles.replacementSection}>
              <Text style={styles.replacementTitle}>📅 Remplacement prévu</Text>
              
              <View style={styles.replacementInfo}>
                <Text style={styles.replacementLabel}>Date:</Text>
                <Text style={styles.replacementValue}>
                  {new Date(item.date_remplacement).toLocaleDateString('fr-FR')}
                </Text>
              </View>

              {item.heure_remplacement_deb && item.heure_remplacement_fin && (
                <View style={styles.replacementInfo}>
                  <Text style={styles.replacementLabel}>Horaire:</Text>
                  <Text style={styles.replacementValue}>
                    {item.heure_remplacement_deb} - {item.heure_remplacement_fin}
                  </Text>
                </View>
              )}

              {item.salle_remplacement && (
                <View style={styles.replacementInfo}>
                  <Text style={styles.replacementLabel}>Salle:</Text>
                  <Text style={styles.replacementValue}>
                    {item.salle_remplacement}
                  </Text>
                </View>
              )}

              {item.classe && (
                <View style={styles.replacementInfo}>
                  <Text style={styles.replacementLabel}>Classe:</Text>
                  <Text style={styles.replacementValue}>
                    {item.classe}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          {isBusy ? (
            <ActivityIndicator color="#3B82F6" />
          ) : (
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => handleSetStatus(item.id_absence, "acc")}
                style={[styles.btn, styles.btnSuccess]}
              >
                <Text style={styles.btnText}>✓ Valider</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSetStatus(item.id_absence, "rf")}
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
      <View style={styles.header}>
        <NavBar />
      </View>
      
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

  content: {
    flex: 1,
    padding: 24,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 24,
    letterSpacing: -0.5,
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
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },

  cardHeaderLeft: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
    letterSpacing: -0.3,
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
    padding: 20,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    width: 120,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  value: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },

  cardFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },

  btn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  btnText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  btnSuccess: { 
    backgroundColor: "#10b981" 
  },

  btnDanger: { 
    backgroundColor: "#ef4444" 
  },

  btnWarning: { 
    backgroundColor: "#f59e0b" 
  },

  replacementSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  replacementTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  replacementInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },

  replacementLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    width: 120,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  replacementValue: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "600",
  },
});


