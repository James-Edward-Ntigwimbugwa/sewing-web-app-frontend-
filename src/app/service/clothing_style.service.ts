// clothing-style.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ClothingStyle {
  id: string;
  name: string;
  image: string;
  description: string;
  cost: number;
  isActive?: boolean;
}

interface GraphQLResponse {
  data: {
    activeClothingStyles: ClothingStyle[];
    clothingStyle?: ClothingStyle;
  };
  errors?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ClothingStyleService {
  private apiUrl = 'http://localhost:8000/graphql/'; 
  private clothingStylesSubject = new BehaviorSubject<ClothingStyle[]>([]);
  public clothingStyles$ = this.clothingStylesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GraphQL query to get all active clothing styles
  private getClothingStylesQuery = `
    query GetActiveClothingStyles {
      activeClothingStyles {
        id
        name
        description
        cost
        image
        isActive
      }
    }
  `;

  // GraphQL query to get a single clothing style by ID
  private getClothingStyleQuery = `
    query GetClothingStyle($id: ID!) {
      clothingStyle(id: $id) {
        id
        name
        description
        cost
        image
        isActive
      }
    }
  `;

  // Fetch all active clothing styles using GET request
  getActiveClothingStyles(): Observable<ClothingStyle[]> {
    const params = new HttpParams().set('query', this.getClothingStylesQuery);

    return this.http.get<GraphQLResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL errors: ' + JSON.stringify(response.errors));
        }
        const styles = response.data.activeClothingStyles || [];
        this.clothingStylesSubject.next(styles);
        return styles;
      }),
      catchError(error => {
        console.error('Error fetching clothing styles:', error);
        // Return empty array on error
        return of([]);
      })
    );
  }

  // Fetch a single clothing style by ID using GET request
  getClothingStyleById(id: string): Observable<ClothingStyle | null> {
    const queryWithVariables = this.getClothingStyleQuery.replace('$id', `"${id}"`);
    const params = new HttpParams().set('query', queryWithVariables);

    return this.http.get<GraphQLResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL errors: ' + JSON.stringify(response.errors));
        }
        return response.data.clothingStyle || null;
      }),
      catchError(error => {
        console.error('Error fetching clothing style:', error);
        return of(null);
      })
    );
  }

  // Alternative method using query parameters for single clothing style
  getClothingStyleByIdWithParams(id: string): Observable<ClothingStyle | null> {
    const params = new HttpParams()
      .set('query', this.getClothingStyleQuery)
      .set('variables', JSON.stringify({ id }));

    return this.http.get<GraphQLResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error('GraphQL errors: ' + JSON.stringify(response.errors));
        }
        return response.data.clothingStyle || null;
      }),
      catchError(error => {
        console.error('Error fetching clothing style:', error);
        return of(null);
      })
    );
  }

  // Get current clothing styles from the subject
  getCurrentClothingStyles(): ClothingStyle[] {
    return this.clothingStylesSubject.value;
  }

  // Refresh clothing styles
  refreshClothingStyles(): void {
    this.getActiveClothingStyles().subscribe();
  }
}