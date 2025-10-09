export interface RawDemandeSupabase {
  id_absence: string;
  utilisateurtest: Array<{
    nom: string;
    prenom: string;
  }>;
  absence_date: string;
  absence_dateFin: string;
  raison: string;
  statut: string;
}

export interface DemandeSupabase {
  id: string;
  utilisateurtest: {
    nom: string;
    prenom: string;
  };
  absence_date: string;
  absence_dateFin: string;
  raison: string;
  statut: string;
}

export interface NewDemande {
  user_id: string;
  absence_date: string;
  absence_dateFin: string;
  statut: 'et' | 'acc' | 'rf';
  raison: string;
  commentaire: string | null;
  date_creation: string;
  date_maj: string;
}