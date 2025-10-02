import { Text, View, StyleSheet,FlatList,ScrollView} from "react-native";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import LoginBubble from "../components/LoginBubble";
import {supabase} from './supabase.js';
export default function Manager() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Fonction async pour récupérer les données
    async function fetchData() {
      const { data, error } = await supabase
        .from("utilisateurtest")
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération :", error);
        setErrorMsg(error.message);
      } else {
        setData(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  if (errorMsg) {
    return <Text>Erreur : {errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      <LoginBubble />
      <View style={styles.header}>
        <Text style={styles.title}>Page Gestionnaire</Text>
        <NavBar />
      </View>
   <Text>{JSON.stringify(data)}</Text>  
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

});

