import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
@Component({
  selector: "app-flashcard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./flashcard.component.html",
  styleUrls: ["./flashcard.component.css"],
})
export class FlashcardComponent implements OnInit, OnDestroy {

  words = [
    { english: "Apple", german: "der Apfel" },
    { english: "House", german: "das Haus" },
    { english: "Car", german: "das Auto" },
    { english: "Book", german: "das Buch" },
  ]

  currentIndex = 0
  isFlipped = false
  isCorrect = false
  isIncorrect = false
  userAnswer = ""

  // Nouveaux éléments
  timer = 0
  timerInterval: any
  isTimerRunning = false
  reviewMode = false
  reviewedCards: {
    word: { english: string; german: string }
    wasCorrect: boolean
    timeSpent: number
  }[] = []
  correctSound = new Audio("assets/sounds/correct.mp3")
  incorrectSound = new Audio("assets/sounds/incorrect.mp3")

  // État de la sidebar
  sidebarOpen = false

  ngOnInit() {
    // Préchargement des sons
    this.correctSound.load()
    this.incorrectSound.load()
  }

  ngOnDestroy() {
    this.stopTimer()
  }

  flipCard() {
    this.isFlipped = !this.isFlipped
    // Reset validation states when flipping
    this.isCorrect = false
    this.isIncorrect = false
  }

  checkAnswer() {
    const correctAnswer = this.words[this.currentIndex].german.toLowerCase().trim()
    const userInput = this.userAnswer.toLowerCase().trim()

    // Flip the card to show the answer
    this.isFlipped = true

    // Stop the timer
    const timeSpent = this.stopTimer()

    // Check if the answer is correct
    if (userInput === correctAnswer) {
      this.isCorrect = true
      this.isIncorrect = false
      this.correctSound.play()
    } else {
      this.isCorrect = false
      this.isIncorrect = true
      this.incorrectSound.play()
    }

    // Add to reviewed cards
    this.reviewedCards.push({
      word: this.words[this.currentIndex],
      wasCorrect: this.isCorrect,
      timeSpent: timeSpent,
    })

    // Reset validation states after 1.5 seconds
    setTimeout(() => {
      this.isCorrect = false
      this.isIncorrect = false
    }, 1500)
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.resetState()
    }
  }

  nextCard() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++
      this.resetState()
    }
  }

  resetState() {
    this.isFlipped = false
    this.isCorrect = false
    this.isIncorrect = false
    this.userAnswer = ""
    this.resetTimer()
  }

  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true
      this.timerInterval = setInterval(() => {
        this.timer += 10 // Incrémente de 10ms
      }, 10)
    }
  }

  stopTimer(): number {
    if (this.isTimerRunning) {
      clearInterval(this.timerInterval)
      this.isTimerRunning = false
    }
    return this.timer
  }

  resetTimer() {
    this.stopTimer()
    this.timer = 0
    this.startTimer()
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`
  }

  toggleReviewMode() {
    this.reviewMode = !this.reviewMode
    if (!this.reviewMode) {
      this.resetState()
    } else {
      this.stopTimer()
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen
  }
}
