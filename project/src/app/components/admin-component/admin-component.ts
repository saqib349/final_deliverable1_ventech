import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal-component/modal-component';

@Component({
  selector: 'app-admin-component',
  imports: [FormsModule, RouterLink, CommonModule,ModalComponent],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit {

  users = signal<Array<Admin_users>>([]);

  message = '';
  loading = signal(false)
  userService = inject(UserService);
  modalMode = signal<'add' | 'edit'>('edit');

  showEditModal = signal(false);

  editUser: Admin_users = {
    _id: '',
    password: '',
    username: '',
    email: '',
    role: ''
  };


  ngOnInit(): void {
    this.loading.set(true)
    this.userService.getUsers().pipe(
      finalize(() => {
        console.log('FINALIZE RUNNING');
        this.loading.set(false);
        console.log('loading:', this.loading);
      })
    ).subscribe({

      next: (result) => {
        console.log(result.data);
        this.users.set(result.data);
      },

      error: (err) => {
        this.message = err.error.message;
      }

    });

  }


  DeleteUser(_id: string) {

    this.userService.deleteUser(_id).subscribe({

      next: () => {

        this.users.update(users =>
          users.filter(user => user._id !== _id)
        );

      },

      error: (err) => {
        this.message = err.error.message;
      }

    });

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

    this.modalMode.set('edit')
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
  addButton() {

    // Copy selected user's data into editUser
    this.editUser = {
      _id: '',
      password: '',
      username: '',
      email: '',
      role: ''
    };

    this.modalMode.set('add')
    this.showEditModal.set(true);
  }
  addUser() {

    this.userService.addUser(this.editUser).subscribe({

      next: (result) => {

        const { data } = result;
        console.log("added user: ", data)
        this.users.update(users => [...users, data]);
        this.closeEditModal();
        this.modalMode.set('edit')
      },

      error: (err) => {
        this.message = err.error.message;
      }

    });

  }
  SubmitUser(user:Admin_users) {
    if (this.modalMode() === 'add') {
      this.addUser();
    } else {
      this.UpdateUser();
    }
  }

  trackById(index: number, user: Admin_users) {
    return user._id;
  }

}