import { Component } from "@angular/core"
import  { Router } from "@angular/router"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(["/login"])
  }

  navigateToSignup() {
    this.router.navigate(["/signup"])
  }

  navigateToAbout() {
    this.router.navigate(["/about"])
  }
}

