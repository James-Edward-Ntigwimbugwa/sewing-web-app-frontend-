import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { SideNavComponent } from '../side-nav/side-nav.component';


interface ClothingStyle {
  id: number;
  name: string;
  image: string;
  description: string;
  cost: number;
}


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, HeaderComponent,SideNavComponent ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  clothingStyles: ClothingStyle[] = [
    {
      id: 1,
      name: "Classic Suit",
      image: "../images/1.jpeg",
      description: "A timeless two-piece suit perfect for formal occasions.",
      cost: 40000
    },
    {
      id: 2,
      name: "Summer Dress",
      image: "../images/3.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 30000
    },
    {
      id: 3,
      name: "Casual Jeans",
      image: "../images/2.jpeg",
      description: "Comfortable, versatile jeans for everyday wear.",
      cost: 35000
    },
    {
      id: 4,
      name: "Evening Gown",
      image: "../images/1.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 25000
    }
  ];

  selectedStyle: ClothingStyle | null = null;

  selectStyle(style: ClothingStyle): void {
    this.selectedStyle = style;
  }

  proceedToSewing(): void {
    alert(`Proceeding to sew ${this.selectedStyle?.name}. Total cost: $${this.selectedStyle?.cost.toFixed(2)}`);
    // Here you would typically navigate to a new component or trigger a service to handle the sewing process
  }
}












