export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  user: {
    id: string;
    username: string;
    email: string;
    prenom: string;
    nom: string;
    role: string;
    fullName: string;
  };
  success: boolean;
  message: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  prenom: string;
  nom: string;
  role: string;
  fullName: string;
  dateCreation: Date;
  isActive: boolean;
}
