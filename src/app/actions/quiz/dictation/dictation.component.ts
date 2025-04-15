import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

interface DictationItem {
  id: number;
  text: string;
  audio?: string; // URL to audio file if available
}

interface UserAnswer {
  expected: string;
  answer: string;
  isCorrect: boolean;
}

@Component({
  selector: "app-dictation",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dictation.component.html",
  styleUrls: ["./dictation.component.css"],
})
export class DictationComponent implements OnInit, OnDestroy {
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  // UI state
  sidebarOpen = false;
  reviewMode = false;
  quizStarted = false;
  isPlaying = false;
  isChecking = false;
  isCorrect: boolean | null = null;
  feedbackMessage = '';
  showCorrectAnswer = false;

  // Quiz data
  dictationItems: DictationItem[] = [
    { id: 1, text: "Guten Tag, wie geht es dir?" },
    { id: 2, text: "Ich lerne Deutsch seit zwei Jahren." },
    { id: 3, text: "Das Wetter ist heute sehr schön." },
    { id: 4, text: "Können Sie mir bitte helfen?" },
    { id: 5, text: "Ich möchte eine Tasse Kaffee bestellen." }
  ];

  // Current state
  currentIndex = 0;
  userInput = '';
  timer = 0;
  timerInterval: any = null;
  totalTime = 0;
  score: number | null = null;
  userAnswers: UserAnswer[] = [];

  // Audio elements
  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  correctSound = new Audio('assets/sounds/correct.mp3');
  incorrectSound = new Audio('assets/sounds/incorrect.mp3');

  constructor() {}

  ngOnInit(): void {
    // Initialize user answers array
    this.userAnswers = this.dictationItems.map(() => ({
      expected: '',
      answer: '',
      isCorrect: false
    }));

    // Preload sounds
    this.correctSound.load();
    this.incorrectSound.load();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }

  get currentDictation(): DictationItem {
    return this.dictationItems[this.currentIndex];
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleReviewMode(): void {
    this.reviewMode = !this.reviewMode;

    // If returning from review mode, reset the quiz if it was completed
    if (!this.reviewMode && this.score !== null) {
      this.resetQuiz();
    }
  }

  startQuiz(): void {
    this.quizStarted = true;
    this.startTimer();
    this.playDictation();

    // Focus the input field
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 100);
  }

  playDictation(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Use speech synthesis to speak the German text
    const utterance = new SpeechSynthesisUtterance(this.currentDictation.text);
    utterance.lang = 'de-DE'; // Set language to German
    utterance.rate = 0.8; // Slightly slower rate for better comprehension

    utterance.onend = () => {
      this.isPlaying = false;
    };

    this.speechSynthesis.speak(utterance);
  }

  checkAnswer(): void {
    if (!this.userInput.trim()) return;

    this.isChecking = true;

    // Compare user input with correct answer (case insensitive)
    const isCorrect = this.userInput.trim().toLowerCase() ===
                      this.currentDictation.text.toLowerCase();

    this.isCorrect = isCorrect;

    // Save the answer
    this.userAnswers[this.currentIndex] = {
      expected: this.currentDictation.text,
      answer: this.userInput,
      isCorrect: isCorrect
    };

    // Play sound and show feedback
    if (isCorrect) {
      this.correctSound.play();
      this.feedbackMessage = 'Correct! 👍';
    } else {
      this.incorrectSound.play();
      this.feedbackMessage = 'Incorrect. Try again or see the correct answer.';
      this.showCorrectAnswer = true;
    }

    // Check if all questions have been answered
    const allAnswered = this.userAnswers.every(answer =>
      answer.expected !== '' && answer.answer !== '');

    if (allAnswered) {
      this.calculateScore();
    }

    // Reset after a delay
    setTimeout(() => {
      this.isChecking = false;

      // If correct, move to next card automatically if not the last one
      if (isCorrect && this.currentIndex < this.dictationItems.length - 1) {
        this.nextCard();
      }
    }, 2000);
  }

  previousCard(): void {
    if (this.currentIndex > 0) {
      this.resetCardState();
      this.currentIndex--;
    }
  }

  nextCard(): void {
    if (this.currentIndex < this.dictationItems.length - 1) {
      this.resetCardState();
      this.currentIndex++;
    }
  }

  resetCardState(): void {
    this.userInput = '';
    this.isCorrect = null;
    this.feedbackMessage = '';
    this.showCorrectAnswer = false;
  }

  resetQuiz(): void {
    this.quizStarted = false;
    this.currentIndex = 0;
    this.userInput = '';
    this.timer = 0;
    this.totalTime = 0;
    this.score = null;
    this.isCorrect = null;
    this.feedbackMessage = '';
    this.showCorrectAnswer = false;

    // Reset user answers
    this.userAnswers = this.dictationItems.map(() => ({
      expected: '',
      answer: '',
      isCorrect: false
    }));

    this.stopTimer();
  }

  startTimer(): void {
    this.stopTimer(); // Ensure no duplicate timers

    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  calculateScore(): void {
    this.stopTimer();
    this.totalTime = this.timer;

    // Count correct answers
    const correctCount = this.userAnswers.filter(answer => answer.isCorrect).length;
    this.score = correctCount;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
