import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


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

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface RegisterTailorData {
  registerTailor: RegisterTailorResponse;
}

@Injectable({
  providedIn: 'root'
})
export class TailorRegistrationService {

  private  baseUrl = 'http://127.0.0.1:8000/graphql/'; 
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Register a new tailor using GraphQL mutation
   * @param tailorData - The tailor registration data
   * @returns Observable<RegisterTailorResponse>
   */
  registerTailor(tailorData: RegisterTailorInput): Observable<RegisterTailorResponse> {
    const mutation = `
      mutation RegisterTailor(
        $areaOfResidence: String!,
        $areaOfWork: String!,
        $email: String!,
        $fullName: String!,
        $nationalIdNumber: String!,
        $password: String!,
        $phoneNumber: String!,
        $sex: String!,
        $username: String!
      ) {
        registerTailor(
          areaOfResidence: $areaOfResidence,
          areaOfWork: $areaOfWork,
          email: $email,
          fullName: $fullName,
          nationalIdNumber: $nationalIdNumber,
          password: $password,
          phoneNumber: $phoneNumber,
          sex: $sex,
          username: $username
        ) {
          message
          success
          tailor {
            areaOfResidence
            areaOfWork
            dateOfRegistration
            email
            fullName
            id
            isStaff
            isSuperuser
            nationalIdNumber
            phoneNumber
            sex
            username
          }
        }
      }
    `;

    const variables = {
      areaOfResidence: tailorData.areaOfResidence,
      areaOfWork: tailorData.areaOfWork,
      email: tailorData.email,
      fullName: tailorData.fullName,
      nationalIdNumber: tailorData.nationalIdNumber,
      password: tailorData.password,
      phoneNumber: tailorData.phoneNumber,
      sex: tailorData.sex,
      username: tailorData.username
    };

    const body = {
      query: mutation,
      variables: variables
    };

    return this.http.post<GraphQLResponse<RegisterTailorData>>(
      this.baseUrl, 
      body, 
      this.httpOptions
    ).pipe(
      map(response => {
        // Handle GraphQL errors
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        
        // Return the registerTailor response
        return response.data.registerTailor;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get tailor by ID (example additional method)
   * @param tailorId - The tailor ID
   * @returns Observable<Tailor>
   */
  getTailorById(tailorId: string): Observable<Tailor> {
    const query = `
      query GetTailor($id: ID!) {
        tailor(id: $id) {
          areaOfResidence
          areaOfWork
          dateOfRegistration
          email
          fullName
          id
          isStaff
          isSuperuser
          nationalIdNumber
          phoneNumber
          sex
          username
        }
      }
    `;

    const variables = { id: tailorId };
    const body = { query, variables };

    return this.http.post<GraphQLResponse<{ tailor: Tailor }>>(
      this.baseUrl, 
      body, 
      this.httpOptions
    ).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        return response.data.tailor;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get all tailors (example additional method)
   * @returns Observable<Tailor[]>
   */
  getAllTailors(): Observable<Tailor[]> {
    const query = `
      query GetAllTailors {
        tailors {
          areaOfResidence
          areaOfWork
          dateOfRegistration
          email
          fullName
          id
          isStaff
          isSuperuser
          nationalIdNumber
          phoneNumber
          sex
          username
        }
      }
    `;

    const body = { query };

    return this.http.post<GraphQLResponse<{ tailors: Tailor[] }>>(
      this.baseUrl, 
      body, 
      this.httpOptions
    ).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          throw new Error(response.errors[0].message);
        }
        return response.data.tailors;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update base URL for the service
   * @param newBaseUrl - New base URL
   */
  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
  }

  /**
   * Get current base URL
   * @returns Current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Handle HTTP errors
   * @param error - The error object
   * @returns Observable that throws an error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your input data.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden. You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'Service not found. Please check the server URL.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('TailorService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}