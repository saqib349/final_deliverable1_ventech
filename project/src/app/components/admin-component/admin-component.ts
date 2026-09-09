import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-component',
  imports: [FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit {
  users=signal<Array<Admin_users>>([])
  message=""
  userService=inject(UserService)
  showEditModal = signal(false);

  editUser: Admin_users = {
    _id: '',
    password: '',
    username: '',
    email: '',
    role: ''
  };

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

  DeleteUser(_id:string){
    this.userService.deleteUser(_id).subscribe({
      next:()=>{
        this.users.update(u=>{
          return u.filter(user=>user._id!==_id)
        })
      },
      error:(err)=>{
        this.message=err.error.message
      }
    })
  }

   EditUser(user: Admin_users) {

    // Copy selected user's data into editUser
    this.editUser = {
      _id: user._id,
      password: user.password,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Open modal
    this.showEditModal.set(true);
  }


  UpdateUser() {

    this.userService.updateUser(this.editUser).subscribe({

      next: (result) => {

        console.log('Updated user:', result);

        const { data } = result;
        console.log(data)

        // Update user in frontend immediately
        this.users.update(users =>
          users.map(user =>
            user._id === this.editUser._id
              ? data
              : user
          )
        );

        // Close modal after successful update
        this.closeEditModal();
      },

      error: (err) => {

        this.message = err.error.message;

      }

    });

  }


  closeEditModal() {

    this.showEditModal.set(false);

    // Reset edit form
    this.editUser = {
      _id: '',
      password: '',
      username: '',
      email: '',
      role: ''
    };

  }

  
}
