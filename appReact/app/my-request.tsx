import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import LoginBubble from "../components/LoginBubble";
import {supabase} from './supabase.js';
import { RawDemandeSupabase, DemandeSupabase } from '../types/demande';
import { useUserContext } from "./usercontext";


export default function MyRequest() {
  const [demandes, setDemandes] = useState<DemandeSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type User = {
    id: string;
  };

  const { user } = useUserContext() as { user: User };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const { data, error } = await supabase
        .from('demande_absence')
        .select(`
          id_absence,
          utilisateurtest(
            nom,
            prenom
          ),
          absence_date,
          absence_dateFin,
          raison,
          statut
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        console.log('Données reçues:', data); // Pour le débogage
        const transformedData: DemandeSupabase[] = data.map((item: RawDemandeSupabase) => ({
          id: item.id_absence,
          utilisateurtest: {
            nom: item.utilisateurtest.nom || 'Non renseigné',
            prenom: item.utilisateurtest.prenom || 'Non renseigné'
          },
          absence_date: item.absence_date,
          absence_dateFin: item.absence_dateFin,
          raison: item.raison,
          statut: item.statut
        }));
        
        setDemandes(transformedData);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes Demandes</Text>
          <LoginBubble />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Chargement des demandes...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Mes Demandes</Text>
        <ScrollView>
          {demandes.map((demande) => (
            <View key={demande.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {demande.utilisateurtest.nom} {demande.utilisateurtest.prenom}
                </Text>
                <View style={[
                  styles.statusBadge,
                  demande.statut === 'acc' ? styles.statusValidated :
                  demande.statut === 'rf' ? styles.statusRefused :
                  styles.statusPending
                ]}>
                  <Text style={[
                    styles.statusText,
                    demande.statut === 'acc' ? styles.statusValidated :
                    demande.statut === 'rf' ? styles.statusRefused :
                    styles.statusPending
                  ]}>
                    {demande.statut === 'acc' ? 'Accepté' :
                     demande.statut === 'rf' ? 'Refusé' :
                     demande.statut === 'et' ? 'En cours de traitement' :
                     'En attente'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Période :</Text>
                  <Text style={styles.dateText}>
                    Du {demande.absence_date} au {demande.absence_dateFin}
                  </Text>
                </View>
                
                <View style={styles.motifContainer}>
                  <Text style={styles.motifLabel}>Motif :</Text>
                  <Text style={styles.motifText}>{demande.raison}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusValidated: {
    backgroundColor: "#d1fae5",
  },
  statusRefused: {
    backgroundColor: "#fee2e2",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardContent: {
    gap: 16,
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  motifContainer: {
    marginBottom: 8,
  },
  motifLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  motifText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
});
