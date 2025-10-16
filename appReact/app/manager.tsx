import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import NavBar from "../components/NavBar";
import {supabase} from './supabase.js';
export default function Manager() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [busyId, setBusyId] = useState(null); 
  const COLUMNS = [
    { label: "ID Demande",   key: "id_absence",   width: 120 },
    { label: "Nom",          key: "nom",          width: 160 },
    { label: "Prénom",       key: "prenom",       width: 160 },
    { label: "Email",        key: "email",        width: 240 },
    { label: "Rôle",         key: "role",         width: 140 },
    { label: "Du",           key: "du",           width: 150 },
    { label: "Au",           key: "au",           width: 150 },
    { label: "Raison",       key: "raison",       width: 220 },
    { label: "Statut",       key: "statut",       width: 150 },
    { label: "Remplacement", key: "remplacement", width: 180 },
    { label: "Commentaire",  key: "commentaire",  width: 280 },
    { label: "Actions",      key: "actions",  width: 320 },
  ];

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("user_demandes")
        .select("*")
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

  
  const handleSetStatus = async (id_absence, newStatus) => {
    try {
      setBusyId(id_absence);

      // MAJ côté base 
      const { error } = await supabase
        .from("demande_absence")
        .update({ statut: newStatus })
        .eq("id_absence", id_absence);

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (e) {
      setErrorMsg(String(e));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Text>Chargement...</Text>;
  if (errorMsg) return <Text>Erreur : {errorMsg}</Text>;

  const Header = () => (
    <View style={[styles.row, styles.headerRow]}>
      {COLUMNS.map((c) => (
        <View key={c.key} style={[styles.cellContainer, { width: c.width }]}>
          <Text style={styles.headerText}>{c.label}</Text>
        </View>
      ))}
    </View>
  );

  const Row = ({ item, index }) => (
    <View
      style={[
        styles.row,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
      ]}
    >
      {COLUMNS.map((c) => {
        if (c.key === "actions") { 
          const isBusy = busyId === item.id_absence;
          return (
            <View key={c.key} style={[styles.cellContainer, { width: c.width }]}>
              {isBusy ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.actionsRow}>
                  <Pressable
                    onPress={() => handleSetStatus(item.id_absence, "validée")}
                    style={[styles.btn, styles.btnSuccess]}
                  >
                    <Text style={styles.btnText}>Validé</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSetStatus(item.id_absence, "refusée")}
                    style={[styles.btn, styles.btnDanger]}
                  >
                    <Text style={styles.btnText}>Refusé </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSetStatus(item.id_absence, "en_attente")}
                    style={[styles.btn, styles.btnWarning]}
                  >
                    <Text style={styles.btnText}>En attente</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }

        return (
          <View key={c.key} style={[styles.cellContainer, { width: c.width }]}>
            <Text style={styles.cellText} numberOfLines={3}>
              {item[c.key] ?? "-"}
            </Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <View style={styles.headerBar}>
        <Text style={styles.title}>Page Manager</Text>
=======
      <View style={styles.header}>
>>>>>>> fda823edaf68f6da2f254f7efa45e59a7ff82041
        <NavBar />
      </View>

      <View style={styles.wrap}>
        <ScrollView horizontal>
          <View style={styles.table}>
            <Header />
            <FlatList
              data={rows}
              keyExtractor={(r, i) => String(r.id_absence ?? i)}
              renderItem={({ item, index }) => <Row item={item} index={index} />}
              style={{ maxHeight: 520 }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },

  title: { fontSize: 24, fontWeight: "bold", color: "#333" },

  wrap: { flex: 1, padding: 16, backgroundColor: "#F7F9FC" },

  table: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },

  headerRow: { backgroundColor: "#3B82F6" },

  cellContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#EAEAEA",
  },

  headerText: { color: "#fff", fontWeight: "bold" },

  cellText: {
    color: "#333",
    textAlign: "left",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  rowEven: { backgroundColor: "#F9FAFB" },
  rowOdd: { backgroundColor: "#FFFFFF" },

  actionsRow: {
    flexDirection: "row",
    gap: 8, 
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnSuccess: { backgroundColor: "#16a34a" },
  btnDanger: { backgroundColor: "#dc2626" },
  btnWarning: { backgroundColor: "#6b7280" },
});


