import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from "react-native";
import { supabase } from "./supabase.js";
import { useRouter } from "expo-router";

export default function InscriptionScreen() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Enseignant", value: "enseignant" },
  ];

  const handleRoleSelect = (value: string) => {
    setRole(value);
    setModalVisible(false);
  };

  const getRoleLabel = () => {
    const selectedRole = roles.find(r => r.value === role);
    return selectedRole ? selectedRole.label : "Sélectionnez un rôle";
  };

  const handleSignup = async () => {
    if (!nom || !prenom || !email || !password || !role) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
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

      const { error: insertError } = await supabase.from("utilisateurtest").insert([
        {
          nom: nom.trim(),
          prenom: prenom.trim(),
          email: email.trim(),
          mot_de_passe: password.trim(),
          role: role,
        },
      ]);

      if (insertError) throw insertError;

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
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        value={password}
        onChangeText={setPassword}
      />

      {/* Sélecteur de rôle personnalisé */}
      <TouchableOpacity 
        style={styles.roleSelector} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.roleSelectorText, !role && styles.placeholderText]}>
          {getRoleLabel()}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {/* Modal pour la sélection du rôle */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez un rôle</Text>
            
            {roles.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.roleOption,
                  role === item.value && styles.roleOptionSelected
                ]}
                onPress={() => handleRoleSelect(item.value)}
              >
                <Text style={[
                  styles.roleOptionText,
                  role === item.value && styles.roleOptionTextSelected
                ]}>
                  {item.label}
                </Text>
                {role === item.value && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    fontSize: 16,
  },
  roleSelector: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  roleSelectorText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    color: "#aaa",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  roleOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  roleOptionSelected: {
    backgroundColor: "#007bff",
  },
  roleOptionText: {
    fontSize: 16,
    color: "#000",
  },
  roleOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkmark: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#6c757d",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
