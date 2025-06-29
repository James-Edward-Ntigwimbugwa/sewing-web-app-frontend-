import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Tailor {
  areaOfResidence: string;
  areaOfWork: string;
  dateOfRegistration: string;
  email: string;
  fullName: string;
  nationalIdNumber: string;
  phoneNumber: string;
  sex: string;
  username: string;
}

export interface TailorUpdateInput {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  nationalIdNumber?: string;
  sex?: string;
  areaOfResidence?: string;
  areaOfWork?: string;
}

// GraphQL Queries and Mutations
const GET_TAILOR = gql`
  query GetTailor($id: String!) {
    tailor(id: $id) {
      areaOfResidence
      areaOfWork
      dateOfRegistration
      email
      fullName
      nationalIdNumber
      phoneNumber
      sex
      username
    }
  }
`;

const UPDATE_TAILOR = gql`
  mutation UpdateTailor($id: String!, $input: TailorUpdateInput!) {
    updateTailor(id: $id, input: $input) {
      areaOfResidence
      areaOfWork
      dateOfRegistration
      email
      fullName
      nationalIdNumber
      phoneNumber
      sex
      username
    }
  }
`;

const GET_ALL_TAILORS = gql`
  query GetAllTailors {
    tailors {
      areaOfResidence
      areaOfWork
      dateOfRegistration
      email
      fullName
      nationalIdNumber
      phoneNumber
      sex
      username
    }
  }
`;

const DELETE_TAILOR = gql`
  mutation DeleteTailor($id: String!) {
    deleteTailor(id: $id) {
      success
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ProfileModalOperationsService {
  // Base URL for the GraphQL endpoint
  private readonly baseUrl: string;

  constructor(private apollo: Apollo) {
    
    this.baseUrl = 'http://127.0.0.1:8000/graphql/';
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }



  /**
   * Get a single tailor by ID
   */
  getTailor(id: string): Observable<Tailor | null> {
    return this.apollo.watchQuery<{tailor: Tailor}>({
      query: GET_TAILOR,
      variables: { id },
      errorPolicy: 'all',
      // You can add context for specific endpoint if needed
      context: {
        uri: this.baseUrl // This works if your Apollo client supports multiple endpoints
      }
    }).valueChanges.pipe(
      map(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          console.error('Endpoint:', this.baseUrl);
        }
        return result.data?.tailor || null;
      })
    );
  }

  /**
   * Update tailor information
   */
  updateTailor(id: string, input: TailorUpdateInput): Observable<Tailor | null> {
    return this.apollo.mutate<{updateTailor: Tailor}>({
      mutation: UPDATE_TAILOR,
      variables: { id, input },
      errorPolicy: 'all',
      context: {
        uri: this.baseUrl
      }
    }).pipe(
      map(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          console.error('Endpoint:', this.baseUrl);
          throw new Error('Failed to update tailor profile');
        }
        return result.data?.updateTailor || null;
      })
    );
  }

  /**
   * Get all tailors (useful for admin functionality)
   */
  getAllTailors(): Observable<Tailor[]> {
    return this.apollo.watchQuery<{tailors: Tailor[]}>({
      query: GET_ALL_TAILORS,
      errorPolicy: 'all',
      context: {
        uri: this.baseUrl
      }
    }).valueChanges.pipe(
      map(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          console.error('Endpoint:', this.baseUrl);
        }
        return result.data?.tailors || [];
      })
    );
  }

  /**
   * Delete a tailor (admin functionality)
   */
  deleteTailor(id: string): Observable<{success: boolean, message: string}> {
    return this.apollo.mutate<{deleteTailor: {success: boolean, message: string}}>({
      mutation: DELETE_TAILOR,
      variables: { id },
      errorPolicy: 'all',
      context: {
        uri: this.baseUrl
      }
    }).pipe(
      map(result => {
        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          console.error('Endpoint:', this.baseUrl);
          throw new Error('Failed to delete tailor');
        }
        return result.data?.deleteTailor || {success: false, message: 'Unknown error'};
      })
    );
  }

  /**
   * Refresh Apollo cache for a specific tailor
   */
  refreshTailorCache(id: string): void {
    this.apollo.client.refetchQueries({
      include: [GET_TAILOR]
    });
  }

  /**
   * Clear all Apollo cache
   */
  clearCache(): void {
    this.apollo.client.clearStore();
  }

  /**
   * Health check method to test the endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      // You can implement a simple query to test connectivity
      const result = await this.apollo.query({
        query: gql`query HealthCheck { __typename }`,
        context: { uri: this.baseUrl }
      }).toPromise();
      
      console.log(`Health check successful for endpoint: ${this.baseUrl}`);
      return true;
    } catch (error) {
      console.error(`Health check failed for endpoint: ${this.baseUrl}`, error);
      return false;
    }
  }
}