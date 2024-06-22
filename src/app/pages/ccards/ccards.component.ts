import { Component } from '@angular/core';
import { SidenavComponent } from '../../shared/sidenav/sidenav.component';

@Component({
  selector: 'app-ccards',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './ccards.component.html',
  styleUrl: './ccards.component.css'
})
export class CcardsComponent {

}
