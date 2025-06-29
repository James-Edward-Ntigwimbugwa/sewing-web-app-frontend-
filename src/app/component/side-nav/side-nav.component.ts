import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileModalOperationsService, Tailor } from '../../service/profile-modal-operations.service';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';


@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule,ProfileModalComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit {
  @Input() userId: string = '4'; // Default user ID, can be passed from parent component
  
  username = 'Loading...';
  role = 'Loading...';
  isOpen: boolean = true;
  isLoading: boolean = true;
  showProfileModal: boolean = false;
  
  // Full tailor data
  tailorData: Tailor | null = null;

  constructor(
    private tailorService: ProfileModalOperationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Load user data from GraphQL
  loadUserData() {
    this.isLoading = true;
    
    this.tailorService.getTailor(this.userId).subscribe({
      next: (tailor) => {
        if (tailor) {
          this.tailorData = tailor;
          this.updateUserInfo(tailor.fullName, 'Tailor');
        } else {
          this.username = 'User not found';
          this.role = 'Error';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.username = 'Error';
        this.role = 'Unable to load';
        this.isLoading = false;
      }
    });
  }

  // Function to toggle sidebar visibility
  toggleSidebar() {
    this.isOpen = !this.isOpen;
    console.log('Sidebar state:', this.isOpen ? 'Open' : 'Closed');
  }

  // Updated method to update username when user logs in
  updateUserInfo(username: string, role: string = 'User') {
    this.username = username;
    this.role = role;
  }

  // Method to show profile modal
  showProfile() {
    this.showProfileModal = true;
  }

  // Method to hide profile modal
  hideProfile() {
    this.showProfileModal = false;
  }

  // Method to handle profile update
  onProfileUpdated(updatedData: Tailor) {
    this.tailorData = updatedData;
    this.updateUserInfo(updatedData.fullName, 'Tailor');
    this.hideProfile();
  }

  // Method to handle logout
  logout() {
    // Clear user data
    this.username = '';
    this.role = '';
    this.tailorData = null;
    
    // Clear service cache
    this.tailorService.clearCache();
    
    // Navigate to main page
    this.router.navigate(['']).then(() => {
      console.log('Logged out successfully');
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  }

  // Method to refresh user data
  refreshUserData() {
    this.loadUserData();
  }
}