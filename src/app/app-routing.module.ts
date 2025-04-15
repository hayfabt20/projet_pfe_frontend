import { NgModule } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signup/signup.component';
import { ActionsComponent } from './actions/actions/actions.component';
import { AboutComponent } from './about/about/about.component';
import { HomeComponent } from './home/home/home.component';
import { ChatbotComponent } from './actions/chatbot/chatbot/chatbot.component';
import { QuizComponent } from './actions/quiz/quiz/quiz.component';
import { TranslationComponent } from './actions/traslation/translation/translation.component';
import { FlashcardComponent } from './actions/quiz/flashcard/flashcard.component';
import { ChallengeComponent } from './actions/quiz/challenge/challenge.component';
import { SentenceComponent } from './actions/quiz/sentence/sentence.component';
import { FeedbackComponent } from './actions/quiz/feedback/feedback.component';
import { WordComponent } from './actions/quiz/word/word.component';
import { DictationComponent } from './actions/quiz/dictation/dictation.component';
import { ConjugationComponent } from './actions/quiz/conjugation/conjugation.component';
import { SynonymantonymComponent } from './actions/quiz/synonymantonym/synonymantonym.component';
import { CustomComponent } from './actions/quiz/custom/custom.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SigninComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'chatbot', component: ChatbotComponent },
  {  path: 'quiz', component: QuizComponent },
  { path: 'translation', component: TranslationComponent },
  { path: 'flashcard', component: FlashcardComponent },
  { path: 'challenge', component: ChallengeComponent },
  { path: 'sentence', component: SentenceComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'word', component: WordComponent },
  { path: 'dictation', component: DictationComponent },
  { path: 'conjugation', component: ConjugationComponent },
  { path: 'synonymantonym', component: SynonymantonymComponent },
  { path: 'custom', component: CustomComponent },
];


export const AppRouting = provideRouter(routes);
