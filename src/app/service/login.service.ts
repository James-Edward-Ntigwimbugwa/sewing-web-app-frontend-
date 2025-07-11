import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token: string | null = null;

  constructor(private apollo: Apollo, private snackBar: MatSnackBar, private router: Router) {}

  // Customer login with email
  customerLogin(email: string, password: string): Observable<MutationResult> {
    const customerUserLogin = gql`
      mutation customerUserLogin($email: String!, $password: String!) {
        customerUserLogin(email: $email, password: $password) {
          token
          refresh
          message
          success
          user {
            id
            email
          }
        }
      }
    `;

    type CustomerUserLoginResponse = {
      customerUserLogin: {
        token: string;
        refresh: string;
        message: string;
        success: boolean;
        user: {
          id: string;
          email: string;
        };
      };
    };

    return this.apollo.mutate<CustomerUserLoginResponse>({
      mutation: customerUserLogin,
      variables: { email, password }
    }).pipe(
      tap({
        next: (response: MutationResult<CustomerUserLoginResponse>) => {
          const result = response.data?.customerUserLogin;

          if (result?.success && result?.token) {
            this.token = result.token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('refreshToken', result.refresh);
            this.snackBar.open(result.message, 'Close', { duration: 3000 });
            this.router.navigate(['/main']);
          } else {
            this.snackBar.open(result?.message || 'Login failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Customer login error:', error);
          this.snackBar.open('Invalid email or password. Please try again.', 'Close', { duration: 3000 });
        }
      })
    );
  }

  // Tailor login with username
  tailorLogin(username: string, password: string): Observable<MutationResult> {
    const tailorLogin = gql`
      mutation tailorLogin($username: String!, $password: String!) {
        tailorLogin(username: $username, password: $password) {
          token
          refresh
          message
          success
          tailor {
            id
            username
          }
        }
      }
    `;

    type TailorLoginResponse = {
      tailorLogin: {
        token: string;
        refresh: string;
        message: string;
        success: boolean;
        tailor: {
          id: string;
          username: string;
        };
      };
    };

    return this.apollo.mutate<TailorLoginResponse>({
      mutation: tailorLogin,
      variables: { username, password }
    }).pipe(
      tap({
        next: (response: MutationResult<TailorLoginResponse>) => {
          const result = response.data?.tailorLogin;

          if (result?.success && result?.token) {
            this.token = result.token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('refreshToken', result.refresh);
            this.snackBar.open(result.message, 'Close', { duration: 3000 });
            this.router.navigate(['/main']);
          } else {
            this.snackBar.open(result?.message || 'Login failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Tailor login error:', error);
          this.snackBar.open('Invalid username or password. Please try again.', 'Close', { duration: 3000 });
        }
      })
    );
  }

  // Legacy method for backward compatibility
  login(email: string, password: string): Observable<MutationResult> {
    return this.customerLogin(email, password);
  }

  isLoggedIn(): boolean {
    return this.token !== null || localStorage.getItem('token') !== null;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}