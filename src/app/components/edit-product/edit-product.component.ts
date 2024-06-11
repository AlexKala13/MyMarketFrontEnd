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
  existingPhotos: string[] = [];
  deletedPhotos: string[] = []; 

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
          this.product = { ...response.data, photos: response.data.photos?.['$values'] || [] };
          if (this.product.photos) {
            this.existingPhotos = this.product.photos.map((photo: any) => photo.image);
            this.product.photos = this.existingPhotos;
            console.log(this.product.photos);
          }
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
        this.selectedFiles.push(files[i]);
        this.readFileAsDataURL(files[i]).then(base64 => {
          this.product.photos.push(this.removeBase64Prefix(base64));
        });
      }
    }
  }

  async readFilesAsDataURLs(files: FileList): Promise<string[]> {
    const fileReadPromises = [];
    for (let i = 0; i < files.length; i++) {
      fileReadPromises.push(this.readFileAsDataURL(files[i]));
    }
    return Promise.all(fileReadPromises);
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
      if (index < this.existingPhotos.length) {
        const removedPhoto = this.existingPhotos.splice(index, 1)[0];
        this.deletedPhotos.push(removedPhoto);
      } else {
        const adjustedIndex = index - this.existingPhotos.length;
        this.selectedFiles.splice(adjustedIndex, 1);
      }
      this.product.photos.splice(index, 1);
    }
  }

  async uploadFiles() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const base64 = await this.readFileAsDataURL(this.selectedFiles[i]);
      const base64WithoutPrefix = this.removeBase64Prefix(base64);
      this.product.photos.push(base64WithoutPrefix);
    }
  }

  async updateProduct() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    await this.uploadFiles();
    const updatedProduct = { ...this.product, deletedPhotos: this.deletedPhotos };

    console.log(updatedProduct);

    (await this.productService.editProduct(this.product.id, this.product.userId, updatedProduct)).subscribe(
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
