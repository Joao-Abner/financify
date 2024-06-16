import { Component } from '@angular/core';
import { AdviceService } from '../advice.service'; 
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-show-advices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-advices.component.html',
  styleUrl: './show-advices.component.css'
})
export class ShowAdvicesComponent {
  advices: string[] = [];
  loading: boolean = false;

  constructor(private adviceService: AdviceService) { }

  fetchAdvices() {
    this.loading = true;
    this.adviceService.getMultipleAdvices(5).subscribe({
      next: (advices: string[]) => {
        this.advices = advices;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching advices', error);
        this.loading = false;
      }
    });
  }
}
