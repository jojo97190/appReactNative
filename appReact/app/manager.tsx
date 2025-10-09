import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from './supabase.js';
export default function Manager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: absences, error } = await supabase
        .from("demande_absence")
        .select(`
          id_absence,
          absence_date,
          absence_dateFin,
          date_remplacement,
          raison,
          statut,
          commentaire,
          utilisateurtest:user_id (
            id_utilisateur,
            nom,
            prenom,
            email,
            role
          )
        `)
        .order("absence_date", { ascending: false });

      if (error) {
        console.error(error);
        setErrorMsg(error.message);
      } else {
        const flat = (absences || []).map((d) => ({
          id_absence: d.id_absence,
          nom: d.utilisateurtest?.nom ?? "",
          prenom: d.utilisateurtest?.prenom ?? "",
          email: d.utilisateurtest?.email ?? "",
          role: d.utilisateurtest?.role ?? "",
          du: d.absence_date ?? "",
          au: d.absence_dateFin ?? "",
          raison: d.raison ?? "",
          statut: d.statut ?? "",
          remplacement: d.date_remplacement ?? "",
          commentaire: d.commentaire ?? "",
        }));
        setRows(flat);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Text>Chargement...</Text>;
  if (errorMsg) return <Text>Erreur : {errorMsg}</Text>;

  return (
    <View style={styles.container}>
      {/* ... ton header existant ... */}

      <View style={styles.wrap}>
        <ScrollView horizontal>
          <ScrollView>
            <View style={styles.table}>
              {rows.length ? (
                <>
                  <View style={[styles.row, styles.headerRow]}>
                    {[
                      "ID Demande",
                      "Nom",
                      "Prénom",
                      "Email",
                      "Rôle",
                      "Du",
                      "Au",
                      "Raison",
                      "Statut",
                      "Remplacement",
                      "Commentaire",
                    ].map((h) => (
                      <View key={h} style={[styles.cell, styles.headerCell]}>
                        <Text style={styles.headerText}>{h}</Text>
                      </View>
                    ))}
                  </View>

                  {rows.map((r, i) => (
                    <View
                      key={r.id_absence || i}
                      style={[
                        styles.row,
                        i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                      ]}
                    >
                      <View style={styles.cell}><Text>{r.id_absence}</Text></View>
                      <View style={styles.cell}><Text>{r.nom}</Text></View>
                      <View style={styles.cell}><Text>{r.prenom}</Text></View>
                      <View style={styles.cell}><Text>{r.email}</Text></View>
                      <View style={styles.cell}><Text>{r.role}</Text></View>
                      <View style={styles.cell}><Text>{r.du}</Text></View>
                      <View style={styles.cell}><Text>{r.au}</Text></View>
                      <View style={[styles.cell, styles.cellWide]}><Text>{r.raison || "-"}</Text></View>
                      <View style={styles.cell}><Text>{r.statut || "-"}</Text></View>
                      <View style={styles.cell}><Text>{r.remplacement || "-"}</Text></View>
                      <View style={[styles.cell, styles.cellWider]}><Text>{r.commentaire || "-"}</Text></View>
                    </View>
                  ))}
                </>
              ) : (
                <Text style={{ padding: 12 }}>Aucune demande d’absence</Text>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  test: {
    fontSize: 18,
    color: "blue",},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  table: {
    flexDirection: "row",
    padding: 10,
    minWidth: 120,
  },
   cellContainer: {
    minWidth: 120, // largeur fixe par cellule pour bien aligner
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: "#EAEAEA",
  },
 
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerRow: {
    backgroundColor: "#3B82F6",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  rowEven: {
    backgroundColor: "#F9FAFB",
  },
  rowOdd: {
    backgroundColor: "#FFFFFF",
  },
  wrap: { flex: 1, padding: 16, backgroundColor: "#F7F9FC" },
   cellWide: { minWidth: 180 },
  cellWider: { minWidth: 240 },
  headerText: { color: "#fff", fontWeight: "bold" },
  headerCell: { borderRightColor: "rgba(255,255,255,0.25)" },

});
