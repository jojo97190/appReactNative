import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
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

  const isValidPassword = (password: string): boolean => {
    // Minimum 12 caractères
    if (password.length < 12) return false;
    
    // Au moins une lettre minuscule
    if (!/[a-z]/.test(password)) return false;
    
    // Au moins une lettre majuscule
    if (!/[A-Z]/.test(password)) return false;
    
    // Au moins un chiffre
    if (!/[0-9]/.test(password)) return false;
    
    // Au moins un caractère spécial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
  };

  const isValidEmail = (email: string): boolean => {
    // Regex pour valider le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSignup = async () => {
    if (!nom || !prenom || !email || !password || !role) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // Validation de l'adresse email
    if (!isValidEmail(email)) {
      Alert.alert(
        "Email invalide",
        "Veuillez saisir une adresse email valide (ex: nom@domaine.com)"
      );
      return;
    }

    // Validation du mot de passe
    if (!isValidPassword(password)) {
      Alert.alert(
        "Mot de passe invalide",
        "Le mot de passe doit contenir :\n" +
        "• Au minimum 12 caractères\n" +
        "• Au moins une lettre minuscule\n" +
        "• Au moins une lettre majuscule\n" +
        "• Au moins un chiffre\n" +
        "• Au moins un caractère spécial (!@#$%^&*...)"
      );
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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
  roleSelector: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleSelectorText: {
    fontSize: 16,
    color: "#1e293b",
  },
  placeholderText: {
    color: "#94a3b8",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#64748b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#1e293b",
  },
  roleOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
  },
  roleOptionSelected: {
    backgroundColor: "#6366f1",
  },
  roleOptionText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  roleOptionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  checkmark: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: "#94a3b8",
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
