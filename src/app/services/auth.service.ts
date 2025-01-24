// auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Login } from '../models/login.model';
import { environment } from 'src/environments/environment.prod';
import { jwtDecode } from 'jwt-decode';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = environment.apiBaseUrl + "Login/login";
  private logoUrl = environment.apiBaseUrl + "BasicSetting/getLogoPath?domain=";

  private tokenExpiration?: Date;
  constructor(private baseService: BaseService) {
  }

  get token(): string | null {
    return localStorage.getItem('admin_token')
  }

  get jtiToken(): string | null {
    return localStorage.getItem('admin_jti_token')
  }

  get jwtUserId(): string | null {
    return localStorage.getItem('admin_userId');
  }

  login(login: Login): Observable<any> {
    return this.baseService.post(this.loginUrl, login);
  }

  getLogo(): Observable<any> {
    let domain =location.origin;
    if (!domain.startsWith("https://")) {
      domain = "https://" + domain.replace(/^http:\/\/|^www\./, ''); // Replace "http://" and remove "www."
    }
    return this.baseService.get(this.logoUrl + domain);
  }

  clearLocalStorage() {
    localStorage.removeItem('websiteMode');
    localStorage.removeItem('LoginRole');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_jti_token');
    localStorage.removeItem('admin_userId');
    localStorage.removeItem('roleId');
    localStorage.removeItem('tokenExpiration');
  }

  setLocalStorage(token: string) {
    const decodedToken: any = jwtDecode(token)
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_jti_token', decodedToken.jti);
    localStorage.setItem('admin_userId', decodedToken.UniqueId);
    localStorage.setItem('roleId', decodedToken.RoleId);

    localStorage.setItem('tokenExpiration', decodedToken.expires);
    this.tokenExpiration = decodedToken.expires;
  }

  logout(): void {

    this.clearLocalStorage();
    this.clearToken();
  }



  isLoggedIn(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getJtiToken(): string | null {
    return this.jtiToken;
  }

  getUserId(): string | null {
    return this.jwtUserId;
  }

  getUserRole(): string {
    return localStorage.getItem('LoginRole') ?? '';
  }

  isTokenExpired(): boolean {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) {
      return true; // If token expiration is not set, consider it as expired
    }
    this.tokenExpiration = new Date(tokenExpiration);
    return this.tokenExpiration <= new Date(); // Compare token expiration with current time
  }

  // Method to clear token and its expiration time
  clearToken(): void {
    this.clearLocalStorage();
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      if (!isNaN(expirationDate.getTime())) {
        this.tokenExpiration = expirationDate;
      }
    }
    localStorage.removeItem('tokenExpiration');

  }

}
