import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms"

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackText: string = '';
  selectedMood: string | null = null;
sidebarOpen: any;

  selectMood(mood: string): void {
    this.selectedMood = mood;
  }

  submitFeedback(): void {
    if (!this.feedbackText.trim()) {
      return;
    }

    const feedback = {
      text: this.feedbackText,
      mood: this.selectedMood,
      timestamp: new Date()
    };

    console.log('Feedback soumis:', feedback);
    // Ici, vous pouvez ajouter le code pour envoyer le feedback à votre API

    // Réinitialiser le formulaire
    this.feedbackText = '';
    this.selectedMood = null;
  }
}
