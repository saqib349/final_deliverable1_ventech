import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-admin-component',
  imports: [],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit {
  users=signal<Array<Admin_users>>([])
  message=""
  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next:(result)=>{
        console.log(result.data)
         this.users.set(result.data)
      },
      error:(err)=>{
        this.message=err.error.message
      }
    })
   
  }
  userService=inject(UserService)

  
}
