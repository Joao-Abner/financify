<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
=======
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
  imports: [RouterOutlet],
=======
  imports: [CommonModule , RouterOutlet, NavbarComponent , SidenavComponent , RouterLink , RouterLinkActive, RouterModule],
>>>>>>> 7c04d8b (Adicionar componente de objetivos e outros)
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
