// Add these interfaces to your component file or create a separate types file

interface BodyMeasurementsData {
  customerName: string;
  phoneNumber: string;
  email: string;
  chest: number;
  waist: number;
  hips?: number;
  shoulderWidth?: number;
  armLength: number;
  inseam?: number;
  neckCircumference?: number;
  height: number;
  weight?: number;
  additionalNotes: string;
  selectedStyleId: number;
  selectedStyleName: string;
  selectedStyleCost: number;
  submittedAt: Date;
}

interface MeasurementSubmissionResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  errors?: string[];
}