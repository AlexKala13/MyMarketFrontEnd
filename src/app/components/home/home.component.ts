import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  categories = [
    { id: 1, name: "Electronics", photo: 'assets/images/icons8-electronics-100.png' },
    { id: 2, name: "Clothing and Accessories", photo: 'assets/images/icons8-clothes-100.png' },
    { id: 3, name: "Home and Garden", photo: 'assets/images/icons8-garden-100.png' },
    { id: 4, name: 'Beauty and Health', photo: 'assets/images/icons8-health-100.png' },
    { id: 5, name: 'Sports and Leisure', photo: 'assets/images/icons8-tennis-ball-100.png' },
    { id: 6, name: 'Auto and Moto', photo: 'assets/images/icons8-steering-wheel-100.png' }
  ];

  vendors = [
    { imageUrl: 'assets/images/vendor-1.jpg' },
    { imageUrl: 'assets/images/vendor-2.jpg' },
    { imageUrl: 'assets/images/vendor-3.jpg' },
    { imageUrl: 'assets/images/vendor-4.jpg' },
    { imageUrl: 'assets/images/vendor-5.jpg' },
    { imageUrl: 'assets/images/vendor-6.jpg' },
    { imageUrl: 'assets/images/vendor-7.jpg' },
    { imageUrl: 'assets/images/vendor-8.jpg' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupCarouselAutoScroll();
  }

  navigateToCategory(category: any): void {
    // Navigate to products page with category filter
    this.router.navigate(['/products'], { queryParams: { category: category.id } });
  }

  private setupCarouselAutoScroll(): void {
    setInterval(() => {
      const carouselEl = this.carousel.nativeElement;
      const scrollPosition = carouselEl.scrollLeft + carouselEl.clientWidth;
      const maxScroll = carouselEl.scrollWidth;

      carouselEl.scrollTo({
        left: scrollPosition >= maxScroll ? 0 : scrollPosition,
        behavior: 'smooth'
      });
    }, 3000); // Scroll every 5 seconds (5000 milliseconds)
  }
}
