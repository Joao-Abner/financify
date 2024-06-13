import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';

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

  submitForm() {
    if (this.productForm?.valid) {
      // Cadastrar a entidade no Web Storage
      localStorage.setItem('product', JSON.stringify(this.productForm.value));
    } else {
      // Formulário inválido, você pode apresentar os erros aqui
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
