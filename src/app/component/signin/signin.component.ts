import { Component } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Login } from 'src/app/models/login.model';
import { AuthGuard } from 'src/app/services/auth-gaurd.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  userRoleId: number = 0;
  bright: boolean = false;
  logo: string = '';
  dc =location.origin;
  keepMeSignedInChecked: boolean = false
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  constructor(private authGaurd: AuthGuard, private spinner: NgxSpinnerService, private toastr: ToastrService, private authService: AuthService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.createLoginForm();
    if (this.authGaurd.checkLogin("/signin")) {
      this.router.navigate(["/dashboard"]);
    };
    $('body').addClass('signin');
    this.getLogo();
    

    const savedCredentials = JSON.parse(localStorage.getItem('savedCredentials_admin_' + this.dc) || '{}');
    if (savedCredentials.LoginId && savedCredentials.Password) {
      this.loginForm.patchValue({
        LoginId: savedCredentials.LoginId,
        Password: savedCredentials.Password
      });
      this.keepMeSignedInChecked = true; // Set the checkbox as checked
    }
  }

  ngOnDestroy() {
    $('body').removeClass('signin');
  }


  createLoginForm(): void {

    if (!this.dc.startsWith("https://")) {
      this.dc = "https://" + this.dc.replace(/^http:\/\/|^www\./, ''); // Replace "http://" and remove "www."
    }

    this.loginForm = this.fb.group({
      LoginId: ['', Validators.required],
      Password: ['', Validators.required],
      Domain: this.dc,
    });
  }

  keepMeSignedIn(): void {
    this.keepMeSignedInChecked = this.keepMeSignedInChecked ? false : true;
  }

  setKeepMeSignInLoacalStorage() {
    
    if (this.keepMeSignedInChecked) {
      const credentials = {
        LoginId: this.loginForm.value.LoginId,
        Password: this.loginForm.value.Password
      };
      localStorage.setItem('savedCredentials_admin_' + this.dc, JSON.stringify(credentials));
    } else {
      localStorage.removeItem('savedCredentials_admin_' + this.dc); // Clear saved credentials if unchecked
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      this.spinner.show();
      const loginRequest: Login = new Login(
        this.loginForm.value.LoginId,
        this.loginForm.value.Password,
        this.loginForm.value.Domain,
      );
      this.authService.login(loginRequest).subscribe({
        next: response => {
          if (response.status) {

            if (response.role == "Client") {
              this.toastr.error("Wrong LoginId and Password", 'Failed');
              return;
            }
            this.authService.setLocalStorage(response.token);
            this.userRoleId = parseInt(localStorage.getItem('roleId') || '0', 10); 4
            if (this.userRoleId != 9) {
              localStorage.setItem('websiteMode', response.websiteMode)
              localStorage.setItem('LoginRole', response.role);
              this.toastr.success(response.message, 'Success');
              this.setKeepMeSignInLoacalStorage();
              this.router.navigate(["/dashboard"]);
            } else {
              this.toastr.error('You not authorized at this link', 'Failed', {
                timeOut: 5000,
              });
            }
          } else {
            this.toastr.error(response.message, 'Failed', {
              timeOut: 5000,
            });

          }
        }, error: error => {
          this.toastr.error("Api path is  not valid", 'Failed', {
            timeOut: 5000,
          });
          this.spinner.hide();
        }, complete: () => {
          this.spinner.hide();
        }

      })
    } else {
      this.toastr.error("Please fill all required details", 'Failed', {
        timeOut: 5000,
      });
    }

  }

  getLogo(): void {
    this.authService.getLogo().subscribe({
      next: response => {
        if (response.status) {
          this.logo = response.data;
        } else {

        }
      }

    })

  }
}