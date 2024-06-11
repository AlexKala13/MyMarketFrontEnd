import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';
import { ProductService } from '../../services/productService/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {
    id: 0,
    userId: 0,
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    status: 0,
    photos: []
  };
  selectedFiles: File[] = [];
  errorMessage: string | null = null;
  loading: boolean = false;
  userId: number | null | undefined;
  existingPhotosBase64: string[] = [];
  deletedPhotosIndexes: number[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private productService: ProductService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
      this.userId = this.authService.getUserId();
    }
  }

  async loadProductDetails(productId: number) {
    (await this.productService.getProductDetails(productId)).subscribe(
      response => {
        if (response.success) {
          this.product = { ...response.data, photos: response.data.photos?.['$values']?.map((photo: any) => this.removeBase64Prefix(photo.image)) || [] };
        } else {
          console.error('Error loading product details:', response.message);
        }
      },
      error => {
        console.error('Error loading product details:', error);
      }
    );
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (!this.selectedFiles.some(file => file.name === files[i].name)) {
          this.selectedFiles.push(files[i]);
          this.readFileAsDataURL(files[i]).then(base64 => {
            const base64WithoutPrefix = this.removeBase64Prefix(base64);
            if (!this.product.photos.includes(base64WithoutPrefix)) {
              this.product.photos.push(base64WithoutPrefix);
            }
          });
        }
      }
    }
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removeBase64Prefix(base64: string): string {
    return base64.replace(/^data:image\/(png|jpeg);base64,/, '');
  }

  removePhoto(index: number) {
    if (index > -1) {
      if (index < this.existingPhotosBase64.length) {
        this.deletedPhotosIndexes.push(index);
      } else {
        const adjustedIndex = index - this.existingPhotosBase64.length;
        this.selectedFiles.splice(adjustedIndex, 1);
      }
      this.product.photos.splice(index, 1);
    }
  }

  async updateProduct() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    for (let i = this.deletedPhotosIndexes.length - 1; i >= 0; i--) {
      this.product.photos.splice(this.deletedPhotosIndexes[i], 1);
    }

    console.log(this.product);

    (await this.productService.editProduct(this.product.id, this.product.userId, this.product)).subscribe(
      response => {
        if (response.success) {
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        console.error('Error updating product', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }
}
