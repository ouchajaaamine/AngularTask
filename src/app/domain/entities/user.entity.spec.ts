import { User } from './user.entity';
import { UserRole } from '../enums/user-role.enum';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = User.create({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      prenom: 'John',
      nom: 'Doe',
      role: UserRole.ETUDIANT,
      dateCreation: new Date('2024-01-01'),
      isActive: true
    });
  });

  describe('Creation', () => {
    it('should create a user with all properties', () => {
      expect(user.id).toBe('1');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.prenom).toBe('John');
      expect(user.nom).toBe('Doe');
      expect(user.role).toBe(UserRole.ETUDIANT);
      expect(user.isActive).toBe(true);
    });

    it('should create a user with default values', () => {
      const newUser = User.create({
        id: '2',
        username: 'newuser',
        email: 'new@example.com',
        prenom: 'Jane',
        nom: 'Smith',
        role: UserRole.FORMATEUR
      });

      expect(newUser.isActive).toBe(true);
      expect(newUser.dateCreation).toBeInstanceOf(Date);
    });
  });

  describe('Methods', () => {
    it('should return correct full name', () => {
      expect(user.fullName).toBe('John Doe');
    });

    it('should return correct display name', () => {
      expect(user.displayName).toBe('John Doe');
    });

    it('should return username when no full name', () => {
      const userWithoutName = User.create({
        id: '3',
        username: 'noname',
        email: 'noname@example.com',
        prenom: '',
        nom: '',
        role: UserRole.ETUDIANT
      });

      expect(userWithoutName.displayName).toBe('noname');
    });

    it('should correctly identify formateur role', () => {
      const formateur = User.create({
        id: '4',
        username: 'formateur',
        email: 'formateur@example.com',
        prenom: 'Teacher',
        nom: 'One',
        role: UserRole.FORMATEUR
      });

      expect(formateur.isFormateur()).toBe(true);
      expect(formateur.isEtudiant()).toBe(false);
    });

    it('should correctly identify etudiant role', () => {
      expect(user.isEtudiant()).toBe(true);
      expect(user.isFormateur()).toBe(false);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const json = user.toJSON();

      expect(json).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        prenom: 'John',
        nom: 'Doe',
        role: UserRole.ETUDIANT,
        dateCreation: new Date('2024-01-01'),
        isActive: true
      });
    });

    it('should create user from JSON data', () => {
      const jsonData = {
        id: '5',
        username: 'fromjson',
        email: 'json@example.com',
        prenom: 'JSON',
        nom: 'User',
        role: UserRole.FORMATEUR,
        dateCreation: new Date('2024-02-01'),
        isActive: false
      };

      const userFromJson = User.create(jsonData);

      expect(userFromJson.id).toBe('5');
      expect(userFromJson.username).toBe('fromjson');
      expect(userFromJson.isActive).toBe(false);
      expect(userFromJson.role).toBe(UserRole.FORMATEUR);
    });
  });

  describe('Immutability', () => {
    it('should be immutable', () => {
      expect(() => {
        (user as any).username = 'changed';
      }).toThrow();
    });

    it('should not allow modification of properties', () => {
      expect(() => {
        (user as any).role = UserRole.FORMATEUR;
      }).toThrow();
    });
  });
});
