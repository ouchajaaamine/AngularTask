export interface Course {
  id: string;
  titre: string;
  description: string;
  formateurId: string;
  dateCreation: Date;
  duree: number; // en heures
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  categories: string[];
  etudiants: string[]; // IDs des étudiants inscrits
  contenu: {
    sections: {
      titre: string;
      description: string;
      ressources: string[];
    }[];
  };
} 