import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ShowAdvicesComponent } from './show-advices/show-advices.component';

@Component ({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ShowAdvicesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'financify';
}
