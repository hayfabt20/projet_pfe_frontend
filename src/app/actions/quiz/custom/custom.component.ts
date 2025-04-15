import { Component, type OnInit, type OnDestroy, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface QuizItem {
  imageUrl: string
  imageAlt: string
  germanWord: string
  userAnswer?: string
  answered: boolean
  isCorrect: boolean
}

@Component({
  selector: "app-custom",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./custom.component.html",
  styleUrls: ["./custom.component.css"],
})
export class CustomComponent implements OnInit, OnDestroy {
  @ViewChild("answerInput") answerInput!: ElementRef

  sidebarOpen = false
  quizStarted = false
  reviewMode = false

  quizItems: QuizItem[] = [
    { imageUrl: "/assets/images/house.jpg", imageAlt: "House", germanWord: "Haus", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/car.jpg", imageAlt: "Car", germanWord: "Auto", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/tree.jpg", imageAlt: "Tree", germanWord: "Baum", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/dog.jpg", imageAlt: "Dog", germanWord: "Hund", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/cat.jpg", imageAlt: "Cat", germanWord: "Katze", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/book.jpg", imageAlt: "Book", germanWord: "Buch", answered: false, isCorrect: false },
    { imageUrl: "/assets/images/apple.png", imageAlt: "Apple", germanWord: "Apfel", answered: false, isCorrect: false },
    {
      imageUrl: "/assets/images/water.jpg",
      imageAlt: "Water",
      germanWord: "Wasser",
      answered: false,
      isCorrect: false,
    },
  ]

  currentIndex = 0
  userAnswer = ""
  isCorrect = false
  isIncorrect = false
  score = 0
  timer = 0
  finalTime = 0
  timerInterval: any

  // Audio elements
  correctSound = new Audio("/assets/sounds/correct.mp3")
  incorrectSound = new Audio("/assets/sounds/incorrect.mp3")

  get currentItem(): QuizItem {
    return this.quizItems[this.currentIndex]
  }

  ngOnInit(): void {
    // Preload sounds
    this.correctSound.load()
    this.incorrectSound.load()
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  toggleReviewMode(): void {
    if (!this.quizStarted && !this.reviewMode) {
      return // Don't toggle if quiz hasn't started yet
    }

    if (this.quizStarted && !this.reviewMode) {
      // Finish the quiz first
      this.finishQuiz()
    } else {
      this.reviewMode = !this.reviewMode
    }
  }

  startQuiz(): void {
    this.quizStarted = true
    this.reviewMode = false
    this.resetQuiz()
    this.startTimer()

    // Focus on the input field
    setTimeout(() => {
      if (this.answerInput) {
        this.answerInput.nativeElement.focus()
      }
    }, 100)
  }

  resetQuiz(): void {
    this.quizItems.forEach((item) => {
      item.answered = false
      item.isCorrect = false
      item.userAnswer = ""
    })
    this.currentIndex = 0
    this.userAnswer = ""
    this.isCorrect = false
    this.isIncorrect = false
    this.score = 0
    this.timer = 0
  }

  startTimer(): void {
    this.stopTimer()
    this.timer = 0
    this.timerInterval = setInterval(() => {
      this.timer++
    }, 1000)
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  checkAnswer(): void {
    if (this.currentItem.answered) return

    const userAnswerTrimmed = this.userAnswer.trim().toLowerCase()
    const correctAnswerLower = this.currentItem.germanWord.toLowerCase()

    this.currentItem.userAnswer = this.userAnswer
    this.currentItem.answered = true

    if (userAnswerTrimmed === correctAnswerLower) {
      this.currentItem.isCorrect = true
      this.score++
      this.isCorrect = true
      this.isIncorrect = false
      this.correctSound.play()
    } else {
      this.currentItem.isCorrect = false
      this.isCorrect = false
      this.isIncorrect = true
      this.incorrectSound.play()
    }

    // Automatically go to next question after a delay
    setTimeout(() => {
      if (this.currentIndex < this.quizItems.length - 1) {
        this.goToNext()
      }
    }, 2000)
  }

  goToPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.userAnswer = this.currentItem.userAnswer || ""
      this.isCorrect = this.currentItem.isCorrect
      this.isIncorrect = this.currentItem.answered && !this.currentItem.isCorrect
    }
  }

  goToNext(): void {
    if (this.currentIndex < this.quizItems.length - 1) {
      this.currentIndex++
      this.userAnswer = this.currentItem.userAnswer || ""
      this.isCorrect = this.currentItem.isCorrect
      this.isIncorrect = this.currentItem.answered && !this.currentItem.isCorrect

      // Focus on the input field if not answered
      if (!this.currentItem.answered && this.answerInput) {
        setTimeout(() => {
          this.answerInput.nativeElement.focus()
        }, 100)
      }
    }
  }

  allAnswered(): boolean {
    return this.quizItems.every((item) => item.answered)
  }

  finishQuiz(): void {
    this.stopTimer()
    this.finalTime = this.timer
    this.reviewMode = true
    this.quizStarted = false
  }

  restartQuiz(): void {
    this.reviewMode = false
    this.startQuiz()
  }

  goBackToQuiz(): void {
    // Cette méthode permet de naviguer vers la page principale des quiz
    // Vous pouvez utiliser le Router d'Angular pour la navigation
    // Si vous utilisez le Router, vous devez l'injecter dans le constructeur

    // Si vous utilisez le Router:
    // this.router.navigate(['/quiz']);

    // Pour l'instant, nous allons simplement réinitialiser l'état du composant
    this.quizStarted = false
    this.reviewMode = false
    this.stopTimer()
  }
}
