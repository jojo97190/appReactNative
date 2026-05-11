import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import NavBar from "../components/NavBar";
import { supabase } from "./supabase.js";

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
        today.setHours(0, 0, 0, 0); // Minuit aujourd'hui (heure locale)

        const processedData = await Promise.all(
          (data || []).map(async (d) => {
            // 1. Correction du décalage horaire : On découpe manuellement "YYYY-MM-DD"
            const dateString = d.absence_date.substring(0, 10); // Extrait "2026-03-17"
            const [year, month, day] = dateString.split("-");
            
            // On crée la date localement en évitant le décalage UTC (le mois commence à 0 en JS)
            const absenceDate = new Date(year, month - 1, day);
            absenceDate.setHours(0, 0, 0, 0);

            // 2. Correction de la condition : On refuse UNIQUEMENT si la date est dans le passé (<)
            if (absenceDate < today) {
              await supabase
                .from("demande_absence")
                .update({ statut: "rf" })
                .eq("id_absence", d.id_absence);
              
              return null; // On ne l'affiche pas, elle est refusée
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

        setRows(processedData.filter(item => item !== null));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSetStatus = async (id_absence: number, newStatus: string) => {
    try {
      setBusyId(id_absence);

      const { error } = await supabase
        .from("demande_absence")
        .update({ statut: newStatus })
        .eq("id_absence", id_absence);

      if (error) {
        setErrorMsg(error.message);
      } else {
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
          <Text style={styles.loadingText}>Chargement des demandes...</Text>
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
      case "acc": return "#10b981"; // Vert
      case "rf": return "#ef4444";  // Rouge
      case "et": return "#f59e0b";  // Orange
      default: return "#6b7280";    // Gris
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "acc": return "Validée";
      case "rf": return "Refusée";
      case "et": return "En attente";
      default: return statut;
    }
  };

  const BoxCard = ({ item }: { item: any }) => {
    const isBusy = busyId === item.id_absence;
    
    return (
      <View style={styles.boxCard}>
        {/* En-tête de la box */}
        <View style={styles.boxHeader}>
          <View>
            <Text style={styles.boxTitle}>{item.prenom} {item.nom}</Text>
            <Text style={styles.boxSubtitle}>{item.email}</Text>
          </View>
          {/* Badge de statut utilisé ici ! */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
            <Text style={styles.statusText}>{getStatusLabel(item.statut)}</Text>
          </View>
        </View>

        {/* Corps de la box */}
        <View style={styles.boxBody}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Période</Text>
            <Text style={styles.value}>Du {item.du} au {item.au}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Raison</Text>
            <Text style={styles.value}>{item.raison || "Non renseignée"}</Text>
          </View>

          {item.commentaire && (
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Commentaire</Text>
              <Text style={styles.value}>{item.commentaire}</Text>
            </View>
          )}

          {/* Remplacement (si existe) */}
          {item.date_remplacement && (
            <View style={styles.replacementBox}>
              <Text style={styles.replacementTitle}>🔄 Remplacement prévu</Text>
              <Text style={styles.replacementText}>
                <Text style={styles.bold}>Date :</Text> {new Date(item.date_remplacement).toLocaleDateString('fr-FR')}
              </Text>
              {item.heure_remplacement_deb && item.heure_remplacement_fin && (
                <Text style={styles.replacementText}>
                  <Text style={styles.bold}>Horaire :</Text> {item.heure_remplacement_deb} - {item.heure_remplacement_fin}
                </Text>
              )}
              {item.salle_remplacement && (
                <Text style={styles.replacementText}>
                  <Text style={styles.bold}>Salle :</Text> {item.salle_remplacement}
                </Text>
              )}
              {item.classe && (
                <Text style={styles.replacementText}>
                  <Text style={styles.bold}>Classe :</Text> {item.classe}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Boutons d'action */}
        <View style={styles.boxFooter}>
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
      <NavBar />
      
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Demandes en attente</Text>
        
        <FlatList
          data={rows}
          keyExtractor={(item, i) => String(item.id_absence ?? i)}
          renderItem={({ item }) => <BoxCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune demande en attente.</Text>
          }
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    marginTop: 40,
  },
  
  // --- STYLES DES PETITES BOX ---
  boxCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  boxSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  boxBody: {
    padding: 16,
  },
  infoBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },
  replacementBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  replacementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 6,
  },
  replacementText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "600",
  },
  boxFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 14,
  },
  btnSuccess: { backgroundColor: "#10b981" },
  btnDanger: { backgroundColor: "#ef4444" },
});
