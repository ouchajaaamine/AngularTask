import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Email format is invalid');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
      }
      if (!/[A-Za-z]/.test(password)) {
        errors.push('Password must contain at least one letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
    } else {
      if (username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      }
      if (username.length > 50) {
        errors.push('Username must be less than 50 characters');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateName(name: string, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push(`${fieldName} is required`);
    } else {
      if (name.length < 2) {
        errors.push(`${fieldName} must be at least 2 characters long`);
      }
      if (name.length > 100) {
        errors.push(`${fieldName} must be less than 100 characters`);
      }
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
        errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCourseTitle(title: string): ValidationResult {
    const errors: string[] = [];
    
    if (!title) {
      errors.push('Course title is required');
    } else {
      if (title.length < 5) {
        errors.push('Course title must be at least 5 characters long');
      }
      if (title.length > 200) {
        errors.push('Course title must be less than 200 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCourseDescription(description: string): ValidationResult {
    const errors: string[] = [];
    
    if (!description) {
      errors.push('Course description is required');
    } else {
      if (description.length < 20) {
        errors.push('Course description must be at least 20 characters long');
      }
      if (description.length > 2000) {
        errors.push('Course description must be less than 2000 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCourseDuration(duration: number): ValidationResult {
    const errors: string[] = [];
    
    if (!duration) {
      errors.push('Course duration is required');
    } else {
      if (duration < 1) {
        errors.push('Course duration must be at least 1 hour');
      }
      if (duration > 1000) {
        errors.push('Course duration must be less than 1000 hours');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  validateAndSanitize(input: string, validator: (input: string) => ValidationResult): { value: string; validation: ValidationResult } {
    const sanitized = this.sanitizeInput(input);
    const validation = validator(sanitized);
    
    return {
      value: sanitized,
      validation
    };
  }
}
