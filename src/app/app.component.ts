<<<<<<< HEAD
<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
=======
=======
>>>>>>> dff2b1e4d321b4e11f75c37945b1e5e6355e2069
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';

>>>>>>> 7c04d8b (Adicionar componente de objetivos e outros)

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
<<<<<<< HEAD
  imports: [RouterOutlet],
=======
  imports: [CommonModule , RouterOutlet, NavbarComponent , SidenavComponent , RouterLink , RouterLinkActive, RouterModule],
>>>>>>> 7c04d8b (Adicionar componente de objetivos e outros)
=======
  imports: [CommonModule , RouterOutlet, NavbarComponent , SidenavComponent , RouterLink , RouterLinkActive, RouterModule],
>>>>>>> dff2b1e4d321b4e11f75c37945b1e5e6355e2069
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'financify';
  showSideNav: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });
  }

  ngOnInit() {
    this.checkRoute(this.router.url);
  }

  checkRoute(url: string) {
    this.showSideNav = !(url.includes('/login') || url.includes('/register'));
  }

}
