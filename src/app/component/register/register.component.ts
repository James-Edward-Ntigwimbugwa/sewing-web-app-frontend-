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
  errorMessage: string = '';  // To hold error messages

  constructor(private fb: FormBuilder, private router: Router, private gqlService: RegisterationService) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { email, first_name, last_name, password } = this.registrationForm.value;

      this.gqlService.CreateCustomUser(email, first_name, last_name, password).subscribe({
        next: (response) => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          
          // Handle unique constraint error for email
          if (error.message.includes('UNIQUE constraint failed')) {
            this.errorMessage = 'This email is already exist. Please use a different email to register.';
          } else {
            this.errorMessage = 'Registration failed. Please try again later.';
          }

          // Optionally, show the error message in the UI
          alert(this.errorMessage);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
