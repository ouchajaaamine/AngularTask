import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export const MOCK_USERS: User[] = [
  User.create({
    id: '1',
    username: 'formateur1',
    email: 'formateur1@example.com',
    prenom: 'Jean',
    nom: 'Dupont',
    role: UserRole.FORMATEUR,
    dateCreation: new Date('2024-01-15'),
    isActive: true
  }),
  User.create({
    id: '2',
    username: 'formateur2',
    email: 'formateur2@example.com',
    prenom: 'Marie',
    nom: 'Martin',
    role: UserRole.FORMATEUR,
    dateCreation: new Date('2024-01-20'),
    isActive: true
  }),
  User.create({
    id: '3',
    username: 'etudiant1',
    email: 'etudiant1@example.com',
    prenom: 'Pierre',
    nom: 'Durand',
    role: UserRole.ETUDIANT,
    dateCreation: new Date('2024-02-01'),
    isActive: true
  }),
  User.create({
    id: '4',
    username: 'etudiant2',
    email: 'etudiant2@example.com',
    prenom: 'Sophie',
    nom: 'Leroy',
    role: UserRole.ETUDIANT,
    dateCreation: new Date('2024-02-05'),
    isActive: true
  }),
  User.create({
    id: '5',
    username: 'etudiant3',
    email: 'etudiant3@example.com',
    prenom: 'Lucas',
    nom: 'Bernard',
    role: UserRole.ETUDIANT,
    dateCreation: new Date('2024-02-10'),
    isActive: true
  }),
  User.create({
    id: '6',
    username: 'etudiant4',
    email: 'etudiant4@example.com',
    prenom: 'Emma',
    nom: 'Petit',
    role: UserRole.ETUDIANT,
    dateCreation: new Date('2024-02-15'),
    isActive: true
  })
];

export const MOCK_CREDENTIALS = [
  { username: 'formateur1', password: 'pass123' },
  { username: 'formateur2', password: 'pass123' },
  { username: 'etudiant1', password: 'pass123' },
  { username: 'etudiant2', password: 'pass123' },
  { username: 'etudiant3', password: 'pass123' },
  { username: 'etudiant4', password: 'pass123' }
];
