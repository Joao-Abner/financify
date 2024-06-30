import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})

export class QuotesComponent implements OnInit{
  private apiUrl: string = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,LTC-BRL,CHF-BRL,CNY-BRL,BTC-BRL,ETH-BRL,DOGE-BRL'
  quotes: any[] = [];

  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchQuotesData();    
  }

  fetchQuotesData(){
    this.http.get(this.apiUrl).subscribe((data: any) => {
      this.quotes = Object.values(data);
    })
  }

}
