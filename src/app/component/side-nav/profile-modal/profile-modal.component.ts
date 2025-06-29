import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileModalOperationsService, Tailor, TailorUpdateInput } from '../../../service/profile-modal-operations.service';
@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css'
})
export class ProfileModalComponent implements OnInit {
  @Input() tailorData!: Tailor;
  @Input() tailorId: string = '4'; // Add this to get the actual ID
  @Output() close = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<Tailor>();

  editableData!: Tailor;
  originalData!: Tailor;
  isEditing = false;
  isSaving = false;

  constructor(private tailorService: ProfileModalOperationsService) {}

  ngOnInit() {
    // Create a deep copy of the data for editing
    this.originalData = { ...this.tailorData };
    this.editableData = { ...this.tailorData };
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    // Restore original data
    this.editableData = { ...this.originalData };
  }

  closeModal() {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  saveProfile() {
    if (!this.editableData) return;

    this.isSaving = true;

    const updateInput: TailorUpdateInput = {
      fullName: this.editableData.fullName,
      username: this.editableData.username,
      email: this.editableData.email,
      phoneNumber: this.editableData.phoneNumber,
      nationalIdNumber: this.editableData.nationalIdNumber,
      sex: this.editableData.sex,
      areaOfResidence: this.editableData.areaOfResidence,
      areaOfWork: this.editableData.areaOfWork
    };

    this.tailorService.updateTailor(this.tailorId, updateInput).subscribe({
      next: (updatedTailor) => {
        if (updatedTailor) {
          console.log('Profile updated successfully:', updatedTailor);
          this.originalData = { ...updatedTailor };
          this.editableData = { ...updatedTailor };
          this.isEditing = false;
          this.isSaving = false;
          this.profileUpdated.emit(updatedTailor);
          
          // Show success message
          this.showSuccessMessage('Profile updated successfully!');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isSaving = false;
        this.showErrorMessage('Error updating profile. Please try again.');
      }
    });
  }

  private showSuccessMessage(message: string) {
    // You can implement a toast notification service here
    // For now, we'll use a simple alert
    alert(message);
  }

  private showErrorMessage(message: string) {
    // You can implement a toast notification service here
    // For now, we'll use a simple alert
    alert(message);
  }
}
