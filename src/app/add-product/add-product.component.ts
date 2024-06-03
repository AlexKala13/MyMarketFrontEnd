import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: any = {
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    dueDate: '',
    status: 0,
    photos: [],
    userId: null,
    userName: ''
  };
  selectedFiles: FileList | undefined;

  constructor(private authService: AuthService, private router: Router) {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.product.userId = userInfo.userId;
      this.product.userName = userInfo.username;
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
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        this.product.photos.push(arrayBuffer);
      }
    }
  }

  readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async addProduct() {
    await this.uploadFiles();
    this.authService.addProduct(this.product).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/products']);
      } else {
        console.error(response.message);
      }
    }, error => {
      console.error('Error adding product', error);
    });
  }
}
