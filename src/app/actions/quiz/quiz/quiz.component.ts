import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  constructor(private router: Router) {}


    navigateToFlashcard() {
      this.router.navigate(['/flashcard']);
    }
    navigateToChallenge() {
      this.router.navigate(['/challenge']);
    }
    navigateToSentence() {
      this.router.navigate(['/sentence']);
    }
    navigateToWord() {
      this.router.navigate(['/word']);
    }
    navigateToDictation() {
      this.router.navigate(['/dictation']);
    }
    navigateToConjugation() {
      this.router.navigate(['/conjugation']);
    }
    navigateToSynonymAntonym() {
      this.router.navigate(['/synonymantonym']);
    }
    navigateToCustom() {
      this.router.navigate(['/custom']);
    }
}
