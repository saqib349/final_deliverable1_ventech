import {
  Component,
  inject,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { IdleTimeCheck } from '../../services/idle-time-check';
import { signal } from '@angular/core';

@Component({
  selector: 'app-verify-otp',

  imports: [FormsModule],

  templateUrl: './verify-otp.html',

  styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnDestroy {

  otp: string = '';
  timeLeft = signal(2 * 60); 

  private timer?: ReturnType<typeof setInterval>;

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  errorMessage = signal("");
  idleTimeCheck = inject(IdleTimeCheck);

  constructor() {
    this.startTimer();
  }

  startTimer() {


    this.timer = setInterval(() => {

      if (this.timeLeft() > 0) {

        this.timeLeft.update((value) => value - 1);

      } else {

        this.stopTimer();

      }

    }, 1000);

  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }

  }

  get formattedTime(): string {

    const minutes = Math.floor(this.timeLeft() / 60);

    const seconds = this.timeLeft() % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;

  }

  verifyOtp() {

    if (this.timeLeft() === 0 || this.otp.length !== 6) {
      return;
    }
    this.errorMessage.set("");
    const userId = this.route.snapshot.params['userId'];

    this.authService.verifyOtp(userId, this.otp).subscribe({

      next: (result) => {

        this.stopTimer();

        this.idleTimeCheck.startWatching();

        console.log(result);

      },

      error: (err) => {
        this.errorMessage.set(err.error.message || "An error occurred while verifying the OTP.");
        console.error(err);

      }

    });


  }

  ngOnDestroy() {


    this.stopTimer();


  }
}
