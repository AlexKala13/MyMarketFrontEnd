import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  categories = environment.categories;

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
