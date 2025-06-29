import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TailorRegistrationService } from '../../service/tailor-registration.service';
import { Router } from '@angular/router';

export interface RegisterTailorInput {
  areaOfResidence: string;
  areaOfWork: string;
  email: string;
  fullName: string;
  nationalIdNumber: string;
  password: string;
  phoneNumber: string;
  sex: string;
  username: string;
}

export interface Tailor {
  areaOfResidence: string;
  areaOfWork: string;
  dateOfRegistration: string;
  email: string;
  fullName: string;
  id: string;
  isStaff: boolean;
  isSuperuser: boolean;
  nationalIdNumber: string;
  phoneNumber: string;
  sex: string;
  username: string;
}

export interface RegisterTailorResponse {
  message: string;
  success: boolean;
  tailor: Tailor;
}

@Component({
  selector: 'app-tailor-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './tailor-registration.component.html',
  styleUrls: ['./tailor-registration.component.css'],
})
export class TailorRegistrationComponent {
  registrationForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tailorService: TailorRegistrationService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      nationalIdNumber: ['', Validators.required],
      sex: ['', Validators.required],
      areaOfResidence: ['', Validators.required],
      areaOfWork: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formData: RegisterTailorInput = this.registrationForm.value;

      this.tailorService.registerTailor(formData).subscribe({
        next: (response: RegisterTailorResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = response.message;
            this.registrationForm.reset();

               // Navigate to login page after successful registration
            setTimeout(() => {
              this.router.navigate(['/tailorLogin']);
            }, 2000); // Wait 2 seconds to show success message before navigating
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
        },
        error: (error: { message: string; }) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }
}