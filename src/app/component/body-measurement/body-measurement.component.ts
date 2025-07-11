// src/app/component/body-measurements/body-measurements.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SideNavComponent } from '../side-nav/side-nav.component';
import { ClothingStyle } from '../../service/clothing_style.service';
import { BodyMeasurementsService } from '../../service/body-measurement.service';

interface BodyMeasurements {
  customerName: string;
  phoneNumber: string;
  email: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  shoulderWidth: number | null;
  armLength: number | null;
  inseam: number | null;
  neckCircumference: number | null;
  height: number | null;
  weight: number | null;
  additionalNotes: string;
}

@Component({
  selector: 'app-body-measurements',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SideNavComponent],
  templateUrl: './body-measurement.component.html',
  styleUrls: ['./body-measurement.component.css']
})
export class BodyMeasurementsComponent implements OnInit {
  selectedStyle: ClothingStyle | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  validationErrors: string[] = [];
  measurementTips: string[] = [];
  estimatedDays: number = 0;

  measurements: BodyMeasurements = {
    customerName: '',
    phoneNumber: '',
    email: '',
    chest: null,
    waist: null,
    hips: null,
    shoulderWidth: null,
    armLength: null,
    inseam: null,
    neckCircumference: null,
    height: null,
    weight: null,
    additionalNotes: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bodyMeasurementsService: BodyMeasurementsService
  ) {}

  ngOnInit(): void {
    // Get the selected style from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.selectedStyle = navigation.extras.state['selectedStyle'];
    }
    
    // If no style data, try to get from route params or redirect back
    if (!this.selectedStyle) {
      this.router.navigate(['/']);
      return;
    }

    // Load measurement tips based on clothing type
    this.loadMeasurementTips();
    
    // Get estimated completion time
    this.getEstimatedCompletionTime();
  }

  loadMeasurementTips(): void {
    if (this.selectedStyle) {
      this.measurementTips = this.bodyMeasurementsService.getMeasurementTips(this.selectedStyle.name);
    }
  }

  getEstimatedCompletionTime(): void {
    if (this.selectedStyle) {
      this.bodyMeasurementsService.getEstimatedCompletionTime(this.selectedStyle.name)
        .subscribe({
          next: (estimate) => {
            this.estimatedDays = estimate.days;
          },
          error: (error) => {
            console.error('Error getting completion estimate:', error);
            this.estimatedDays = 7; // Default fallback
          }
        });
    }
  }

  onSubmit(): void {
    this.validationErrors = [];
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    // Validate measurements based on clothing type
    if (this.selectedStyle) {
      const validation = this.bodyMeasurementsService.validateMeasurements(
        this.measurements, 
        this.selectedStyle.name
      );
      
      if (!validation.isValid) {
        this.validationErrors = validation.errors;
        return;
      }
    }

    this.isLoading = true;
    
   const measurementsData: BodyMeasurementsData = {
  customerName: this.measurements.customerName,
  phoneNumber: this.measurements.phoneNumber,
  email: this.measurements.email,
  chest: Number(this.measurements.chest),
  waist: Number(this.measurements.waist),
  hips: this.measurements.hips ? Number(this.measurements.hips) : undefined,
  shoulderWidth: this.measurements.shoulderWidth ? Number(this.measurements.shoulderWidth) : undefined,
  armLength: Number(this.measurements.armLength),
  inseam: this.measurements.inseam ? Number(this.measurements.inseam) : undefined,
  neckCircumference: this.measurements.neckCircumference ? Number(this.measurements.neckCircumference) : undefined,
  height: Number(this.measurements.height),
  weight: this.measurements.weight ? Number(this.measurements.weight) : undefined,
  additionalNotes: this.measurements.additionalNotes,
  selectedStyleId: Number(this.selectedStyle!.id),
  selectedStyleName: this.selectedStyle!.name,
  selectedStyleCost: this.selectedStyle!.cost,
  submittedAt: new Date()
};

    this.bodyMeasurementsService.submitMeasurements(measurementsData)
      .subscribe({
        next: (response: MeasurementSubmissionResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = `Measurements submitted successfully! Order ID: ${response.orderId}. ${response.message}`;
            
            // Send confirmation if email or phone provided
            if (this.measurements.email || this.measurements.phoneNumber) {
              this.sendConfirmation(response.orderId!);
            }
            
            // Redirect to main page after delay
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 5000);
          } else {
            this.errorMessage = response.message || 'Failed to submit measurements.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error submitting measurements:', error);
          this.errorMessage = 'Failed to submit measurements. Please try again.';
        }
      });
  }

  sendConfirmation(orderId: string): void {
    this.bodyMeasurementsService.sendMeasurementConfirmation(
      this.measurements.email,
      this.measurements.phoneNumber,
      orderId
    ).subscribe({
      next: (response) => {
        console.log('Confirmation sent:', response);
      },
      error: (error) => {
        console.error('Error sending confirmation:', error);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.measurements.customerName.trim() &&
      this.measurements.phoneNumber.trim() &&
      this.measurements.chest &&
      this.measurements.waist &&
      this.measurements.armLength &&
      this.measurements.height
    );
  }

  onPhoneNumberChange(): void {
    // Auto-load previous measurements if customer exists
    if (this.measurements.phoneNumber.length >= 10) {
      this.loadCustomerMeasurements();
    }
  }

  loadCustomerMeasurements(): void {
    this.bodyMeasurementsService.getCustomerMeasurements(this.measurements.phoneNumber)
      .subscribe({
        next: (previousMeasurements) => {
          if (previousMeasurements.length > 0) {
            const latest = previousMeasurements[0];
            if (confirm('We found previous measurements for this phone number. Would you like to load them?')) {
              this.measurements.customerName = latest.customerName;
              this.measurements.email = latest.email;
              this.measurements.chest = latest.chest;
              this.measurements.waist = latest.waist;
              this.measurements.hips = latest.hips || null;
              this.measurements.shoulderWidth = latest.shoulderWidth || null;
              this.measurements.armLength = latest.armLength;
              this.measurements.inseam = latest.inseam || null;
              this.measurements.neckCircumference = latest.neckCircumference || null;
              this.measurements.height = latest.height;
              this.measurements.weight = latest.weight || null;
            }
          }
        },
        error: (error) => {
          console.error('Error loading customer measurements:', error);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  clearForm(): void {
    this.measurements = {
      customerName: '',
      phoneNumber: '',
      email: '',
      chest: null,
      waist: null,
      hips: null,
      shoulderWidth: null,
      armLength: null,
      inseam: null,
      neckCircumference: null,
      height: null,
      weight: null,
      additionalNotes: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.validationErrors = [];
  }
}