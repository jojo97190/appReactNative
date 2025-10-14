import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import LoginBubble from "../components/LoginBubble";
import {supabase} from './supabase.js';
import { RawDemandeSupabase, DemandeSupabase } from '../types/demande';

export default function MyRequest() {
  const [demandes, setDemandes] = useState<DemandeSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .eq('user_id', '36105cf0-4dbe-456c-b0a8-2e9b71c99724'); // Remplacer par l'ID de l'utilisateur connecté

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
    borderBottomColor: "#dee2e6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusValidated: {
    backgroundColor: '#d4edda',
  },
  statusRefused: {
    backgroundColor: '#f8d7da',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    gap: 12,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  motifContainer: {
    marginBottom: 8,
  },
  motifLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  motifText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
