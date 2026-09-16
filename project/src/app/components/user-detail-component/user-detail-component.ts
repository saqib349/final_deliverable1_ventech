import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-user-detail-component',
  imports: [RouterLink],
  templateUrl: './user-detail-component.html',
  styleUrl: './user-detail-component.css',
})
export class UserDetailComponent implements OnInit {
  ngOnInit(): void {
    const _id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(_id).subscribe({
      next: (result) => {
        const { data } = result
        this.user.set(data)
      }
    })
  }
  private route = inject(ActivatedRoute)
  userService = inject(UserService)
  user = signal<Admin_users | null>(null)

}
