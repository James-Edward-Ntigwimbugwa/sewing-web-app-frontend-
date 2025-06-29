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
  selector: 'app-sout',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavComponent],
  templateUrl: './sout.component.html',
  styleUrl: './sout.component.css'
})
export class SoutComponent {
  clothingStyles: ClothingStyle[] = [
    {
      id: 1,
      name: "Classic Suit for Male",
      image: "../images/001.jpeg",
      description: "A timeless two-piece suit perfect for formal occasions.",
      cost: 299.99
    },
    {
      id: 2,
      name: "Classic Suit for Male",
      image: "../images/002.jpeg",
      description: "A light, flowy dress ideal for warm summer days.",
      cost: 89.99
    },
    {
      id: 3,
      name: "Classic Suit for Male",
      image: "../images/003.jpeg",
      description: "Comfortable, versatile jeans for everyday wear.",
      cost: 59.99
    },
    {
      id: 4,
      name: "Classic Suot for Male",
      image: "../images/004.webp",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 5,
      name: "Classic Suot for Female",
      image: "../images/S1.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 6,
      name: "Classic Suit for Female",
      image: "../images/S2.webp",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 7,
      name: "Classic Suit for Female",
      image: "../images/S3.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 8,
      name: "Classic Suit for Female",
      image: "../images/S4.webp",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 9,
      name: "Classic Suit for Male",
      image: "../images/005.jpg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 10,
      name: "Classic Suit for Male",
      image: "../images/006.jpg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 11,
      name: "Classic Suit for Male",
      image: "../images/007.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 12,
      name: "Classic Suit for Male",
      image: "../images/008.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    }
  ,
  {
    id: 13,
    name: "Classic Suit for Female",
    image: "../images/S5.webp",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 14,
    name: "Classic Suit for Female",
    image: "../images/S6.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 15,
    name: "Classic Suit for Female",
    image: "../images/S7.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 16,
    name: "Classic Suit for Female",
    image: "../images/S8.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
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
