// actions.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent {
  constructor(private router: Router) {}

  navigateToTranslation() {
    this.router.navigate(['/translation']);
  }

  navigateToChatbot() {
    this.router.navigate(['/chatbot']);
  }

  navigateToQuiz() {
    this.router.navigate(['/quiz']);
  }
  navigateToAbout() {
    this.router.navigate(["/about"])
  }
}
