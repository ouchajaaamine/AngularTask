export enum UserRole {
  FORMATEUR = 'FORMATEUR',
  ETUDIANT = 'ETUDIANT'
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  dateInscription: Date;
} 