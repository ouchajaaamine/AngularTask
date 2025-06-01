# 🏗️ Clean Architecture - Frontend Only

## 📋 **Vue d'ensemble**

Ce projet a été transformé pour suivre les principes de la **Clean Architecture** adaptée pour un projet **100% frontend**.

## 🎯 **Principes respectés**

### ✅ **1. Séparation des responsabilités**
- **Domain** : Logique métier pure
- **Application** : Cas d'usage et orchestration
- **Infrastructure** : Stockage local et données simulées
- **Presentation** : Composants UI Angular

### ✅ **2. Inversion de dépendances**
- Les couches externes dépendent des couches internes
- Utilisation d'interfaces et d'injection de dépendances
- Tokens d'injection pour les abstractions

### ✅ **3. Indépendance du framework**
- Logique métier indépendante d'Angular
- Entités pures sans dépendances externes
- Use cases testables unitairement

## 📁 **Structure du projet**

```
src/app/
├── core/                           # Module principal et tokens
│   ├── core.module.ts             # Configuration DI
│   └── injection-tokens.ts        # Tokens d'injection
│
├── domain/                         # Couche métier (pure)
│   ├── entities/                  # Entités métier
│   │   ├── user.entity.ts
│   │   ├── course.entity.ts
│   │   └── course-section.entity.ts
│   ├── enums/                     # Énumérations
│   │   ├── user-role.enum.ts
│   │   └── course-level.enum.ts
│   └── interfaces/                # Contrats/abstractions
│       ├── user-repository.interface.ts
│       ├── course-repository.interface.ts
│       └── storage.interface.ts
│
├── application/                    # Couche application
│   ├── use-cases/                 # Cas d'usage métier
│   │   ├── authenticate-user.use-case.ts
│   │   ├── get-current-user.use-case.ts
│   │   └── logout-user.use-case.ts
│   ├── services/                  # Services applicatifs
│   │   └── auth-application.service.ts
│   └── dtos/                      # Objets de transfert
│       └── login.dto.ts
│
├── infrastructure/                 # Couche infrastructure
│   ├── storage/                   # Services de stockage
│   │   └── local-storage.service.ts
│   ├── repositories/              # Implémentations des repositories
│   │   └── user.repository.ts
│   └── mock-data/                 # Données simulées
│       ├── users.data.ts
│       └── courses.data.ts
│
├── features/                       # Modules fonctionnels (UI)
│   ├── auth/
│   ├── courses/
│   └── dashboard/
│
└── shared/                        # Composants réutilisables
    ├── components/
    └── utils/
```

## 🔄 **Flux de données**

### **1. Authentification**
```
LoginComponent → AuthApplicationService → AuthenticateUserUseCase → UserRepository → LocalStorageService
```

### **2. Gestion d'état**
```
Component → ApplicationService → UseCase → Repository → Storage
```

## 🎯 **Entités principales**

### **User Entity**
- Propriétés immutables
- Méthodes métier (isFormateur, isEtudiant)
- Factory method (create)
- Sérialisation (toJSON)

### **Course Entity**
- Gestion des sections
- Inscription/désinscription d'étudiants
- Validation des niveaux
- Méthodes métier pures

## 🔧 **Use Cases implémentés**

### **AuthenticateUserUseCase**
- Validation des entrées
- Authentification sécurisée
- Gestion des erreurs
- Retour structuré

### **GetCurrentUserUseCase**
- Récupération de l'utilisateur actuel
- Observable pattern
- Gestion de l'état

### **LogoutUserUseCase**
- Déconnexion sécurisée
- Nettoyage du stockage
- Notification de succès

## 🏪 **Repositories**

### **UserRepository**
- Implémentation de IUserRepository
- Stockage local sécurisé
- Simulation de délais réseau
- Gestion des erreurs

### **Stockage**
- LocalStorageService avec chiffrement basique
- Gestion d'expiration
- Méthodes sécurisées
- Préfixage des clés

## 🔐 **Injection de dépendances**

### **Tokens d'injection**
```typescript
USER_REPOSITORY_TOKEN
COURSE_REPOSITORY_TOKEN
LOCAL_STORAGE_TOKEN
```

### **Configuration dans CoreModule**
```typescript
{
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserRepository
}
```

## ✅ **Avantages obtenus**

### **1. Testabilité**
- Use cases purs et testables
- Mocking facile des dépendances
- Isolation des couches

### **2. Maintenabilité**
- Séparation claire des responsabilités
- Code modulaire et réutilisable
- Évolution facilitée

### **3. Flexibilité**
- Changement d'implémentation facile
- Ajout de nouvelles fonctionnalités
- Migration vers backend simplifiée

### **4. Qualité du code**
- Respect des principes SOLID
- Code plus lisible
- Réduction du couplage

## 🚀 **Prochaines étapes**

### **Phase 1 - Complétion**
- [ ] Implémenter CourseRepository
- [ ] Créer les use cases pour les cours
- [ ] Ajouter la validation métier

### **Phase 2 - Tests**
- [ ] Tests unitaires des entités
- [ ] Tests des use cases
- [ ] Tests d'intégration

### **Phase 3 - Optimisation**
- [ ] State management (NgRx)
- [ ] Caching intelligent
- [ ] Performance monitoring

## 📚 **Ressources**

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Angular Architecture Patterns](https://angular.io/guide/architecture)
- [Dependency Injection in Angular](https://angular.io/guide/dependency-injection)

---

**✨ Architecture Clean implémentée avec succès ! ✨**
