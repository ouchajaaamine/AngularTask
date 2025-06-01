import { CourseLevel } from '../enums/course-level.enum';
import { CourseSection } from './course-section.entity';

export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly duration: number,
    public readonly level: CourseLevel,
    public readonly categories: string[],
    public readonly sections: CourseSection[],
    public readonly formateurId: string,
    public readonly dateCreation: Date = new Date(),
    public readonly isActive: boolean = true,
    public readonly enrolledStudents: string[] = []
  ) {}

  get totalSections(): number {
    return this.sections.length;
  }

  get totalResources(): number {
    return this.sections.reduce((total, section) => total + section.resources.length, 0);
  }

  get isAdvanced(): boolean {
    return this.level === CourseLevel.AVANCE;
  }

  get isIntermediate(): boolean {
    return this.level === CourseLevel.INTERMEDIAIRE;
  }

  get isBeginner(): boolean {
    return this.level === CourseLevel.DEBUTANT;
  }

  isStudentEnrolled(studentId: string): boolean {
    return this.enrolledStudents.includes(studentId);
  }

  enrollStudent(studentId: string): Course {
    if (this.isStudentEnrolled(studentId)) {
      return this;
    }
    
    return new Course(
      this.id,
      this.title,
      this.description,
      this.duration,
      this.level,
      this.categories,
      this.sections,
      this.formateurId,
      this.dateCreation,
      this.isActive,
      [...this.enrolledStudents, studentId]
    );
  }

  unenrollStudent(studentId: string): Course {
    return new Course(
      this.id,
      this.title,
      this.description,
      this.duration,
      this.level,
      this.categories,
      this.sections,
      this.formateurId,
      this.dateCreation,
      this.isActive,
      this.enrolledStudents.filter(id => id !== studentId)
    );
  }

  addSection(section: CourseSection): Course {
    return new Course(
      this.id,
      this.title,
      this.description,
      this.duration,
      this.level,
      this.categories,
      [...this.sections, section],
      this.formateurId,
      this.dateCreation,
      this.isActive,
      this.enrolledStudents
    );
  }

  static create(data: {
    id: string;
    title: string;
    description: string;
    duration: number;
    level: CourseLevel;
    categories: string[];
    sections: CourseSection[];
    formateurId: string;
    dateCreation?: Date;
    isActive?: boolean;
    enrolledStudents?: string[];
  }): Course {
    return new Course(
      data.id,
      data.title,
      data.description,
      data.duration,
      data.level,
      data.categories,
      data.sections,
      data.formateurId,
      data.dateCreation,
      data.isActive,
      data.enrolledStudents
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      duration: this.duration,
      level: this.level,
      categories: this.categories,
      content: {
        sections: this.sections.map(section => section.toJSON())
      },
      formateurId: this.formateurId,
      dateCreation: this.dateCreation,
      isActive: this.isActive,
      enrolledStudents: this.enrolledStudents
    };
  }
}
