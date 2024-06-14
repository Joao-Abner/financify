import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(private productService: ProductService) {}

  async createProduct() {
    try {
      if (this.productForm.valid) {
        const createdProduct = await this.productService.createProduct(
          this.productForm.value
        );
        console.log('Produto criado:', createdProduct);
      } else {
        console.log('Formulário inválido');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  submitForm() {
    if (this.productForm.valid) {
      // Cadastrar a entidade no Web Storage
      localStorage.setItem('product', JSON.stringify(this.productForm.value));
      this.createProduct();
    } else {
      // Formulário inválido
      const errors = this.productForm?.get('name')?.errors;
      if (errors?.['required']) {
        console.log('Erro no campo nome:', errors['required']);
      }
      if (errors?.['pattern']) {
        console.log('Erro no campo nome:', errors['pattern']);
      }
    }
  }
}
