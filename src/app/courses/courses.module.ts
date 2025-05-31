import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { coursesRoutes } from './courses.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(coursesRoutes),
    ReactiveFormsModule
  ],
  exports: []
})
export class CoursesModule { }