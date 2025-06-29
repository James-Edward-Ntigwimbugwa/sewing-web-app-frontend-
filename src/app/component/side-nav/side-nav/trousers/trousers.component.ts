import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../header/header.component";
import { SideNavComponent } from '../../../side-nav/side-nav.component';



interface ClothingStyle {
  id: number;
  name: string;
  image: string;
  description: string;
  cost: number;
}


@Component({
  selector: 'app-trousers',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavComponent],
  templateUrl: './trousers.component.html',
  styleUrl: './trousers.component.css'
})
export class TrousersComponent {
  clothingStyles: ClothingStyle[] = [
    {
      id: 1,
      name: "Classic Trosers for Male",
      image: "../images/T1.jpg",
      description: "A timeless two-piece suit perfect for formal occasions.",
      cost: 299.99
    },
    {
      id: 2,
      name: "Classic Trosers for Male",
      image: "../images/T2.webp",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 3,
      name: "Classic Trosers for Male",
      image: "../images/T3.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 4,
      name: "Classic Trosers for Male",
      image: "../images/T4.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 5,
      name: "Classic Trosers for Female",
      image: "../images/T5.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 6,
      name: "Classic Trosers for Female",
      image: "../images/T6.webp",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 7,
      name: "Classic Trosers for Female",
      image: "../images/T7.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 8,
      name: "Classic Trosers for Female",
      image: "../images/T8.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 9,
      name: "Classic Trosers for Male",
      image: "../images/T9.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 10,
      name: "Classic Trosers for Male",
      image: "../images/T10.webp",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 11,
      name: "Classic Trosers for Male",
      image: "../images/T11.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 12,
      name: "Classic Trosers for Male",
      image: "../images/T12.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 13,
      name: "Classic Trosers for Female",
      image: "../images/T13.webp",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 14,
      name: "Classic Trosers for Female",
      image: "../images/T14.webp",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 15,
      name: "Classic Trosers for Female",
      image: "../images/T15.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 16,
      name: "Classic Trosers for Female",
      image: "../images/T16.jpg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
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
