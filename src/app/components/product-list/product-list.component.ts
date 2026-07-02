import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.list().subscribe({
      next: (products) => (this.products = products),
      error: () => (this.error = 'Failed to load products. Is the backend running?')
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) {
      return;
    }
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: () => (this.error = 'Failed to delete product.')
    });
  }
}
