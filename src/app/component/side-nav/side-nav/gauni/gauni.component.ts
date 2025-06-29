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
  selector: 'app-gauni',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavComponent],
  templateUrl: './gauni.component.html',
  styleUrl: './gauni.component.css'
})
export class GauniComponent {
  clothingStyles: ClothingStyle[] = [
    {
      id: 1,
      name: "Classic Gauni",
      image: "../images/1.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
      id: 2,
      name: "Classic Gauni",
      image: "../images/2.jpeg",
      description: "An elegant, floor-length gown for special events.",
      cost: 399.99
    },
    {
    id: 3,
    name: "Classic Gauni",
    image: "../images/3.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 4,
    name: "Classic Gauni",
    image: "../images/4.jpeg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 5,
    name: "Classic Gauni",
    image: "../images/5.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 6,
    name: "Classic Gauni",
    image: "../images/6.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 7,
    name: "Classic Gauni",
    image: "../images/7.jpg",
    description: "An elegant, floor-length gown for special events.",
    cost: 399.99
  },
  {
    id: 8,
    name: "Classic Gauni",
    image: "../images/8.jpeg",
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
