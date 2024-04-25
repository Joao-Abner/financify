import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <app-header></app-header> `,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class AppComponent {
  title = 'financify';
  imageUrl =
    'https://res.cloudinary.com/daqpjdyeu/image/upload/v1696212452/cld-sample-4.jpg';
}
