import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface QuizWord {
  english: string
  synonym: string
  antonym: string
}

interface UserAnswer {
  wordIndex: number
  synonym: string
  antonym: string
  synonymCorrect: boolean | null
  antonymCorrect: boolean | null
  checked: boolean
}

@Component({
  selector: "app-synonymantonym",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./synonymantonym.component.html",
  styleUrls: ["./synonymantonym.component.css"],
})
export class SynonymantonymComponent implements OnInit, OnDestroy {
  // UI state
  sidebarOpen = false
  quizStarted = false
  quizCompleted = false
  reviewMode = false
  reviewFilter: "all" | "correct" | "incorrect" = "all"

  // Quiz data
  quizWords: QuizWord[] = [
    { english: "happy", synonym: "froh", antonym: "traurig" },
    { english: "big", synonym: "groß", antonym: "klein" },
    { english: "fast", synonym: "schnell", antonym: "langsam" },
    { english: "beautiful", synonym: "schön", antonym: "hässlich" },
    { english: "strong", synonym: "stark", antonym: "schwach" },
    { english: "rich", synonym: "reich", antonym: "arm" },
    { english: "hot", synonym: "heiß", antonym: "kalt" },
    { english: "easy", synonym: "einfach", antonym: "schwierig" },
    { english: "loud", synonym: "laut", antonym: "leise" },
    { english: "light", synonym: "hell", antonym: "dunkel" },
  ]

  // Quiz state
  currentIndex = 0
  userAnswers: UserAnswer[] = []
  score = 0
  timer = 0
  totalTime = 0
  timerInterval: any = null

  // Computed properties
  get currentWord(): QuizWord {
    return this.quizWords[this.currentIndex]
  }

  get filteredReviewAnswers(): UserAnswer[] {
    if (this.reviewFilter === "all") {
      return this.userAnswers
    } else if (this.reviewFilter === "correct") {
      return this.userAnswers.filter((answer) => answer.synonymCorrect && answer.antonymCorrect)
    } else {
      return this.userAnswers.filter((answer) => !answer.synonymCorrect || !answer.antonymCorrect)
    }
  }

  ngOnInit(): void {
    this.initializeQuiz()
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  initializeQuiz(): void {
    this.userAnswers = this.quizWords.map((_, index) => ({
      wordIndex: index,
      synonym: "",
      antonym: "",
      synonymCorrect: null,
      antonymCorrect: null,
      checked: false,
    }))
    this.currentIndex = 0
    this.score = 0
    this.timer = 0
    this.totalTime = 0
    this.quizStarted = false
    this.quizCompleted = false
    this.reviewMode = false
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  toggleReviewMode(): void {
    this.reviewMode = !this.reviewMode
    this.reviewFilter = "all"
  }

  setReviewFilter(filter: "all" | "correct" | "incorrect"): void {
    this.reviewFilter = filter
  }

  startQuiz(): void {
    this.quizStarted = true
    this.startTimer()
  }

  startTimer(): void {
    this.stopTimer() // Clear any existing timer
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
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  checkAnswer(): void {
    const currentAnswer = this.userAnswers[this.currentIndex]

    if (currentAnswer.checked) {
      return // Already checked
    }

    // Check synonym
    const synonymCorrect =
      this.normalizeAnswer(currentAnswer.synonym) === this.normalizeAnswer(this.currentWord.synonym)

    // Check antonym
    const antonymCorrect =
      this.normalizeAnswer(currentAnswer.antonym) === this.normalizeAnswer(this.currentWord.antonym)

    // Update answer status
    currentAnswer.synonymCorrect = synonymCorrect
    currentAnswer.antonymCorrect = antonymCorrect
    currentAnswer.checked = true

    // Update score
    if (synonymCorrect && antonymCorrect) {
      this.score++
      this.playSound("correct")
    } else {
      this.playSound("incorrect")
    }

    // Check if quiz is completed
    if (this.isQuizCompleted()) {
      this.finishQuiz()
    }
  }

  normalizeAnswer(answer: string): string {
    return answer.trim().toLowerCase()
  }

  playSound(type: "correct" | "incorrect"): void {
    const soundElement = document.getElementById(
      type === "correct" ? "correct-sound" : "incorrect-sound",
    ) as HTMLAudioElement

    if (soundElement) {
      soundElement.currentTime = 0
      soundElement.play().catch((error) => console.error("Error playing sound:", error))
    }
  }

  previousWord(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--
    }
  }

  nextWord(): void {
    if (this.currentIndex < this.quizWords.length - 1) {
      this.currentIndex++
    } else if (this.isQuizCompleted()) {
      this.finishQuiz()
    }
  }

  isQuizCompleted(): boolean {
    return this.userAnswers.every((answer) => answer.checked)
  }

  finishQuiz(): void {
    this.quizCompleted = true
    this.quizStarted = false
    this.totalTime = this.timer
    this.stopTimer()
  }

  restartQuiz(): void {
    this.initializeQuiz()
    this.startQuiz()
  }
}
