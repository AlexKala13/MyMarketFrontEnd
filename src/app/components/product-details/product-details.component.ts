import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import { ProductDetails } from '../../models/product-details.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
    }
  }

  loadProductDetails(id: number) {
    this.loading = true;
    this.productService.getProductDetails(id).subscribe(
      response => {
        if (response && response.data) {
          this.product = { ...response.data, photos: response.data.photos?.['$values'] || [] } as ProductDetails;
          console.log(response.data);
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
}
