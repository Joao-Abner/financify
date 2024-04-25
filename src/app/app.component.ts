import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <app-header></app-header> `,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FormsModule],
})
export class AppComponent {
  //Interpolation
  title = 'Financify';
  //---

  //Property Binding  (One way)
  imageUrl =
    'https://res.cloudinary.com/daqpjdyeu/image/upload/f_auto,q_auto/v1/financify/ijk6rt5pkbfjfnzybyry';
  //---

  //Event Binding
  onClick() {
    console.log('Button clicked!');
  }
  //---

  //Two Way  Data Binding (ngModel)
  name = 'Johnny B. Goode';
  //---
}
