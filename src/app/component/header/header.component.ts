import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  
  showOption: boolean = false;
  isDropdownOpen: boolean = false;  // Initially, both dropdowns are hidden

  constructor(private router: Router) {}

  
  // Toggle the "mambo" button dropdown
  toggleOption() {
    console.log(this.showOption)
    this.showOption = !this.showOption; 
  }

  // Toggle the avatar dropdown
  toggleDropdown() {
    console.log(this.isDropdownOpen)
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Prevent link clicks from closing the dropdown unintentionally
  navigateToProfile(event: MouseEvent) {
    event.stopPropagation();
    console.log('Navigating to profile...');
  }

  navigateToSettings(event: MouseEvent) {
    event.stopPropagation();
    console.log('Navigating to settings...');
  }

  signOut(event: MouseEvent) {
    event.stopPropagation();
    console.log('Signing out...');
  }
}
