import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface ConjugationItem {
  id: number;
  verb_english: string;
  verb_german: string;
  pronoun_english: string;
  pronoun_german: string;
  tense: string;
  correctAnswer?: string;
}

interface UserAnswer extends ConjugationItem {
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

@Component({
  selector: "app-conjugation",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./conjugation.component.html",
  styleUrls: ["./conjugation.component.css"],
})
export class ConjugationComponent implements OnInit {
  @ViewChild('answerInput') answerInput!: ElementRef;

  sidebarOpen = false;
  quizStarted = false;
  reviewMode = false;

  currentIndex = 0;
  score = 0;

  userAnswer = '';
  answerStatus: 'correct' | 'incorrect' | null = null;
  answerChecked = false;
  correctAnswer = '';

  userAnswers: UserAnswer[] = [];

  // Sample conjugation data
  conjugationData: ConjugationItem[] = [
    {
      id: 1,
      verb_english: "to have",
      verb_german: "haben",
      pronoun_english: "you",
      pronoun_german: "du",
      tense: "present",
      correctAnswer: "hast"
    },
    {
      id: 2,
      verb_english: "to be",
      verb_german: "sein",
      pronoun_english: "I",
      pronoun_german: "ich",
      tense: "present",
      correctAnswer: "bin"
    },
    {
      id: 3,
      verb_english: "to go",
      verb_german: "gehen",
      pronoun_english: "we",
      pronoun_german: "wir",
      tense: "present",
      correctAnswer: "gehen"
    },
    {
      id: 4,
      verb_english: "to eat",
      verb_german: "essen",
      pronoun_english: "they",
      pronoun_german: "sie",
      tense: "present",
      correctAnswer: "essen"
    },
    {
      id: 5,
      verb_english: "to drink",
      verb_german: "trinken",
      pronoun_english: "he",
      pronoun_german: "er",
      tense: "present",
      correctAnswer: "trinkt"
    }
  ];

  // Audio elements for feedback
  private correctSound = new Audio();
  private incorrectSound = new Audio();

  get currentQuestion(): ConjugationItem {
    return this.conjugationData[this.currentIndex];
  }

  ngOnInit(): void {
    // Initialize audio files
    this.correctSound.src = 'assets/sounds/correct.mp3';
    this.incorrectSound.src = 'assets/sounds/incorrect.mp3';

    // Preload audio
    this.correctSound.load();
    this.incorrectSound.load();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  startQuiz(): void {
    this.quizStarted = true;
    this.reviewMode = false;
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.resetQuestion();

    // Focus on the input field
    setTimeout(() => {
      if (this.answerInput) {
        this.answerInput.nativeElement.focus();
      }
    }, 100);
  }

  checkAnswer(): void {
    if (this.answerChecked || !this.userAnswer.trim()) return;

    const correctAnswer = this.currentQuestion.correctAnswer || '';
    this.correctAnswer = correctAnswer;

    // Check if the answer is correct (case insensitive)
    const isCorrect = this.userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    // Update status and score
    this.answerStatus = isCorrect ? 'correct' : 'incorrect';
    if (isCorrect) {
      this.score++;
      this.correctSound.play();
    } else {
      this.incorrectSound.play();
    }

    // Save the user's answer
    this.userAnswers.push({
      ...this.currentQuestion,
      userAnswer: this.userAnswer,
      isCorrect: isCorrect,
      correctAnswer: correctAnswer
    });

    this.answerChecked = true;
  }

  nextQuestion(): void {
    if (this.currentIndex < this.conjugationData.length - 1) {
      this.currentIndex++;
      this.resetQuestion();
    } else if (this.answerChecked) {
      // End of quiz
      this.toggleReviewMode();
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;

      // Restore previous answer if available
      const previousAnswer = this.userAnswers.find(
        answer => answer.id === this.currentQuestion.id
      );

      if (previousAnswer) {
        this.userAnswer = previousAnswer.userAnswer;
        this.answerStatus = previousAnswer.isCorrect ? 'correct' : 'incorrect';
        this.answerChecked = true;
        this.correctAnswer = previousAnswer.correctAnswer;
      } else {
        this.resetQuestion();
      }
    }
  }

  resetQuestion(): void {
    this.userAnswer = '';
    this.answerStatus = null;
    this.answerChecked = false;
    this.correctAnswer = '';

    // Focus on the input field
    setTimeout(() => {
      if (this.answerInput) {
        this.answerInput.nativeElement.focus();
      }
    }, 100);
  }

  toggleReviewMode(): void {
    this.reviewMode = !this.reviewMode;
  }

  returnToQuiz(): void {
    this.reviewMode = false;

    // If quiz is completed, restart
    if (this.currentIndex >= this.conjugationData.length - 1 && this.answerChecked) {
      this.startQuiz();
    }
  }
}
