import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Question {
  id: number
  englishQuestion: string
  germanAnswer: string
}

interface AnsweredQuestion extends Question {
  userAnswer: string
  isCorrect: boolean
}

@Component({
  selector: "app-challenge",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./challenge.component.html",
  styleUrls: ["./challenge.component.css"],
})
export class ChallengeComponent implements OnInit, OnDestroy {
toggleSidebar() {
throw new Error('Method not implemented.')
}
toggleReviewMode() {
throw new Error('Method not implemented.')
}
  // Questions data
  questions: Question[] = [
    { id: 1, englishQuestion: "What is your name?", germanAnswer: "Wie heißt du?" },
    { id: 2, englishQuestion: "How are you?", germanAnswer: "Wie geht es dir?" },
    { id: 3, englishQuestion: "Where do you live?", germanAnswer: "Wo wohnst du?" },
    { id: 4, englishQuestion: "What time is it?", germanAnswer: "Wie spät ist es?" },
    { id: 5, englishQuestion: "I like to learn German", germanAnswer: "Ich lerne gern Deutsch" },
    { id: 6, englishQuestion: "Do you speak English?", germanAnswer: "Sprichst du Englisch?" },
    { id: 7, englishQuestion: "What is your favorite color?", germanAnswer: "Was ist deine Lieblingsfarbe?" },
    { id: 8, englishQuestion: "How old are you?", germanAnswer: "Wie alt bist du?" },
    { id: 9, englishQuestion: "I am hungry", germanAnswer: "Ich habe Hunger" },
    { id: 10, englishQuestion: "See you tomorrow", germanAnswer: "Bis morgen" },
  ]

  // Quiz state
  currentQuestionIndex = 0
  userAnswer = ""
  answerState: "neutral" | "correct" | "incorrect" = "neutral"
  score = 0
  quizCompleted = false
  answeredQuestions: AnsweredQuestion[] = []
  incorrectAnswers: AnsweredQuestion[] = []

  // Timer
  initialTime = 200 // 2 minutes in seconds
  remainingTime: number = this.initialTime
  timerInterval: any

  // Review mode
  reviewMode = false
  reviewIndex = 0

  // Audio elements
  correctSound: HTMLAudioElement
  incorrectSound: HTMLAudioElement

  constructor() {
    // Initialize audio elements
    this.correctSound = new Audio()
    this.correctSound.src = "assets/sounds/correct.mp3"

    this.incorrectSound = new Audio()
    this.incorrectSound.src = "assets/sounds/incorrect.mp3"
  }
  sidebarOpen = false
  ngOnInit(): void {
    this.startTimer()
  }

  ngOnDestroy(): void {
    this.clearTimer()
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex]
  }

  // Timer functions
  startTimer(): void {
    this.clearTimer()
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--
      } else {
        this.completeQuiz()
      }
    }, 1000)
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Answer checking
  checkAnswer(): void {
    if (!this.userAnswer.trim()) return

    // Normalize answers for comparison (lowercase, trim whitespace)
    const normalizedUserAnswer = this.userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = this.currentQuestion.germanAnswer.toLowerCase()

    // Check if answer is correct
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer

    // Update answer state for visual feedback
    this.answerState = isCorrect ? "correct" : "incorrect"

    // Play appropriate sound
    if (isCorrect) {
      this.playCorrectSound()
      this.score++
    } else {
      this.playIncorrectSound()
    }

    // Save the answered question
    const answeredQuestion: AnsweredQuestion = {
      ...this.currentQuestion,
      userAnswer: this.userAnswer,
      isCorrect,
    }

    this.answeredQuestions.push(answeredQuestion)

    if (!isCorrect) {
      this.incorrectAnswers.push(answeredQuestion)
    }

    // Reset for next question
    setTimeout(() => {
      this.answerState = "neutral"
      this.userAnswer = ""

      // Move to next question or complete quiz
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      } else {
        this.completeQuiz()
      }
    }, 1500)
  }

  // Navigation
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++
      this.userAnswer = ""
      this.answerState = "neutral"
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--
      this.userAnswer = ""
      this.answerState = "neutral"
    }
  }

  // Review mode
  startReviewMode(): void {
    this.reviewMode = true
    this.reviewIndex = 0
  }

  exitReviewMode(): void {
    this.reviewMode = false
  }

  nextReviewQuestion(): void {
    if (this.reviewIndex < this.incorrectAnswers.length - 1) {
      this.reviewIndex++
    }
  }

  previousReviewQuestion(): void {
    if (this.reviewIndex > 0) {
      this.reviewIndex--
    }
  }

  // Quiz completion
  completeQuiz(): void {
    this.clearTimer()
    this.quizCompleted = true
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0
    this.userAnswer = ""
    this.answerState = "neutral"
    this.score = 0
    this.quizCompleted = false
    this.answeredQuestions = []
    this.incorrectAnswers = []
    this.remainingTime = this.initialTime
    this.startTimer()
  }

  // Sound effects
  playCorrectSound(): void {
    this.correctSound.currentTime = 0
    this.correctSound.play().catch((error) => console.error("Error playing sound:", error))
  }

  playIncorrectSound(): void {
    this.incorrectSound.currentTime = 0
    this.incorrectSound.play().catch((error) => console.error("Error playing sound:", error))
  }

  // Feedback message
  getFeedbackMessage(): string {
    const percentage = (this.score / this.questions.length) * 100

    if (percentage === 100) {
      return "Perfect! You answered all the questions correctly!"
    } else if (percentage >= 80) {
      return "Great job! You answered most of the questions correctly."
    } else if (percentage >= 60) {
      return "Good job! You answered more than half of the questions correctly."
    } else if (percentage >= 40) {
      return "You answered a few questions correctly. Keep practicing!"
    } else {
      return "Keep practicing to improve your German skills."
    }

  }
}

