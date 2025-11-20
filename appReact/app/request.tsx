import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import NavBar from "../components/NavBar";
import DateSelector from "../components/selectDate";
import { supabase } from './supabase.js';
import { NewDemande } from '../types/demande';
import { useUserContext } from "./usercontext";

export default function Request() {
  const [motif, setMotif] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  type User = {
    id: string;
  };

  const { user } = useUserContext() as { user: User };
  
  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = async () => {
    if (startDate && endDate && motif) {
      setIsLoading(true);
      try {
        const utilisateurId = user.id;
        const now = new Date().toISOString();

        const newDemande = {
          user_id: utilisateurId,
          date_remplacement: null,
          absence_date: startDate.toISOString().split('T')[0],
          absence_dateFin: endDate.toISOString().split('T')[0],
          statut: 'et' as const,
          raison: motif.trim(),
          commentaire: null,
          date_creation: now,
          date_maj: now
        };
        
        // SOLUTION 1: Sans .select() - essayez d'abord celle-ci
        const { error } = await supabase
          .from('demande_absence')
          .insert(newDemande);

        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }

        Alert.alert(
          "Succès",
          "Votre demande a été enregistrée avec succès",
          [{ 
            text: "OK", 
            onPress: () => {
              setMotif("");
              setStartDate(null);
              setEndDate(null);
            }
          }]
        );
      } catch (error: any) {
        console.error("Erreur complète lors de l'envoi :", error);
        Alert.alert(
          "Erreur",
          error.message || "Une erreur est survenue lors de l'envoi de votre demande"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Champs incomplets",
        "Veuillez remplir tous les champs (dates et motif)"
      );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Nouvelle Demande</Text>
          <DateSelector onDateRangeSelect={handleDateRangeSelect} />

          <Text style={styles.label}>Motif :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le motif"
            value={motif}
            onChangeText={setMotif}
          />

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Envoyer la demande</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
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
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: "#475569",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  input: {
    minHeight: 56,
    borderColor: "#e2e8f0",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});