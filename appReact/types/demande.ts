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
  date_remplacement?: string | null;
  heure_remplacement_deb?: string | null;
  heure_remplacement_fin?: string | null;
  salle_remplacement?: string | null;
  classe?: string | null;
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
  date_remplacement?: string | null;
  heure_remplacement_deb?: string | null;
  heure_remplacement_fin?: string | null;
  salle_remplacement?: string | null;
  classe?: string | null;
}

export interface NewDemande {
  user_id: string;
  id_absence : string | null;
  absence_date: string;
  absence_dateFin: string;
  date_remplacement:string | null;
  statut: 'et' | 'acc' | 'rf';
  raison: string;
  commentaire: string | null;
  date_creation: string;
  date_maj: string;
}