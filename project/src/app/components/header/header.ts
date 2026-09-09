import { Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { SearchService } from '../../services/search-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ɵInternalFormsSharedModule,FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  searchService=inject(SearchService)
  authService=inject(AuthService)
  router=inject(Router)
  

  searching(value:string){
    this.searchService.searchTerm.set(value)
  }
  
  isAuthenticated=computed(()=>{
    return this.authService.isAuthenticated()
  })
  username=computed(()=>{
    return this.authService.username()
  })
  logout(){
    this.authService.logoutUser().subscribe(()=>{
        this.router.navigate(['/login'])
    })
  }
}
