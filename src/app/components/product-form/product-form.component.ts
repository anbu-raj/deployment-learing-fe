import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productId: number | null = null;
  error = '';
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get isEditMode(): boolean {
    return this.productId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.productService.get(this.productId).subscribe({
        next: (product) => this.form.patchValue(product),
        error: () => (this.error = 'Failed to load product.')
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      name: value.name!,
      description: value.description ?? '',
      price: value.price!,
      quantity: value.quantity!
    };

    const request = this.isEditMode
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => (this.error = 'Failed to save product.')
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
