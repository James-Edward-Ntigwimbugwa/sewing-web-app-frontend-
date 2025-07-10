import { Component, OnInit } from '@angular/core';
import { RegisterationService } from '../../service/registeration.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private gqlService: RegisterationService) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      // Personal Information
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      nationalIdNumber: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      
      // Location Information
      areaOfResidence: ['', [Validators.required]],
      areaOfWork: ['', [Validators.required]],
      
      // Account Information
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.registrationForm.value;
      const { email, first_name, last_name, password } = formData;

      // For now, we'll use the existing service method, but you can extend it to handle additional fields
      this.gqlService.CreateCustomUser(email, first_name, last_name, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! You can now log in with your credentials.';
          
          // Optionally redirect after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          // Handle unique constraint error for email
          if (error.message.includes('UNIQUE constraint failed')) {
            this.errorMessage = 'This email already exists. Please use a different email address.';
          } else if (error.message.includes('email')) {
            this.errorMessage = 'Email validation failed. Please check your email format.';
          } else {
            this.errorMessage = 'Registration failed. Please check your information and try again.';
          }
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  // Helper method to check if a field is invalid and should show error
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Helper method to get specific error message for a field
  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'first_name': 'First name',
      'last_name': 'Last name',
      'email': 'Email',
      'phoneNumber': 'Phone number',
      'nationalIdNumber': 'National ID number',
      'sex': 'Gender',
      'areaOfResidence': 'Area of residence',
      'areaOfWork': 'Area of work',
      'username': 'Username',
      'password': 'Password',
      'confirmPassword': 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }
}