import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';


export interface LoginResponse {
  message: string;
  refresh: string;
  success: boolean;
  token: string;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export interface TailorLoginData {
  tailorLogin: LoginResponse;
}

@Injectable({
  providedIn: 'root'
})
export class TailorLoginService {

  private  baseUrl = 'http://127.0.0.1:8000/graphql/';
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient) {}

 
  // Login using GraphQL mutation
   
  login(username: string, password: string): Observable<LoginResponse> {
    const query = `
      mutation TailorLogin($username: String!, $password: String!) {
        tailorLogin(username: $username, password: $password) {
          message
          refresh
          success
          token
        }
      }
    `;

    const variables = {
      username,
      password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      query,
      variables
    };

    return this.http.post<GraphQLResponse<TailorLoginData>>(
      this.baseUrl,
      body,
      { headers }
    ).pipe(
      tap(response => {
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
      }),
      catchError(this.handleError),
      map(response => response.data.tailorLogin), // Use map to extract the data
      tap(loginResponse => {
        if (loginResponse.success) {
          this.setTokens(loginResponse.token, loginResponse.refresh);
        }
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set authentication tokens
   */
  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. Please contact support.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors?.length > 0) {
        errorMessage = error.error.errors[0].message;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('AuthService Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Refresh authentication token
   */
  refreshAuthToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const query = `
      mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
          message
          refresh
          success
          token
        }
      }
    `;

    const variables = { refreshToken };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = { query, variables };

    return this.http.post<GraphQLResponse<{ refreshToken: LoginResponse }>>(
      this.baseUrl,
      body,
      { headers }
    ).pipe(
      catchError(this.handleError),
      map(response => response.data.refreshToken), // Use map to extract the data
      tap(refreshResponse => {
        if (refreshResponse.success) {
          this.setTokens(refreshResponse.token, refreshResponse.refresh);
        }
      })
    );
  }
}