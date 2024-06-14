import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import { ProductDetails } from '../../models/product-details.model';
import { AuthService } from '../../services/authService/auth.service';
import { CartService } from '../../services/cartService/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private productService: ProductService, private authService: AuthService, private router: Router, private cartService: CartService) { }

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

  async deleteProduct(): Promise<void> {
    if (this.product && this.product.id !== null) {
      const confirmed = confirm('Are you sure you want to delete this product?');
      if (confirmed) {
        const userId = this.authService.getUserId();
        if (userId !== null) {
          (await this.productService.deleteProduct(this.product.id, userId)).subscribe(
            response => {
              alert('Product deleted successfully.');
              this.router.navigate(['/products']);
            },
            error => {
              console.error('Error deleting product', error);
              alert('Failed to delete the product.');
            }
          );
        }
      }
    }
  }

  addToCart(): void {
    if (this.product) {
      const { id, name, price, photos, categoryName, userName } = this.product;
      const photo = photos.length > 0 ? `data:image/jpeg;base64,${photos[0].image}` : '';
      const productForCart = { id, name, price, photo, categoryName, userName };
      console.log(productForCart);
      this.cartService.addToCart(productForCart);
      alert('Product added to cart!');
    }
  }
}
