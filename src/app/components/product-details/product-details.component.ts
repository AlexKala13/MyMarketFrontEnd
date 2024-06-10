import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import { ProductDetails } from '../../models/product-details.model';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private productService: ProductService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
    }
  }

  async loadProductDetails(id: number) {
    this.loading = true;
    (await this.productService.getProductDetails(id)).subscribe(
      response => {
        if (response && response.data) {
          this.product = { ...response.data, photos: response.data.photos?.['$values'] || [] } as ProductDetails;
        } else {
          this.product = null;
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading product details', error);
        this.product = null;
        this.loading = false;
      }
    );
  }

  isCurrentUserAuthor(): boolean {
    const userId = this.authService.getUserId();
    return userId === this.product?.userId;
  }

  editProduct(): void {
    const productId = this.product?.id;
    if (productId) {
      this.router.navigate(['/edit-product', productId]);
    }
  }
}
