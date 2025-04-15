import { Component, type OnInit } from "@angular/core"
import {  Router, NavigationEnd, RouterOutlet, type Event as RouterEvent } from "@angular/router"
import { NavbarComponent } from "./Layout/navbar/navbar.component"
import { CommonModule } from "@angular/common"
import { filter } from "rxjs/operators"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "deutsch-assistant"
  showNavbar = true

  // Routes where navbar should be hidden
  private hideNavbarRoutes = ["/login", "/signup", "/flashcard" , "/feedback" , "/challenge", "/sentence", "/word", "/dictation"
    , "/conjugation" , "/synonymantonym" , "/custom" ]

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if current route is in the hideNavbarRoutes array
        this.showNavbar = !this.hideNavbarRoutes.some((route) => event.urlAfterRedirects.startsWith(route))
      })
  }
}

