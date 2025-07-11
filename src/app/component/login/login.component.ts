import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { LoginService } from '../../service/login.service';

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
    private loginService: LoginService
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
    this.loadRememberedEmail();
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

  private loadRememberedEmail(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && this.loginType === 'email') {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
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
    this.loginService.customerLogin(email, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const result = response.data?.customerUserLogin;
        
        if (result?.success) {
          this.successMessage = result.message || 'Login successful!';
          this.handleSuccessfulLogin(result, rememberMe);
        } else {
          this.errorMessage = result?.message || 'Email login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Email login failed';
        console.error('Email login error:', error);
      }
    });
  }

  private handleUsernameLogin(username: string, password: string): void {
    this.loginService.tailorLogin(username, password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const result = response.data?.tailorLogin;
        
        if (result?.success) {
          this.successMessage = result.message || 'Login successful!';
          this.handleSuccessfulLogin(result, false);
        } else {
          this.errorMessage = result?.message || 'Username login failed';
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
    
    // Handle remember me functionality (only for email login)
    if (rememberMe && this.loginType === 'email') {
      localStorage.setItem('rememberedEmail', this.loginForm.value.email);
    } else if (this.loginType === 'email' && !rememberMe) {
      localStorage.removeItem('rememberedEmail');
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