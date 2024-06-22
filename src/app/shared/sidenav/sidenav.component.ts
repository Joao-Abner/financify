import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  isNavbarOpen = false;

  constructor(private router: Router) {}

  goTo(routePath: string) {
    this.router.navigate([routePath]);
  }

  isActive(routePath: string): boolean {
    return this.router.isActive(routePath, true);
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any): void {
    if (this.isNavbarOpen && !event.target.closest('.navbar-toggler')) {
      this.isNavbarOpen = false;
    }
  }
}
