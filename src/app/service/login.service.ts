import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { MutationResult } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token: string | null = null;

  constructor(private apollo: Apollo,private snackBar: MatSnackBar, private router: Router) {}

  login(email: string, password: string) {
    const obtainJwtToken  = gql`
      mutation obtainJwtToken($email: String!, $password: String!) {
        obtainJwtToken(email: $email, password: $password) {
          token
          refresh
          message
          user {
            id
            email
          }
        }
      }
    `;

    // Define the type for the mutation response
    type ObtainJwtTokenResponse = {
      obtainJwtToken: {
        token: string;
        refresh: string;
        message: string;
        user: {
          id: string;
          email: string;
        };
      };
    };

    return this.apollo.mutate<ObtainJwtTokenResponse>({
  mutation: obtainJwtToken,
  variables: { email, password }
}).subscribe({
  next: (response: MutationResult<ObtainJwtTokenResponse>) => {
    const result = response.data?.obtainJwtToken;

    if (result?.token) {
      this.token = result.token;
      localStorage.setItem('token', this.token);
      this.snackBar.open(result.message , 'Close', { duration: 3000 });
      this.router.navigate(['/main']);
    } else {
      this.snackBar.open(result?.message || '', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  },
  error: (error) => {
    console.error('Login error:', error);
    this.snackBar.open('Invalid email or password. Please try again.', 'Close', { duration: 3000 });
    this.router.navigate(['/login']);
  }
});

  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token'); // Remove token from local storage
    this.router.navigate(['/login']); // Redirect to login
  }
}
