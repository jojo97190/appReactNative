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
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { supabase } from "./supabase.js";
import 'react-native-url-polyfill/auto';
import { useUserContext } from "./usercontext";
import { useRouter } from "expo-router";  // <-- import du router

export default function LoginScreen() {
  type User = {
    role: string | null;
    id: string | null;
  };
  const { updateUser, user } = useUserContext() as { updateUser: (user: User) => void; user: User };
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
      .select("role,id_utilisateur,nom,prenom")
      .eq("email", email.trim())
      .eq("mot_de_passe", password.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
      console.log("Erreur récupération rôle :", error);
      return;
    }

    updateUser({ role: data.role, id: data.id_utilisateur, nom: data.nom, prenom: data.prenom });

    console.log("ID utilisateur :", data.id_utilisateur);
    
    Alert.alert("Succès", `Connexion réussie ! role: ${data.role} `);

    router.push("/");  // <-- redirection vers la page index.tsx
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Connexion</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#373737ff", marginTop: 10, top:260 }]}
          onPress={() => router.push("/inscription")}
        >
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 48,
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});











