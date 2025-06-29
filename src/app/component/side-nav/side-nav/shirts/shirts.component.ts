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
  selector: 'app-shirts',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavComponent],
  templateUrl: './shirts.component.html',
  styleUrl: './shirts.component.css'
})
export class ShirtsComponent {
  clothingStyles: ClothingStyle[] = [
  {
    id: 1,
    name: "Classic Shirt",
    image: "../images/0a.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 2,
    name: "Classic Shirt",
    image: "../images/0b.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 3,
    name: "Classic Shirt",
    image: "../images/0c.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 4,
    name: "Classic Shirt",
    image: "../images/0d.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 5,
    name: "Classic Shirt",
    image: "../images/0f.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 6,
    name: "Classic Shirt",
    image: "../images/0g.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 7,
    name: "Classic Shirt",
    image: "../images/0h.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 8,
    name: "Classic Shirt",
    image: "../images/0i.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 9,
    name: "Classic Shirt",
    image: "../images/0j.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 10,
    name: "Classic Shirt",
    image: "../images/0k.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 11,
    name: "Classic Shirt",
    image: "../images/0l.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 12,
    name: "Classic Shirt",
    image: "../images/0m.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
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
