import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../pages/transactions/transaction.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentUser: any;

  constructor(private router: Router, private authService: AuthService, private transactionService: TransactionService) {}

  getUser() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentUser = this.currentUser.username;    
  }

  logout() {
    this.authService.logout();
    this.transactionService.clearDataOnLogout();
    this.router.navigate(['/login']);
  }

}