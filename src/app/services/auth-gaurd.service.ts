// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole(); 

    // List of routes allowed for Agents
    const allowedRoutesForAgent = [
      '/signin',
      '/banking_method',
      '/manage_banking',
      '/deposit_request',
      '/accept_deposit_request',
      '/pending_withdraw',
      '/accept_withdraw_request'
    ];

    // Check if the user is an Agent and is trying to access a restricted route
    if (userRole === 'Banker') {
      const currentUrl = this.router.url;
      const requestedUrl = state.url;
      if (!allowedRoutesForAgent.includes(requestedUrl)) {
        this.router.navigate([currentUrl]); // Redirect to the login page or another page
        return false;
      }
    }
    return this.checkLogin(state.url);
  }



  checkLogin(url: string): boolean {
    
    const isLoggedIn = localStorage.getItem('admin_token');;
    if (isLoggedIn) {
      // Check if the token is expired
      if (this.authService.isTokenExpired()) {
        // Token is expired, perform logout and redirect to login page
        this.authService.logout(); // Example method to clear authentication state
        this.router.navigate(["/signin"]);
        //window.location.reload();
        return false;
      }
      return true; // Allow access if user is logged in and token is valid
    } else {
      // User is not logged in, redirect to login page and save the intended URL for redirection after login
      this.router.navigate(["/signin"]);
      //window.location.reload();
      return false;
    }
  }
}
