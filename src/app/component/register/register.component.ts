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
  registrationType: 'tailor' | 'customer' = 'customer'; // Default to customer

  constructor(private fb: FormBuilder, private router: Router, private gqlService: RegisterationService) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.registrationForm = this.fb.group({
      // Personal Information (required for both)
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      
      // National ID (only required for tailors)
      nationalIdNumber: [''],
      
      // Location Information (only required for tailors)
      areaOfResidence: [''],
      areaOfWork: [''],
      
      // Account Information (required for both)
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Update validators based on registration type
    this.updateValidators();
  }

  toggleRegistrationType() {
    this.registrationType = this.registrationType === 'tailor' ? 'customer' : 'tailor';
    this.updateValidators();
    this.clearMessages();
  }

  updateValidators() {
    const nationalIdControl = this.registrationForm.get('nationalIdNumber');
    const areaOfResidenceControl = this.registrationForm.get('areaOfResidence');
    const areaOfWorkControl = this.registrationForm.get('areaOfWork');

    if (this.registrationType === 'tailor') {
      // For tailors, make these fields required
      nationalIdControl?.setValidators([Validators.required]);
      areaOfResidenceControl?.setValidators([Validators.required]);
      areaOfWorkControl?.setValidators([Validators.required]);
    } else {
      // For customers, remove required validators
      nationalIdControl?.clearValidators();
      areaOfResidenceControl?.clearValidators();
      areaOfWorkControl?.clearValidators();
    }

    // Update validity
    nationalIdControl?.updateValueAndValidity();
    areaOfResidenceControl?.updateValueAndValidity();
    areaOfWorkControl?.updateValueAndValidity();
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

      if (this.registrationType === 'tailor') {
        this.registerTailor(formData);
      } else {
        this.registerCustomer(formData);
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  private registerTailor(formData: any) {
    const { 
      first_name, 
      last_name, 
      email, 
      phoneNumber, 
      sex, 
      nationalIdNumber, 
      areaOfResidence, 
      areaOfWork, 
      username, 
      password 
    } = formData;

    // Combine first_name and last_name to create fullName
    const fullName = `${first_name} ${last_name}`;

    this.gqlService.RegisterTailor(
      fullName,
      username,
      email,
      nationalIdNumber,
      phoneNumber,
      sex,
      areaOfResidence,
      areaOfWork,
      password
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        const result = response.data?.registerTailor;
        
        if (result?.success) {
          this.successMessage = 'Tailor registration successful! You can now log in with your credentials.';
          
          // Optionally redirect after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = result?.message || 'Tailor registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Tailor registration error:', error);
        
        // Handle specific error messages
        if (error.message?.includes('Username already exists')) {
          this.errorMessage = 'This username is already taken. Please choose a different username.';
        } else if (error.message?.includes('Email already exists')) {
          this.errorMessage = 'This email is already registered. Please use a different email address.';
        } else if (error.message?.includes('email')) {
          this.errorMessage = 'Email validation failed. Please check your email format.';
        } else {
          this.errorMessage = 'Tailor registration failed. Please check your information and try again.';
        }
      }
    });
  }

  private registerCustomer(formData: any) {
    const { email, first_name, last_name, password } = formData;

    this.gqlService.CreateCustomUser(email, first_name, last_name, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        const result = response.data?.createCustomUser;
        
        if (result?.success) {
          this.successMessage = 'Customer registration successful! You can now log in with your credentials.';
          
          // Optionally redirect after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = result?.message || 'Customer registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Customer registration error:', error);
        
        // Handle specific error messages
        if (error.message?.includes('User with this email already exists')) {
          this.errorMessage = 'This email is already registered. Please use a different email address.';
        } else if (error.message?.includes('UNIQUE constraint failed')) {
          this.errorMessage = 'This email already exists. Please use a different email address.';
        } else if (error.message?.includes('email')) {
          this.errorMessage = 'Email validation failed. Please check your email format.';
        } else {
          this.errorMessage = 'Customer registration failed. Please check your information and try again.';
        }
      }
    });
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

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
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
    
    // Check for password mismatch
    if (fieldName === 'confirmPassword' && this.registrationForm.errors?.['mismatch']) {
      return 'Passwords do not match';
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