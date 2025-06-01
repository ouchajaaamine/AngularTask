import { UserRole } from '../enums/user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly prenom: string,
    public readonly nom: string,
    public readonly role: UserRole,
    public readonly dateCreation: Date = new Date(),
    public readonly isActive: boolean = true
  ) {}

  get fullName(): string {
    return `${this.prenom} ${this.nom}`;
  }

  get displayName(): string {
    return this.fullName || this.username;
  }

  isFormateur(): boolean {
    return this.role === UserRole.FORMATEUR;
  }

  isEtudiant(): boolean {
    return this.role === UserRole.ETUDIANT;
  }

  static create(data: {
    id: string;
    username: string;
    email: string;
    prenom: string;
    nom: string;
    role: UserRole;
    dateCreation?: Date;
    isActive?: boolean;
  }): User {
    return new User(
      data.id,
      data.username,
      data.email,
      data.prenom,
      data.nom,
      data.role,
      data.dateCreation,
      data.isActive
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      prenom: this.prenom,
      nom: this.nom,
      role: this.role,
      dateCreation: this.dateCreation,
      isActive: this.isActive
    };
  }
}
