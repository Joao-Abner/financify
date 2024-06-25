import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,  private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$")
      ]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      const registered = this.authService.register(username, password);
      if (registered) {
        this.router.navigate(['/login']);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  }

  showPasswordRequirements(): boolean {
    const passwordControl = this.registerForm.get('password');
    return !!passwordControl && passwordControl.invalid && (passwordControl.dirty || passwordControl.touched);
  }

  goToLogin(): void {
    this.router.navigate(['login']);
  }
}
