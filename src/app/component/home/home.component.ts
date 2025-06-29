import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  isLoading = false;
  loadingMessage = '';

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.initializeInteractiveEffects();
  }

  primaryAction() {
    this.showLoader('Redirecting to Customer Login...');
    
    // Simulate loading time and then navigate
    setTimeout(() => {
      this.router.navigate(['/login']).then(() => {
        this.hideLoader();
      }).catch((error) => {
        console.error('Navigation error:', error);
        this.hideLoader();
      });
    }, 1500); // 1.5 second delay for better UX
  }

  secondaryAction() {
    this.showLoader('Redirecting to Tailor Login...');
    
    // Simulate loading time and then navigate
    setTimeout(() => {
      this.router.navigate(['/tailorLogin']).then(() => {
        this.hideLoader();
      }).catch((error) => {
        console.error('Navigation error:', error);
        this.hideLoader();
      });
    }, 1500); // 1.5 second delay for better UX
  }

  private showLoader(message: string) {
    this.isLoading = true;
    this.loadingMessage = message;
    
    // Add loading class to body to prevent interactions
    document.body.classList.add('loading-active');
  }

  private hideLoader() {
    this.isLoading = false;
    this.loadingMessage = '';
    
    // Remove loading class from body
    document.body.classList.remove('loading-active');
  }

  private initializeInteractiveEffects() {
    // Add mouse move effect for particles (only when not loading)
    document.addEventListener('mousemove', (e) => {
      if (this.isLoading) return; // Disable particle effects during loading
      
      const particles = this.elementRef.nativeElement.querySelectorAll('.particle');
      particles.forEach((particle: HTMLElement, index: number) => {
        const speed = (index + 1) * 0.01;
        const x = e.clientX * speed;
        const y = e.clientY * speed;
        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    // Add ripple effect to buttons
    const buttons = this.elementRef.nativeElement.querySelectorAll('.btn');
    buttons.forEach((button: HTMLElement) => {
      button.addEventListener('click', (e: MouseEvent) => {
        if (this.isLoading) return; // Prevent ripple effect during loading
        
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }
}