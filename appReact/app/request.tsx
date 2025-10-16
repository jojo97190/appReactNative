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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 35,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    color: "#333",
  },
  input: {
    minHeight: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    textAlignVertical: "top",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});