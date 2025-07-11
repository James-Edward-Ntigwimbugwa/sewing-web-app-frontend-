// src/app/service/body-measurements.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MeasurementSubmissionResponse {
  success: boolean;
  message: string;
  orderId?: string;
  estimatedCompletionDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BodyMeasurementsService {
  private apiUrl = 'http://localhost:8080/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  /**
   * Submit body measurements to the server
   */
  submitMeasurements(measurementsData: BodyMeasurementsData): Observable<MeasurementSubmissionResponse> {
    return this.http.post<MeasurementSubmissionResponse>(`${this.apiUrl}/measurements`, measurementsData);
  }

  /**
   * Get measurement guidelines for different clothing types
   */
  getMeasurementGuidelines(clothingType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/measurement-guidelines/${clothingType}`);
  }

  /**
   * Get customer's previous measurements (if they exist)
   */
  getCustomerMeasurements(phoneNumber: string): Observable<BodyMeasurementsData[]> {
    return this.http.get<BodyMeasurementsData[]>(`${this.apiUrl}/measurements/customer/${phoneNumber}`);
  }

  /**
   * Update existing measurements
   */
  updateMeasurements(measurementId: string, measurementsData: Partial<BodyMeasurementsData>): Observable<MeasurementSubmissionResponse> {
    return this.http.put<MeasurementSubmissionResponse>(`${this.apiUrl}/measurements/${measurementId}`, measurementsData);
  }

  /**
   * Get all orders for a customer
   */
  getCustomerOrders(phoneNumber: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/customer/${phoneNumber}`);
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }

  /**
   * Get order status
   */
  getOrderStatus(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}/status`);
  }

  /**
   * Validate measurements based on clothing type
   */
  validateMeasurements(measurements: any, clothingType: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Common validations
    if (!measurements.chest || measurements.chest < 50 || measurements.chest > 200) {
      errors.push('Chest measurement must be between 50-200 cm');
    }

    if (!measurements.waist || measurements.waist < 40 || measurements.waist > 150) {
      errors.push('Waist measurement must be between 40-150 cm');
    }

    if (!measurements.height || measurements.height < 140 || measurements.height > 220) {
      errors.push('Height must be between 140-220 cm');
    }

    if (!measurements.armLength || measurements.armLength < 40 || measurements.armLength > 80) {
      errors.push('Arm length must be between 40-80 cm');
    }

    // Specific validations based on clothing type
    switch (clothingType.toLowerCase()) {
      case 'suit':
      case 'formal':
        if (!measurements.shoulderWidth || measurements.shoulderWidth < 30 || measurements.shoulderWidth > 60) {
          errors.push('Shoulder width is required for suits and must be between 30-60 cm');
        }
        if (!measurements.neckCircumference || measurements.neckCircumference < 25 || measurements.neckCircumference > 50) {
          errors.push('Neck circumference is required for formal wear and must be between 25-50 cm');
        }
        break;

      case 'dress':
        if (!measurements.hips || measurements.hips < 50 || measurements.hips > 200) {
          errors.push('Hip measurement is required for dresses and must be between 50-200 cm');
        }
        break;

      case 'pants':
      case 'jeans':
        if (!measurements.inseam || measurements.inseam < 60 || measurements.inseam > 100) {
          errors.push('Inseam measurement is required for pants and must be between 60-100 cm');
        }
        if (!measurements.hips || measurements.hips < 50 || measurements.hips > 200) {
          errors.push('Hip measurement is required for pants and must be between 50-200 cm');
        }
        break;
    }

    // Weight validation (if provided)
    if (measurements.weight && (measurements.weight < 40 || measurements.weight > 150)) {
      errors.push('Weight must be between 40-150 kg');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Calculate estimated completion time based on clothing type and current workload
   */
  getEstimatedCompletionTime(clothingType: string): Observable<{ days: number; message: string }> {
    return this.http.get<{ days: number; message: string }>(`${this.apiUrl}/estimates/completion-time/${clothingType}`);
  }

  /**
   * Get pricing information for different clothing types
   */
  getPricingInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pricing`);
  }

  /**
   * Send measurement confirmation email/SMS
   */
  sendMeasurementConfirmation(customerEmail: string, customerPhone: string, orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/measurement-confirmation`, {
      email: customerEmail,
      phone: customerPhone,
      orderId: orderId
    });
  }

  /**
   * Get measurement tips based on clothing type
   */
  getMeasurementTips(clothingType: string): string[] {
    const tips: { [key: string]: string[] } = {
      'suit': [
        'Wear well-fitted undergarments when taking measurements',
        'Stand straight with arms relaxed at your sides',
        'Have someone else take your measurements for accuracy',
        'Measure over light clothing, not thick sweaters',
        'Keep the measuring tape snug but not tight'
      ],
      'dress': [
        'Wear the type of undergarments you plan to wear with the dress',
        'Stand with feet together and arms at your sides',
        'Measure at the fullest part of your bust and hips',
        'Find your natural waist by bending to one side',
        'Consider the desired dress length and style'
      ],
      'pants': [
        'Wear well-fitting pants when measuring inseam',
        'Measure from crotch to desired pant length',
        'Include shoe height in your measurements',
        'Consider whether you prefer a break in the pant leg',
        'Measure hips at the fullest point'
      ],
      'default': [
        'Use a flexible measuring tape',
        'Keep the tape parallel to the floor',
        'Don\'t pull the tape too tight',
        'Take measurements over light clothing',
        'Double-check all measurements'
      ]
    };

    return tips[clothingType.toLowerCase()] || tips['default'];
  }
}