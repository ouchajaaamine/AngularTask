import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService, Course } from '../../services/courses.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit, OnChanges {
  @Input() courseId: string | null = null;
  @Output() courseSaved = new EventEmitter<void>();

  courseForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      level: ['DEBUTANT', Validators.required],
      categories: this.fb.array([]),
      content: this.fb.array([])
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId']) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    // Réinitialiser le formulaire
    this.courseForm.reset();
    this.clearFormArrays();

    // Utiliser l'Input courseId ou récupérer depuis la route
    if (!this.courseId) {
      this.courseId = this.route.snapshot.paramMap.get('id');
    }

    this.isEditMode = !!this.courseId;

    if (this.isEditMode && this.courseId) {
      this.loadCourse(this.courseId);
    } else {
      // Ajouter une catégorie et une section par défaut pour le mode création
      this.addCategory();
      this.addSection();
    }
  }

  private clearFormArrays() {
    // Vider les FormArrays
    while (this.categoriesFormArray.length !== 0) {
      this.categoriesFormArray.removeAt(0);
    }
    while (this.sectionsFormArray.length !== 0) {
      this.sectionsFormArray.removeAt(0);
    }
  }

  private loadCourse(id: string) {
    this.coursesService.getCourseById(id).subscribe({
      next: (course) => {
        this.populateForm(course);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.router.navigate(['/courses']);
      }
    });
  }

  private populateForm(course: Course) {
    console.log('Remplissage du formulaire avec:', course);

    // Remplir les champs de base
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level
    });

    // Remplir les catégories
    if (course.categories && course.categories.length > 0) {
      course.categories.forEach(category => {
        this.categoriesFormArray.push(this.fb.control(category));
      });
    } else {
      // Ajouter une catégorie vide si aucune n'existe
      this.addCategory();
    }

    // Remplir les sections
    if (course.content && course.content.sections && course.content.sections.length > 0) {
      course.content.sections.forEach(section => {
        const resourcesArray = this.fb.array(
          section.resources ? section.resources.map(resource => this.fb.control(resource)) : []
        );

        const sectionGroup = this.fb.group({
          title: [section.title, Validators.required],
          description: [section.description, Validators.required],
          resources: resourcesArray
        });
        this.sectionsFormArray.push(sectionGroup);
      });
    } else {
      // Ajouter une section vide si aucune n'existe
      this.addSection();
    }

    console.log('Formulaire après remplissage:', this.courseForm.value);
  }

  get categoriesFormArray() {
    return this.courseForm.get('categories') as FormArray;
  }

  get sectionsFormArray() {
    return this.courseForm.get('content') as FormArray;
  }

  addCategory() {
    this.categoriesFormArray.push(this.fb.control(''));
  }

  removeCategory(index: number) {
    this.categoriesFormArray.removeAt(index);
  }

  addSection() {
    const sectionGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      resources: this.fb.array([])
    });
    this.sectionsFormArray.push(sectionGroup);
  }

  removeSection(index: number) {
    this.sectionsFormArray.removeAt(index);
  }

  getResourcesFormArray(sectionIndex: number): FormArray {
    return this.sectionsFormArray.at(sectionIndex).get('resources') as FormArray;
  }

  addResource(sectionIndex: number) {
    const resourcesArray = this.getResourcesFormArray(sectionIndex);
    resourcesArray.push(this.fb.control(''));
  }

  removeResource(sectionIndex: number, resourceIndex: number) {
    const resourcesArray = this.getResourcesFormArray(sectionIndex);
    resourcesArray.removeAt(resourceIndex);
  }

  cancel() {
    this.courseSaved.emit();
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.courseForm.value;

    // Filtrer les catégories vides
    formValue.categories = formValue.categories.filter((cat: string) => cat.trim() !== '');

    if (this.isEditMode && this.courseId) {
      // Mode édition
      this.coursesService.updateCourse(this.courseId, formValue).subscribe({
        next: () => {
          this.courseSaved.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la modification du cours:', error);
          alert('Erreur lors de la modification du cours');
          this.isSubmitting = false;
        }
      });
    } else {
      // Mode création
      const courseData = {
        ...formValue,
        formateurId: this.authService.currentUserValue?.id,
        students: []
      };

      this.coursesService.createCourse(courseData).subscribe({
        next: () => {
          this.courseSaved.emit();
        },
        error: (error) => {
          console.error('Erreur lors de la création du cours:', error);
          alert('Erreur lors de la création du cours');
          this.isSubmitting = false;
        }
      });
    }
  }
} 