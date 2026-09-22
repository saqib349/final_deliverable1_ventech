import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-component',
  imports: [FormsModule],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.css',
})
export class ModalComponent {

  mode = input<'add' | 'edit'>('add');

  user = input<Admin_users>({
    _id: '',
    password: '',
    username: '',
    email: '',
    role: ''
  });

  save = output<Admin_users>();

  close = output<void>();

  submit() {
    this.save.emit(this.user());
  }

}