
import { Injectable, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeCheck {
  private timeout = 5 * 60 * 1000;
  private timer?: ReturnType<typeof setTimeout>;

  private eventEmitter = new Subject<void>();
  private watch?: Subscription;

  private readonly eventsList = [
    'mousemove',
    'click',
    'touchstart',
    'keydown',
    'scroll'
  ];

  private activityHandler = () => {
    this.eventEmitter.next();
  };

  showPopUp = signal(false);

  startWatching() {
    this.eventsList.forEach(event => {
      window.addEventListener(event, this.activityHandler);
    });
    this.watch = this.eventEmitter.subscribe(() => {
      console.log('User activity detected, resetting timer');
      this.resetTimer();
    });

    this.resetTimer();
  }

  private resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.showPopUp.set(true);
      console.log('Idle timeout reached');
    }, this.timeout);
  }

  stopWatching() {
    this.watch?.unsubscribe();
    this.watch = undefined;
    this.eventsList.forEach(event => {
      window.removeEventListener(event, this.activityHandler);
    });
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.showPopUp.set(false);
  }
}