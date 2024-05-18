import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <p>Received from parent: {{ data }}</p>
    <button (click)="sendMessage()">Send Message to parent</button>
  `,

  styleUrl: './child.component.css',
})
export class ChildComponent {
  @Input() data?: string;
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    this.messageEvent.emit('Hello from child');
  }
}
