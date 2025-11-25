import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import NavBar from "../components/NavBar";
import DateSelector from "../components/selectDate";
import SingleDateSelector from "../components/selectSingleDate";
import TimeSelector from "../components/TimeSelector";
import { supabase } from './supabase.js';
import { NewDemande } from '../types/demande';
import { useUserContext } from "./usercontext";

export default function Request() {
  const [motif, setMotif] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReplacement, setHasReplacement] = useState(false);
  const [replacementDate, setReplacementDate] = useState<Date | null>(null);
  const [replacementStartTime, setReplacementStartTime] = useState("");
  const [replacementEndTime, setReplacementEndTime] = useState("");
  const [replacementRoom, setReplacementRoom] = useState("");
  const [replacementClass, setReplacementClass] = useState("");
  const [showReplacementCalendar, setShowReplacementCalendar] = useState(false);
  const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
  const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
  
  type User = {
    id: string;
  };

  const { user } = useUserContext() as { user: User };
  
  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleReplacementDateSelect = (date: Date) => {
    setReplacementDate(date);
    setShowReplacementCalendar(false);
  };

  const handleSubmit = async () => {
    if (startDate && endDate && motif) {
      // Vérifier les champs de remplacement si nécessaire
      if (hasReplacement && (!replacementDate || !replacementStartTime || !replacementEndTime || !replacementRoom || !replacementClass)) {
        Alert.alert(
          "Champs incomplets",
          "Veuillez remplir tous les champs de remplacement (date, heures de début et fin, salle, classe)"
        );
        return;
      }

      // Vérifier que l'heure de fin est après l'heure de début
      if (hasReplacement && replacementStartTime && replacementEndTime) {
        const [startHour, startMinute] = replacementStartTime.split(':').map(Number);
        const [endHour, endMinute] = replacementEndTime.split(':').map(Number);
        
        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        
        if (endTimeInMinutes <= startTimeInMinutes) {
          Alert.alert(
            "Horaire invalide",
            "L'heure de fin doit être après l'heure de début"
          );
          return;
        }
      }

      setIsLoading(true);
      try {
        const utilisateurId = user.id;
        const now = new Date().toISOString();

        const newDemande = {
          user_id: utilisateurId,
          date_remplacement: hasReplacement && replacementDate ? replacementDate.toISOString().split('T')[0] : null,
          heure_remplacement_deb: hasReplacement ? `${replacementStartTime}` : null,
          heure_remplacement_fin: hasReplacement ? `${replacementEndTime}` : null,
          salle_remplacement: hasReplacement ? replacementRoom.trim() : null,
          classe: hasReplacement ? replacementClass.trim() : null,
          absence_date: startDate.toISOString().split('T')[0],
          absence_dateFin: endDate.toISOString().split('T')[0],
          statut: 'et' as const,
          raison: motif.trim(),
          commentaire: null,
          date_creation: now,
          date_maj: now
        };
        
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
              setHasReplacement(false);
              setReplacementDate(null);
              setReplacementStartTime("");
              setReplacementEndTime("");
              setReplacementRoom("");
              setReplacementClass("");
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <NavBar />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
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

          {/* Section Remplacement */}
          <View style={styles.replacementSection}>
            <Text style={styles.sectionTitle}>📅 Horaire de remplacement</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Ajouter un horaire de remplacement ?</Text>
              <TouchableOpacity
                style={[styles.switchButton, hasReplacement && styles.switchButtonActive]}
                onPress={() => setHasReplacement(!hasReplacement)}
              >
                <Text style={[styles.switchButtonText, hasReplacement && styles.switchButtonTextActive]}>
                  {hasReplacement ? "Oui" : "Non"}
                </Text>
              </TouchableOpacity>
            </View>

            {hasReplacement && (
              <View style={styles.replacementFields}>
                {/* Date de remplacement */}
                <Text style={styles.label}>Date de remplacement :</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowReplacementCalendar(!showReplacementCalendar)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {replacementDate ? replacementDate.toLocaleDateString('fr-FR') : "Sélectionner une date"}
                  </Text>
                  <Text style={styles.datePickerIcon}>📅</Text>
                </TouchableOpacity>

                {showReplacementCalendar && (
                  <SingleDateSelector onDateSelect={handleReplacementDateSelect} />
                )}

                {/* Heure de début */}
                <Text style={styles.label}>Heure de début :</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowStartTimeSelector(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {replacementStartTime || "Sélectionner l'heure"}
                  </Text>
                  <Text style={styles.datePickerIcon}>🕐</Text>
                </TouchableOpacity>

                {/* Heure de fin */}
                <Text style={styles.label}>Heure de fin :</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowEndTimeSelector(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {replacementEndTime || "Sélectionner l'heure"}
                  </Text>
                  <Text style={styles.datePickerIcon}>🕐</Text>
                </TouchableOpacity>

                {/* Numéro de salle */}
                <Text style={styles.label}>Numéro de salle :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 201"
                  value={replacementRoom}
                  onChangeText={(text) => {
                    // N'accepter que les chiffres
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setReplacementRoom(numericValue);
                  }}
                  keyboardType="numeric"
                />

                {/* Nom de la classe */}
                <Text style={styles.label}>Nom de la classe :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: BTS SIO1"
                  value={replacementClass}
                  onChangeText={setReplacementClass}
                />
              </View>
            )}
          </View>

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

      {/* Time Selectors */}
      <TimeSelector
        visible={showStartTimeSelector}
        onClose={() => setShowStartTimeSelector(false)}
        onSelectTime={setReplacementStartTime}
        selectedTime={replacementStartTime}
        title="Heure de début"
      />
      
      <TimeSelector
        visible={showEndTimeSelector}
        onClose={() => setShowEndTimeSelector(false)}
        onSelectTime={setReplacementEndTime}
        selectedTime={replacementEndTime}
        title="Heure de fin"
      />
    </KeyboardAvoidingView>
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
  replacementSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "600",
  },
  switchButton: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  switchButtonActive: {
    backgroundColor: "#6366f1",
  },
  switchButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748b",
  },
  switchButtonTextActive: {
    color: "#ffffff",
  },
  replacementFields: {
    marginTop: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    borderColor: "#e2e8f0",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#1e293b",
  },
  datePickerIcon: {
    fontSize: 20,
  },
});