import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"

interface Question {
  id: number
  sentence: string
  translation: string
  scrambled_sentence: string
  question_text: string
  correct_answer: string
}

@Component({
  selector: "app-word",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"],
})
export class WordComponent implements OnInit, OnDestroy {
  sidebarOpen = false
  reviewMode = false

  // Quiz state
  questions: Question[] = []
  currentQuestionIndex = 0
  currentQuestion: Question | null = null
  availableWords: string[] = []
  selectedWords: string[] = []
  isCorrect = false
  isIncorrect = false
  quizCompleted = false
  score = 0

  // Timer
  timeLeft = 0
  totalTime = 0
  timerInterval: any

  // Audio
  correctSound = new Audio("assets/sounds/correct.mp3")
  incorrectSound = new Audio("assets/sounds/incorrect.mp3")

  constructor() {
    // Sample questions
    this.questions = [
      {
        id: 1,
        sentence: "Ich bin ein Student.",
        translation: "I am a student.",
        scrambled_sentence: "ein Student. Ich bin",
        question_text: "Rearrange the words to form a correct sentence: ein Student. Ich bin",
        correct_answer: "Ich bin ein Student.",
      },
      {
        id: 2,
        sentence: "Das ist mein Hund.",
        translation: "This is my dog.",
        scrambled_sentence: "mein Hund. ist Das",
        question_text: "Rearrange the words to form a correct sentence: mein Hund. ist Das",
        correct_answer: "Das ist mein Hund.",
      },
      {
        id: 3,
        sentence: "Wir gehen ins Kino.",
        translation: "We are going to the cinema.",
        scrambled_sentence: "ins Kino. Wir gehen",
        question_text: "Rearrange the words to form a correct sentence: ins Kino. Wir gehen",
        correct_answer: "Wir gehen ins Kino.",
      },
      {
        id: 4,
        sentence: "Sie spricht Deutsch sehr gut.",
        translation: "She speaks German very well.",
        scrambled_sentence: "sehr gut. Deutsch Sie spricht",
        question_text: "Rearrange the words to form a correct sentence: sehr gut. Deutsch Sie spricht",
        correct_answer: "Sie spricht Deutsch sehr gut.",
      },
      {
        id: 5,
        sentence: "Er kauft ein neues Auto.",
        translation: "He is buying a new car.",
        scrambled_sentence: "ein neues Auto. Er kauft",
        question_text: "Rearrange the words to form a correct sentence: ein neues Auto. Er kauft",
        correct_answer: "Er kauft ein neues Auto.",
      },
    ]
  }

  ngOnInit(): void {
    this.startQuiz()
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  startQuiz(): void {
    this.currentQuestionIndex = 0
    this.score = 0
    this.quizCompleted = false
    this.totalTime = 0
    this.loadQuestion()
    this.startTimer()
  }

  loadQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex]
      this.availableWords = this.currentQuestion.scrambled_sentence.split(" ")
      this.selectedWords = []
      this.isCorrect = false
      this.isIncorrect = false
    } else {
      this.completeQuiz()
    }
  }

  selectWord(word: string): void {
    const index = this.availableWords.indexOf(word)
    if (index !== -1) {
      this.availableWords.splice(index, 1)
      this.selectedWords.push(word)
    }
  }

  removeWord(index: number): void {
    const word = this.selectedWords[index]
    this.selectedWords.splice(index, 1)
    this.availableWords.push(word)
  }

  checkAnswer(): void {
    if (!this.currentQuestion) return

    const userAnswer = this.selectedWords.join(" ")

    if (userAnswer === this.currentQuestion.correct_answer) {
      this.isCorrect = true
      this.isIncorrect = false
      this.score++
      this.correctSound.play()

      setTimeout(() => {
        this.currentQuestionIndex++
        this.loadQuestion()
      }, 1500)
    } else {
      this.isCorrect = false
      this.isIncorrect = true
      this.incorrectSound.play()

      setTimeout(() => {
        // Reset for retry
        this.isIncorrect = false
        this.availableWords = this.availableWords.concat(this.selectedWords)
        this.selectedWords = []
      }, 1500)
    }
  }

  completeQuiz(): void {
    this.quizCompleted = true
    this.currentQuestion = null
    this.stopTimer()
  }

  restartQuiz(): void {
    this.startQuiz()
  }

  startTimer(): void {
    this.timeLeft = 60 // 60 seconds per question
    this.stopTimer() // Clear any existing timer

    this.timerInterval = setInterval(() => {
      this.timeLeft--
      this.totalTime++

      if (this.timeLeft <= 0) {
        // Time's up for this question
        this.currentQuestionIndex++
        this.loadQuestion()
        this.timeLeft = 60 // Reset timer for next question
      }
    }, 1000)
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  toggleReviewMode(): void {
    this.reviewMode = !this.reviewMode
  }
}
