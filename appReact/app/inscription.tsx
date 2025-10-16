import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "./supabase.js";
import { useRouter } from "expo-router";

export default function InscriptionScreen() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!nom || !prenom || !email || !password || !role) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      // Vérifie si l'email existe déjà
      const { data: existingUser, error: selectError } = await supabase
        .from("utilisateurtest")
        .select("email")
        .eq("email", email.trim())
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingUser) {
        Alert.alert("Erreur", "Cet email est déjà utilisé.");
        setLoading(false);
        return;
      }

      // Insertion du nouvel utilisateur
      const { error: insertError } = await supabase.from("utilisateurtest").insert([
        {
          nom: nom.trim(),
          prenom: prenom.trim(), 
          email: email.trim(),
          mot_de_passe: password.trim(),
          role: role.trim(),
        },
      ]);

      if (insertError) {
        console.error("Erreur Supabase :", insertError.message);
        throw insertError;
      }

      Alert.alert("Succès", "Compte créé avec succès !");
      router.push("/login");
    } catch (error) {
      console.error("Erreur :", error.message || error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#aaa"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#aaa"
        value={prenom}
        onChangeText={setPrenom}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Rôle (admin ou enseignant)"
        placeholderTextColor="#aaa"
        value={role}
        onChangeText={setRole}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Création..." : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6c757d", marginTop: 10 }]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "bold",
  },
});

