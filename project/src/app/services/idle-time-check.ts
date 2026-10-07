import {  Injectable, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeCheck {
  private timeout = 5 * 60 * 1000;
  private timer?: ReturnType<typeof setTimeout>;
  private eventEmitter = new Subject<void>();
  private watch? : Subscription
  showPopUp=signal(false)
  events() {
    const events = [
      'mousemove',
      'click',
      'touchstart',
      'keydown',
      'scroll' 
    ]
    events.forEach(event => {
      window.addEventListener(event, () => {
        this.eventEmitter.next();
      });
    });
  }

  startWatching() {
    console.log('in watching function');
    this.events();
    this.resetTimer();
    this.watch=this.eventEmitter.subscribe(() => {
        console.log("detect activity")
      this.resetTimer();
    });
  }

  private resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
        this.showPopUp.set(true)
        console.log("logout successfully")
    }, this.timeout);
  }
  stopWatching(){
    this.watch?.unsubscribe()
    this.showPopUp.set(false)
    if (this.timer){
        clearTimeout(this.timer)
    }
  }
}