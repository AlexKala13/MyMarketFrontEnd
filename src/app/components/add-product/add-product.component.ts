import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { ProductService } from '../../services/productService/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: any = {
    userId: 0,
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    dueDate: '',
    status: 0,
    photos: []
  };
  selectedFiles: FileList | undefined;

  constructor(private authService: AuthService, private productService: ProductService, private router: Router) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.product.userId = userId;
    }
  }

  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
  }

  async uploadFiles() {
    this.product.photos = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        const base64 = await this.readFileAsDataURL(file);
        const base64WithoutPrefix = this.removeBase64Prefix(base64);
        this.product.photos.push(base64WithoutPrefix);
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

  async addProduct() {
    await this.uploadFiles();
    this.productService.addProduct(this.product).subscribe(
      response => {
        if (response.success) {
          this.router.navigate(['/products']);
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error adding product', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    );
  }
}
