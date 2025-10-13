/*import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../../supabase'

export default function Home() {
  const [users, setUsers] = useState([])


  useEffect(() => {
    fetchUsers()
}, [])

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')   // nom de ta table dans Supabase
      .select('*')

   
  }

return (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Liste des utilisateurs :</Text>
    {users.length > 0 ? (
      users.map((user) => (
        <Text key={user.id} style={{ marginTop: 5 }}>
          {user.id} - {user.nom}  {/* affiche seulement id et nom }
        </Text>
      ))
    ) : (
      <Text>Aucun utilisateur trouvé.</Text>
    )}
  </View>
)


}




la vrai page 

*/


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "./supabase.js";
import 'react-native-url-polyfill/auto';
import { useUserContext } from "./usercontext";
import { useRouter } from "expo-router";  // <-- import du router

export default function LoginScreen() {
  const { updateUser, user } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // <-- instanciation du router

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("utilisateurtest")
      .select("role,id_utilisateur")
      .eq("email", email.trim())
      .eq("mot_de_passe", password.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
      console.log("Erreur récupération rôle :", error);
      return;
    }

    updateUser({ role: data.role, id: data.id_utilisateur });

    console.log("ID utilisateur :", data.id_utilisateur);
    console.log("Utilisateur connecté avec rôle :", data.role);
    Alert.alert("Succès", `Connexion réussie ! Rôle : ${data.role}`);

    router.push("/");  // <-- redirection vers la page index.tsx
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <Text>Rôle : {user.role ?? "aucun"}</Text>
      <Text>ID Utilisateur : {user.id ?? "aucun"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});











