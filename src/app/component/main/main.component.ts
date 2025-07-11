import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { SideNavComponent } from '../side-nav/side-nav.component';
import { Subscription } from 'rxjs';
import { ClothingStyle, ClothingStyleService } from '../../service/clothing_style.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SideNavComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {
  clothingStyles: ClothingStyle[] = [];
  selectedStyle: ClothingStyle | null = null;
  isLoading = true;
  errorMessage = '';
  private subscription: Subscription = new Subscription();

  constructor(private clothingStyleService: ClothingStyleService) {}

  ngOnInit(): void {
    this.loadClothingStyles();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadClothingStyles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const stylesSub = this.clothingStyleService.getActiveClothingStyles().subscribe({
      next: (styles) => {
        this.clothingStyles = styles;
        this.isLoading = false;
        console.log('Loaded clothing styles:', styles);
      },
      error: (error) => {
        console.error('Error loading clothing styles:', error);
        this.errorMessage = 'Failed to load clothing styles. Please try again.';
        this.isLoading = false;
        // Fallback to sample data if backend is not available
        this.loadFallbackData();
      }
    });

    this.subscription.add(stylesSub);
  }

  // Fallback data in case backend is not available
  private loadFallbackData(): void {
    this.clothingStyles = [
      {
        id: "1",
        name: "Classic Suit",
        image: "../images/1.jpeg",
        description: "A timeless two-piece suit perfect for formal occasions.",
        cost: 40000
      },
      {
        id: "2",
        name: "Summer Dress",
        image: "../images/3.jpeg",
        description: "A light, flowy dress ideal for warm summer days.",
        cost: 30000
      },
      {
        id: "3",
        name: "Casual Jeans",
        image: "../images/2.jpeg",
        description: "Comfortable, versatile jeans for everyday wear.",
        cost: 35000
      },
      {
        id: "4",
        name: "Evening Gown",
        image: "../images/1.jpeg",
        description: "An elegant, floor-length gown for special events.",
        cost: 25000
      }
    ];
  }

  selectStyle(style: ClothingStyle): void {
    this.selectedStyle = style;
  }

  proceedToSewing(): void {
    if (this.selectedStyle) {
      alert(`Proceeding to sew ${this.selectedStyle.name}. Total cost: Tsh ${this.selectedStyle.cost.toFixed(2)}`);
      // Here you would typically navigate to a new component or trigger a service to handle the sewing process
    }
  }

  // Method to refresh data
  refreshData(): void {
    this.loadClothingStyles();
  }

  // Method to handle image loading errors
  onImageError(event: any): void {
    // Set a default image or placeholder
    event.target.src = 'assets/images/placeholder.jpg';
  }
}
