export enum CourseLevel {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE'
}

export const CourseLevelLabels = {
  [CourseLevel.DEBUTANT]: 'Débutant',
  [CourseLevel.INTERMEDIAIRE]: 'Intermédiaire',
  [CourseLevel.AVANCE]: 'Avancé'
};

export const CourseLevelDescriptions = {
  [CourseLevel.DEBUTANT]: 'Aucune connaissance préalable requise',
  [CourseLevel.INTERMEDIAIRE]: 'Connaissances de base requises',
  [CourseLevel.AVANCE]: 'Connaissances approfondies requises'
};

export const CourseLevelColors = {
  [CourseLevel.DEBUTANT]: '#10b981',
  [CourseLevel.INTERMEDIAIRE]: '#f59e0b',
  [CourseLevel.AVANCE]: '#ef4444'
};
