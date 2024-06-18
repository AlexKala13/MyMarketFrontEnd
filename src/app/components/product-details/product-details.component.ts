import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  mainPhotoSrc: string = '';
  selectedThumbnailIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

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
          this.mainPhotoSrc = this.product.photos.length > 0 ? 'data:image/jpeg;base64,' + this.product.photos[0].image : 'assets/images/default-photo.jpg';
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

  openFullScreen(): void {
    if (this.mainPhotoSrc) {
      const newWindow = window.open();
      newWindow?.document.write(`<img src="${this.mainPhotoSrc}" style="width:100%;height:100%;"/>`);
    }
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
              this.showNotification('Product deleted successfully.');
              this.router.navigate(['/products']);
            },
            error => {
              console.error('Error deleting product', error);
              this.showNotification('Failed to delete the product.');
            }
          );
        }
      }
    }
  }

  addToCart(): void {
    if (this.product) {
      const { id, name, price, photos, categoryName, userName, userId, categoryId } = this.product;
      const photo = photos.length > 0 ? `data:image/jpeg;base64,${photos[0].image}` : '';
      const productForCart = { id, name, price, photo, categoryName, userName, userId, categoryId };
      const authorizedUser =  this.authService.getUserId();
      if (authorizedUser !== null) {
        this.cartService.addToCart(productForCart, authorizedUser);
        this.showNotification('Product added to cart!');
      } else {
        this.showNotification('You should authorize to use a cart.');
      }
      
    }
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  showMainPhoto(image: string | undefined): void {
    if (image) {
      this.product!.photos.unshift({
        image,
        id: 0,
        advertisementId: 0,
        isMain: false
      });
    }
  }

  swapMainPhoto(index: number): void {
    if (this.product && this.product.photos.length > index) {
      const mainPhoto = this.product.photos[0];
      this.product.photos[0] = this.product.photos[index];
      this.product.photos[index] = mainPhoto;
      this.mainPhotoSrc = 'data:image/jpeg;base64,' + this.product.photos[0].image;
      this.selectedThumbnailIndex = index;
    }
  }

  getMainPhoto(): string {
    if (this.product?.photos && this.product.photos.length > 0) {
      return 'data:image/jpeg;base64,' + this.product.photos[0].image;
    } else {
      console.log("default is working");
      return 'assets/images/default-photo.jpg';
    }
  }
}
