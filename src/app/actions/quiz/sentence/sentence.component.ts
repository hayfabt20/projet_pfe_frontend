import { Component, type OnInit, type OnDestroy, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface QuizQuestion {
  _id: number
  sentence: string
  translation: string
  question_text: string
  correct_answer: string
}

interface UserAnswer {
  questionId: number
  answer: string
  isCorrect: boolean
}

@Component({
  selector: "app-sentence",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./sentence.component.html",
  styleUrls: ["./sentence.component.css"],
})
export class SentenceComponent implements OnInit, OnDestroy {
  @ViewChild("correctSound") correctSound!: ElementRef<HTMLAudioElement>
  @ViewChild("incorrectSound") incorrectSound!: ElementRef<HTMLAudioElement>
  @ViewChild("answerInput") answerInput!: ElementRef<HTMLInputElement>

  sidebarOpen = false
  reviewMode = false
  quizStarted = false
  timer = 0
  timerInterval: any
  currentIndex = 0
  userAnswer = ""
  isCorrect: boolean | null = null
  feedbackMessage = ""
  correctAnswers = 0
  totalQuestions = 0
  userAnswers: UserAnswer[] = []

  // Sample questions - replace with your actual data source
  questions: QuizQuestion[] = [
    {
      _id: 1,
      sentence: "Wir gehen ___ Kino.",
      translation: "We are going to the cinema.",
      question_text: "Complete the sentence: Wir gehen ___ Kino.",
      correct_answer: "ins",
    },
    {
      _id: 2,
      sentence: "Ich komme ___ Deutschland.",
      translation: "I come from Germany.",
      question_text: "Complete the sentence: Ich komme ___ Deutschland.",
      correct_answer: "aus",
    },
    {
      _id: 3,
      sentence: "Sie arbeitet ___ einem Krankenhaus.",
      translation: "She works in a hospital.",
      question_text: "Complete the sentence: Sie arbeitet ___ einem Krankenhaus.",
      correct_answer: "in",
    },
    {
      _id: 4,
      sentence: "Er fährt ___ dem Bus zur Arbeit.",
      translation: "He goes to work by bus.",
      question_text: "Complete the sentence: Er fährt ___ dem Bus zur Arbeit.",
      correct_answer: "mit",
    },
    {
      _id: 5,
      sentence: "Das Buch liegt ___ dem Tisch.",
      translation: "The book is on the table.",
      question_text: "Complete the sentence: Das Buch liegt ___ dem Tisch.",
      correct_answer: "auf",
    },
  ]

  get currentQuestion(): QuizQuestion | undefined {
    return this.questions[this.currentIndex]
  }

  ngOnInit(): void {
    this.totalQuestions = this.questions.length
    // Initialize user answers array
    this.userAnswers = this.questions.map((q) => ({
      questionId: q._id,
      answer: "",
      isCorrect: false,
    }))
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  toggleReviewMode(): void {
    this.reviewMode = !this.reviewMode
  }

  startQuiz(): void {
    this.quizStarted = true
    this.startTimer()
    setTimeout(() => {
      this.answerInput.nativeElement.focus()
    }, 100)
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
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  formatSentence(sentence: string): string {
    return sentence.replace("___", '<span class="blank">___</span>')
  }

  checkAnswer(): void {
    if (!this.quizStarted || !this.currentQuestion) return

    const correctAnswer = this.currentQuestion.correct_answer
    this.isCorrect = this.userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()

    // Update user answers array
    this.userAnswers[this.currentIndex] = {
      questionId: this.currentQuestion._id,
      answer: this.userAnswer,
      isCorrect: this.isCorrect,
    }

    // Update correct answers count
    if (this.isCorrect) {
      this.correctAnswers = this.userAnswers.filter((a) => a.isCorrect).length
    }

    // Play sound and show feedback
    if (this.isCorrect) {
      this.correctSound.nativeElement.play()
      this.feedbackMessage = "Correct!"
    } else {
      this.incorrectSound.nativeElement.play()
      this.feedbackMessage = `Incorrect. The correct answer is "${correctAnswer}".`
    }

    // Clear feedback after 3 seconds
    setTimeout(() => {
      this.feedbackMessage = ""
    }, 3000)
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++
      this.resetQuestionState()
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.resetQuestionState()
    }
  }

  resetQuestionState(): void {
    this.userAnswer = this.userAnswers[this.currentIndex].answer
    this.isCorrect = null
    this.feedbackMessage = ""
  }
}
