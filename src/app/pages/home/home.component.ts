import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { SidenavComponent } from '../../shared/sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentUser: any;

  constructor(private authService: AuthService) {}

}
