import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AppRouting } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import routing

bootstrapApplication(AppComponent, {
  providers: [AppRouting, provideAnimations()] // Provide routing here
 // Provide routing here
}).catch(err => console.error(err));
