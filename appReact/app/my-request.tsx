import { Text, View, StyleSheet, ScrollView } from "react-native";
import NavBar from "../components/NavBar";

export default function MyRequest() {
  interface Demande {
    id : number,
    nom : string,
    prenom : string,
    dateDeb : string,
    dateFin : string,
    motif : string,
    statut : string
  }
  const mesDemandes : Demande[] = []

  const ajouterDemande = (nouvelleDemande: Demande) => {
    mesDemandes.push(nouvelleDemande);
  };

  ajouterDemande({id:mesDemandes.length + 1, nom: 'Dupont', prenom: 'Jean', dateDeb: '2025-10-15', dateFin: '2025-10-20', motif: 'Congés annuels', statut: 'En attente'});
  ajouterDemande({id:mesDemandes.length + 1, nom: 'Lefevre', prenom: 'Alice', dateDeb: '2025-09-10', dateFin: '2025-09-12', motif: 'Rendez-vous médical', statut: 'Refusé'});
  ajouterDemande({id:mesDemandes.length + 1, nom: 'Durand', prenom: 'Marie', dateDeb: '2025-11-05', dateFin: '2025-11-10', motif: 'Formation professionnelle', statut: 'Validé'});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Mes Demandes</Text>
        <ScrollView>
          {mesDemandes.map((demande) => (
            <View key={demande.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{demande.nom} {demande.prenom}</Text>
                <View style={[
                  styles.statusBadge,
                  demande.statut === 'Validé' ? styles.statusValidated :
                  demande.statut === 'Refusé' ? styles.statusRefused :
                  styles.statusPending
                ]}>
                  <Text style={styles.statusText}>{demande.statut}</Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Période :</Text>
                  <Text style={styles.dateText}>Du {demande.dateDeb} au {demande.dateFin}</Text>
                </View>
                
                <View style={styles.motifContainer}>
                  <Text style={styles.motifLabel}>Motif :</Text>
                  <Text style={styles.motifText}>{demande.motif}</Text>
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
    position: "fixed",
    top: 0,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
  }
});
