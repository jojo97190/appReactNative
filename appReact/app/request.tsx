import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import NavBar from "../components/NavBar";
import DateSelector from "../components/selectDate";
import {supabase} from './supabase.js';
import { NewDemande } from '../types/demande';

export default function Request() {
  const [motif, setMotif] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmit = async () => {
    if (startDate && endDate && motif) {
      setIsLoading(true);
      try {
        const utilisateurId = '36105cf0-4dbe-456c-b0a8-2e9b71c99724';

        const newDemande: NewDemande = {
          user_id: utilisateurId,
          absence_date: startDate.toISOString().split('-')[0],
          absence_dateFin: endDate.toISOString().split('-')[0],
          statut: 'et',
          raison: motif,
          commentaire: null,
          date_creation: new Date().toISOString(),
          date_maj: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('demande_absence')
          .insert([newDemande])
          .select();

        if (error) throw error;

        Alert.alert(
          "Succès",
          "Votre demande a été enregistrée avec succès",
          [{ 
            text: "OK", 
            onPress: () => {
              // Réinitialisation correcte du formulaire
              setMotif("");
              setStartDate(null);
              setEndDate(null);
            }
          }]
        );
      } catch (error: any) {
        console.error("Erreur lors de l'envoi :", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de l'envoi de votre demande"
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

        <Text>Motif :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le motif"
          value={motif}
          onChangeText={setMotif}
        />

        <TouchableOpacity 
          style={styles.submitButton}
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
  },
  content: {
    flex: 1,
    padding: 35,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
