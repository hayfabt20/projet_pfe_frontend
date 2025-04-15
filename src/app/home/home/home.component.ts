// home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone : true ,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToActions() {
    this.router.navigate(['/actions']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
