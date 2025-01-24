import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeoutId: any;
  private readonly inactivityTime: number = 30 * 60 * 1000; // 2 minutes

  constructor(private authService:AuthService,private router: Router, private ngZone: NgZone) {}

  /**
   * Initialize the inactivity listener
   */
  initInactivityListener(): void {
    this.resetTimer();
    this.listenForUserActions();
  }

  /**
   * Set up event listeners for user actions
   */
  private listenForUserActions(): void {
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  /**
   * Reset the inactivity timer
   */
  private resetTimer(): void {
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set a new timeout outside Angular's zone to avoid unnecessary change detection
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => this.logoutUser(), this.inactivityTime);
    });
  }

  /**
   * Log out the user after inactivity
   */
  private logoutUser(): void {
   this.authService.logout();
    this.router.navigate(['/signin']); // Redirect to the login page
  }
}
