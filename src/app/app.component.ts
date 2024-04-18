import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { AloMundoComponent } from './alo-mundo/alo-mundo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HelloWorldComponent, AloMundoComponent],
})
export class AppComponent {
  title = 'financify';
}
