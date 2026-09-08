import { Component, computed, inject } from '@angular/core';
import { AdminComponent } from "../components/admin-component/admin-component";
import { UserService } from '../services/user-service';
import { AuthService } from '../services/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-main',
  imports: [AdminComponent, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  
  authService=inject(AuthService)
  isAdmin = computed(()=>{
    if (this.authService.role()==="admin"){
      return true
    }
    else{
      return false
    }
  })
  username=computed(()=>{
    return this.authService.username()
  })
}
