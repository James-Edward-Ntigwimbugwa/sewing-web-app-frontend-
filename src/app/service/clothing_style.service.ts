// clothing-style.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

interface ClothingStyleResponse {
  clothing_styles: ClothingStyle[];
}

@Injectable({
  providedIn: 'root'
})
export class ClothingStyleService {
  private apiUrl = 'http://127.0.0.1:8000/api/clothing-styles/'; 
  private clothingStylesSubject = new BehaviorSubject<ClothingStyle[]>([]);
  public clothingStyles$ = this.clothingStylesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // HTTP headers for REST API requests
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Fetch all active clothing styles using GET request
  getActiveClothingStyles(): Observable<ClothingStyle[]> {
    return this.http.get<ClothingStyleResponse>(this.apiUrl, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(response => {
        console.log('Raw response:', response); // Debug log
        const styles = response.clothing_styles || [];
        const activeStyles = styles.filter(style => style.isActive !== false);
        console.log('Active styles:', activeStyles); // Debug log
        this.clothingStylesSubject.next(activeStyles);
        return activeStyles;
      }),
      catchError(error => {
        console.error('Error fetching clothing styles:', error);
        console.error('Error details:', error.error); // More detailed error logging
        // Return empty array on error
        return of([]);
      })
    );
  }

  // Fetch all clothing styles using GET request
  getAllClothingStyles(): Observable<ClothingStyle[]> {
    return this.http.get<ClothingStyleResponse>(this.apiUrl, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(response => {
        console.log('Raw response:', response); // Debug log
        const styles = response.clothing_styles || [];
        this.clothingStylesSubject.next(styles);
        return styles;
      }),
      catchError(error => {
        console.error('Error fetching all clothing styles:', error);
        return of([]);
      })
    );
  }

  // Fetch a single clothing style by ID using GET request
  getClothingStyleById(id: string): Observable<ClothingStyle | null> {
    const url = `${this.apiUrl}${id}/`;

    return this.http.get<ClothingStyle>(url, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(style => style || null),
      catchError(error => {
        console.error('Error fetching clothing style:', error);
        return of(null);
      })
    );
  }

  // Create a new clothing style using POST request
  createClothingStyle(clothingStyle: Omit<ClothingStyle, 'id'>): Observable<ClothingStyle | null> {
    return this.http.post<ClothingStyle>(this.apiUrl, clothingStyle, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(style => {
        // Refresh the clothing styles list
        this.refreshClothingStyles();
        return style;
      }),
      catchError(error => {
        console.error('Error creating clothing style:', error);
        return of(null);
      })
    );
  }

  // Update an existing clothing style using PUT request
  updateClothingStyle(id: string, clothingStyle: Partial<ClothingStyle>): Observable<ClothingStyle | null> {
    const url = `${this.apiUrl}${id}/`;

    return this.http.put<ClothingStyle>(url, clothingStyle, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(style => {
        // Refresh the clothing styles list
        this.refreshClothingStyles();
        return style;
      }),
      catchError(error => {
        console.error('Error updating clothing style:', error);
        return of(null);
      })
    );
  }

  // Delete a clothing style using DELETE request
  deleteClothingStyle(id: string): Observable<boolean> {
    const url = `${this.apiUrl}${id}/`;

    return this.http.delete(url, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      map(() => {
        // Refresh the clothing styles list
        this.refreshClothingStyles();
        return true;
      }),
      catchError(error => {
        console.error('Error deleting clothing style:', error);
        return of(false);
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

  // Search clothing styles by name
  searchClothingStyles(searchTerm: string): Observable<ClothingStyle[]> {
    const url = `${this.apiUrl}?search=${encodeURIComponent(searchTerm)}`;

    return this.http.get<ClothingStyle[]>(url, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error searching clothing styles:', error);
        return of([]);
      })
    );
  }

  // Get clothing styles with pagination
  getClothingStylesWithPagination(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&page_size=${pageSize}`;

    return this.http.get<any>(url, { 
      headers: this.getHttpHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error fetching clothing styles with pagination:', error);
        return of({ results: [], count: 0, next: null, previous: null });
      })
    );
  }
}