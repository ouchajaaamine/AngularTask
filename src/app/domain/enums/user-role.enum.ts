export enum UserRole {
  FORMATEUR = 'formateur',
  ETUDIANT = 'etudiant'
}

export const UserRoleLabels = {
  [UserRole.FORMATEUR]: 'Formateur',
  [UserRole.ETUDIANT]: 'Étudiant'
};

export const UserRoleDescriptions = {
  [UserRole.FORMATEUR]: 'Peut créer et gérer des cours, voir les étudiants inscrits',
  [UserRole.ETUDIANT]: 'Peut s\'inscrire aux cours et accéder au contenu'
};
