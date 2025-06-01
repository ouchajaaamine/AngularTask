import { Course } from '../../domain/entities/course.entity';
import { CourseSection } from '../../domain/entities/course-section.entity';
import { CourseLevel } from '../../domain/enums/course-level.enum';

const createSections = (courseId: string, sectionsData: any[]): CourseSection[] => {
  return sectionsData.map((section, index) => 
    CourseSection.create({
      id: `${courseId}_section_${index + 1}`,
      title: section.title,
      description: section.description,
      resources: section.resources || [],
      order: index + 1
    })
  );
};

export const MOCK_COURSES: Course[] = [
  Course.create({
    id: '1',
    title: 'Introduction à Angular',
    description: 'Apprenez les bases du framework Angular pour développer des applications web modernes.',
    duration: 40,
    level: CourseLevel.DEBUTANT,
    categories: ['Frontend', 'JavaScript', 'TypeScript'],
    sections: createSections('1', [
      {
        title: 'Introduction à Angular',
        description: 'Découverte du framework et de ses concepts de base',
        resources: ['Guide officiel Angular', 'Documentation TypeScript']
      },
      {
        title: 'Composants et Templates',
        description: 'Création et gestion des composants Angular',
        resources: ['Exemples de composants', 'Guide des templates']
      },
      {
        title: 'Services et Injection de dépendances',
        description: 'Utilisation des services pour organiser la logique métier',
        resources: ['Documentation des services', 'Exemples d\'injection']
      }
    ]),
    formateurId: '1',
    dateCreation: new Date('2024-01-20'),
    enrolledStudents: ['3', '4']
  }),
  Course.create({
    id: '2',
    title: 'React Avancé',
    description: 'Maîtrisez les concepts avancés de React : hooks, context, performance.',
    duration: 60,
    level: CourseLevel.AVANCE,
    categories: ['Frontend', 'JavaScript', 'React'],
    sections: createSections('2', [
      {
        title: 'Hooks avancés',
        description: 'useCallback, useMemo, useReducer et hooks personnalisés',
        resources: ['Documentation React Hooks', 'Exemples pratiques']
      },
      {
        title: 'Context API et State Management',
        description: 'Gestion d\'état globale avec Context et Redux',
        resources: ['Guide Context API', 'Documentation Redux']
      }
    ]),
    formateurId: '2',
    dateCreation: new Date('2024-01-25'),
    enrolledStudents: ['5']
  }),
  Course.create({
    id: '3',
    title: 'CSS Grid et Flexbox',
    description: 'Maîtrisez les layouts modernes avec CSS Grid et Flexbox.',
    duration: 25,
    level: CourseLevel.INTERMEDIAIRE,
    categories: ['CSS', 'Frontend', 'Design'],
    sections: createSections('3', [
      {
        title: 'Flexbox en détail',
        description: 'Tous les concepts de Flexbox pour des layouts flexibles',
        resources: ['Guide Flexbox', 'Exemples interactifs']
      },
      {
        title: 'CSS Grid Layout',
        description: 'Création de grilles complexes avec CSS Grid',
        resources: ['Documentation CSS Grid', 'Générateur de grilles']
      }
    ]),
    formateurId: '1',
    dateCreation: new Date('2024-02-01'),
    enrolledStudents: ['3', '6']
  }),
  Course.create({
    id: '4',
    title: 'Node.js et Express',
    description: 'Développement backend avec Node.js et le framework Express.',
    duration: 50,
    level: CourseLevel.INTERMEDIAIRE,
    categories: ['Backend', 'JavaScript', 'Node.js'],
    sections: createSections('4', [
      {
        title: 'Introduction à Node.js',
        description: 'Concepts de base et écosystème Node.js',
        resources: ['Documentation Node.js', 'Guide NPM']
      },
      {
        title: 'Framework Express',
        description: 'Création d\'APIs REST avec Express',
        resources: ['Documentation Express', 'Exemples d\'APIs']
      },
      {
        title: 'Base de données et MongoDB',
        description: 'Intégration avec MongoDB et Mongoose',
        resources: ['Guide MongoDB', 'Documentation Mongoose']
      }
    ]),
    formateurId: '2',
    dateCreation: new Date('2024-02-10'),
    enrolledStudents: ['4', '5', '6']
  })
];
