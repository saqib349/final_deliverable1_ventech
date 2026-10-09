import { Component, computed, inject, OnInit } from '@angular/core';
import { AdminComponent } from "../components/admin-component/admin-component";
import { UserService } from '../services/user-service';
import { AuthService } from '../services/auth-service';
import { RouterLink } from "@angular/router";
import { IdleTimeCheck } from '../services/idle-time-check';

@Component({
  selector: 'app-main',
  imports: [AdminComponent, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  ngOnInit(): void {
    console.log(
      'Authenticated when Main initializes:',
      this.authService.isAuthenticated()
    );

    if (this.authService.isAuthenticated()) {
      console.log('Starting idle watcher');
      this.idleTimeCheck.startWatching();
    } else {
      console.log('User is not authenticated');
    }
  }

  idleTimeCheck = inject(IdleTimeCheck)
  authService = inject(AuthService)
  authenticated = this.authService.isAuthenticated

  // constructor() {
  //   this.idleTimeCheck.startWatching();
  // }
  isAdmin = computed(() => {
    if (this.authService.role() === "admin") {
      return true
    }
    else {
      return false
    }
  })
  username = computed(() => {
    return this.authService.username()
  })
}
