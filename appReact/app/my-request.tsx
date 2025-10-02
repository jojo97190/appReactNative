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
  ajouterDemande({id:mesDemandes.length + 1, nom: 'Durand', prenom: 'Marie', dateDeb: '2025-11-05', dateFin: '2025-11-10', motif: 'Formation professionnelle', statut: 'Validé'});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavBar />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Mes Demandes</Text>
        <ScrollView>          
          <ScrollView horizontal>
            <View>
              {/* En-têtes du tableau */}
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.cellNom]}>Nom</Text>
                <Text style={[styles.headerCell, styles.cellPrenom]}>Prénom</Text>
                <Text style={[styles.headerCell, styles.cellDate]}>Début</Text>
                <Text style={[styles.headerCell, styles.cellDate]}>Fin</Text>
                <Text style={[styles.headerCell, styles.cellMotif]}>Motif</Text>
                <Text style={[styles.headerCell, styles.cellStatut]}>Statut</Text>
              </View>
              
              {/* Lignes de données */}
              {mesDemandes.map((demande, index) => (
                <View key={demande.id} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text style={[styles.cell, styles.cellNom]}>{demande.nom}</Text>
                  <Text style={[styles.cell, styles.cellPrenom]}>{demande.prenom}</Text>
                  <Text style={[styles.cell, styles.cellDate]}>{demande.dateDeb}</Text>
                  <Text style={[styles.cell, styles.cellDate]}>{demande.dateFin}</Text>
                  <Text style={[styles.cell, styles.cellMotif]}>{demande.motif}</Text>
                  <Text style={[styles.cell, styles.cellStatut, 
                    demande.statut === 'Validé' ? styles.statutValide : 
                    demande.statut === 'Refusé' ? styles.statutRefuse : 
                    styles.statutEnAttente]}>{demande.statut}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  headerCell: {
    padding: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  cell: {
    padding: 12,
    color: '#212529',
  },
  cellNom: {
    width: 100,
  },
  cellPrenom: {
    width: 100,
  },
  cellDate: {
    width: 100,
  },
  cellMotif: {
    width: 150,
  },
  cellStatut: {
    width: 100,
    textAlign: 'center',
  },
  statutValide: {
    color: '#198754',
    fontWeight: 'bold',
  },
  statutRefuse: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  statutEnAttente: {
    color: '#ffc107',
    fontWeight: 'bold',
  }
});
