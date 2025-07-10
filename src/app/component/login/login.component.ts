import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { LoginService } from '../../service/login.service';
import { TailorLoginService } from '../../service/tailor-login.service';

export interface LoginResponse {
  message: string;
  refresh: string;
  success: boolean;
  token: string;
}

@Component({
  selector: 'app-unified-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  loginType: 'email' | 'username' = 'email'; // Toggle between email and username login

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private tailorLoginService: TailorLoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.updateValidators();
  }

  toggleLoginType(): void {
    this.loginType = this.loginType === 'email' ? 'username' : 'email';
    this.updateValidators();
    this.clearMessages();
  }

  private updateValidators(): void {
    const emailControl = this.loginForm.get('email');
    const usernameControl = this.loginForm.get('username');

    if (this.loginType === 'email') {
      emailControl?.setValidators([Validators.required, Validators.email]);
      usernameControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      emailControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
    usernameControl?.updateValueAndValidity();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.clearMessages();

      const password = this.loginForm.value.password;
      const rememberMe = this.loginForm.value.rememberMe;

      if (this.loginType === 'email') {
        this.handleEmailLogin(this.loginForm.value.email, password, rememberMe);
      } else {
        this.handleUsernameLogin(this.loginForm.value.username, password);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleEmailLogin(email: string, password: string, rememberMe: boolean): void {
    this.loginService.login(email, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Login successful!';
        this.handleSuccessfulLogin(response, rememberMe);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Email login failed';
        console.error('Email login error:', error);
      }
    });
  }

  private handleUsernameLogin(username: string, password: string): void {
    this.tailorLoginService.login(username, password).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Login successful!';
          this.handleSuccessfulLogin(response, false);
        } else {
          this.errorMessage = response.message || 'Username login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Username login failed';
        console.error('Username login error:', error);
      }
    });
  }

  private handleSuccessfulLogin(response: any, rememberMe: boolean): void {
    // Store tokens if available
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    if (response.refresh) {
      localStorage.setItem('refreshToken', response.refresh);
    }
    
    // Handle remember me functionality
    if (rememberMe && this.loginType === 'email') {
      localStorage.setItem('rememberedEmail', this.loginForm.value.email);
    }

    // Redirect after successful login
    setTimeout(() => {
      this.router.navigate(['/main']);
    }, 1000);
  }

  private isFormValid(): boolean {
    if (this.loginType === 'email') {
      return !!this.loginForm.get('email')?.valid && !!this.loginForm.get('password')?.valid;
    } else {
      return !!this.loginForm.get('username')?.valid && !!this.loginForm.get('password')?.valid;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  navigateToRegister(): void {
    if (this.loginType === 'email') {
      this.router.navigate(['/register']);
    } else {
      this.router.navigate(['/tailorRegistration']);
    }
  }
}