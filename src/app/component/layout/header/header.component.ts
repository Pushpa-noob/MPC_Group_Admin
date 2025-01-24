import { Component, OnInit, Renderer2, HostListener,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from 'src/app/services/account.service';
import { SharedService } from 'src/app/services/shared.service';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  isFullWidth = false;
  isDarkMode = false;
  amount: number = 0;
  passwordMismatchError: boolean = false;
  changePasswordForm: FormGroup;
  userId: number = 0;
  returnObj: any = [];
  walletDetails: any = [];
  domain: any =location.origin;
  roleId: number = 0;
  searchKey: string = "";
  userList: any = [];
  searchError: boolean = false;
  role: string = "";
  websiteMode: string = "";
  audio = new Audio('assets/success.mp3');
  bodyClassToggled = false;
  referalLink = location.origin + "/#/register?referalCode=";
  private intervalId: any;
  bonusRequest:any=[];
  constructor(private sharedService: SharedService, private renderer: Renderer2, private accountService: AccountService, private fb: FormBuilder, private spinner: NgxSpinnerService, private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required], Validators.minLength(8)],
      confirmPassword: ['', Validators.required]
    });
    this.role = localStorage.getItem("LoginRole") ?? "";
    const id = localStorage.getItem('admin_userId');
    this.userId = id !== null ? parseInt(id, 10) : 0;
    const role = localStorage.getItem('roleId');
    this.roleId = role !== null ? parseInt(role, 10) : 0;
    const isDarkModeStorage = localStorage.getItem('darkMode');
    this.isDarkMode = isDarkModeStorage === 'true';
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark');
    }

    const isNavigationMain = localStorage.getItem('navigationMain');
    if (isNavigationMain === 'true') {
      document.body.classList.add('navigationMain');
    }
    this.websiteMode = localStorage.getItem('websiteMode') ?? 'b2b'
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.getWalletDetails();
      this.getNotificaton();
      this.intervalId = setInterval(() => this.getWalletDetails(), 30000);
    }
  }

  ngOnDestroy(): void {
    // Clear the interval to prevent memory leaks
    if (this.intervalId && location.origin.includes('signin')) {
      clearInterval(this.intervalId);
    }
  }
  toggleBodyClass() {
    document.body.classList.toggle('fullwidth');
    this.bodyClassToggled = !this.bodyClassToggled;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const buttonMenuMobile = document.querySelector('.button-menu-mobile');
    const leftSideMenu = document.querySelector('.left-side-menu');

    const clickedInsideMobileButton = buttonMenuMobile?.contains(event.target as Node);
    const clickedInsideSidebar = leftSideMenu?.contains(event.target as Node);

    // If clicked outside both the button and the sidebar, toggle the class
    if (!clickedInsideMobileButton && !clickedInsideSidebar) {
      document.body.classList.toggle('fullwidth', false); // Remove the class
    }
  }

  // Trigger toggle on button click
  toggleFullwidth() {
    document.body.classList.toggle('fullwidth');
  }
  logOut(): void {
    this.authService.logout();
    this.router.navigate(["/signin"]);
    this.toastr.success("LogOut Successfully.", 'Success');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }


  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  //   localStorage.setItem('darkMode', this.isDarkMode.toString());
  //   if (this.isDarkMode) {
  //     this.renderer.addClass(document.body, 'dark');
  //   } else {
  //     this.renderer.removeClass(document.body, 'dark');
  //   }
  // }
  // toggleNavigationClass() {
  //   document.body.classList.toggle('navigationMain');
  //   const hasClass = document.body.classList.contains('navigationMain');
  //   localStorage.setItem('navigationMain', hasClass.toString());
  // }
  toggleFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }

    const fullScreenElement = document.querySelector('.fullScreen');
    if (fullScreenElement) {
      fullScreenElement.classList.toggle('normalScreen');
    }
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  changepass() {
    this.changePasswordForm.markAllAsTouched();
    if (!this.passwordsMatch(this.changePasswordForm)) {
      if (this.changePasswordForm.invalid) {
        this.toastr.error("Please fill all the fields", 'Error', {
          timeOut: 5000,
        });
      } else {
        this.spinner.show();
        const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
        const newPassword = this.changePasswordForm.get('newPassword')?.value;
        this.accountService.changePassword(currentPassword, newPassword).subscribe({
          next: response => {
            if (response.status) {
              this.toastr.success(response.message, 'Success', {
                timeOut: 5000,
              });
              window.location.reload();
            } else {
              this.toastr.error(response.message, 'Failed', {
                timeOut: 5000,
              });
            }
          },
          error: error => {
            this.handleError(error);
          },
          complete: () => {
            this.spinner.show();
          }
        });
      }
    } else {
      this.passwordMismatchError = true;
      setTimeout(() => {
        this.passwordMismatchError = false;
      }, 5000);
    }
  }


  handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.spinner.show();
      this.router.navigate(["/signin"]);
    }
  }

  cancel(): void {
    this.changePasswordForm.reset();
  }
  copyToClipboard(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Referral link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy the text to clipboard: ', err);
    });
  }

  playNotificationSound() {
    this.audio.currentTime = 0; // Reset the audio to start
    this.audio.play().catch((error) => {
      console.error('Audio play error:', error);
    });
  }

  getWalletDetails() {
    this.accountService.getBalance(this.userId).subscribe({
      next: (response: any) => {
        if (response.status) {

          this.walletDetails = response.data;
          if (this.walletDetails.depositCount > 0 || this.walletDetails.withdrawalCount > 0) {
            this.playNotificationSound();

          }
          this.referalLink = this.referalLink + this.walletDetails.referalCode;
          if (this.websiteMode === 'b2b') {
            if (!this.walletDetails.isPwd) {
              const modalElement = document.getElementById('changePasswordModal');
              if (modalElement) {
                const changePasswordModal = new bootstrap.Modal(modalElement);
                changePasswordModal.show();
              }
            }
          }
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.changePasswordForm.get(controlName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  logoutFunction() {
    this.authService.logout();
    this.router.navigate(["/signin"]);
    location.reload();
  }

  getNotificaton() {
    this.accountService.getHeaderNotifications(this.domain, this.userId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.returnObj = response.data;
          this.sharedService.broadcastNotifications(this.returnObj.news);
        }

      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }

  addOwnBalance() {
    const id = localStorage.getItem('admin_userId');
    this.userId = id !== null ? parseInt(id, 10) : 0;
    this.spinner.show()
    this.accountService.addOwnBalance(this.userId, this.amount).subscribe({
      next: (response: any) => {
        if (response.status) {
          document.getElementById("clsWallet")?.click();
          this.spinner.show()
          this.toastr.success(response.message, 'Success')
          this.amount = 0;
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.show();
      }
    });
  }

  

  updateBonus(){
    this.spinner.show();
    this.bonusRequest={
      IsEveryRefilBonus:this.walletDetails.isEveryRefilBonus,
      IsFirstRefilBonus:this.walletDetails.isFirstRefilBonus,
      EveryRefilBonus:this.walletDetails.everyRefilBonus,
      FirstRefilBonus:this.walletDetails.firstRefilBonus,
    }
    this.accountService.updateBonus(this.bonusRequest).subscribe({
      next:(response:any)=>{
        if(response.status){
          this.toastr.success(response.message,"Success");
          document.getElementById('clsBtn')?.click();
        }else{
        this.toastr.error(response.message,"Failed");

        }
      },error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
    })
  }

  searchUser() {
    this.userList = []
    this.spinner.show()
    if (this.searchKey.length > 0) {
      this.accountService.finduser(this.searchKey).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.spinner.show()
            this.userList = response.data;
          } else {
            this.spinner.show()
            this.userList = []
          }
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.spinner.hide()
      this.searchError = true;
    }
  }

  resetSearch() {
    this.searchKey = "";
    this.searchError = false;
  }

  resetAmount() {
    this.amount = 0;
  }

  ngAfterViewInit() {

    // $(".button-menu-mobile").click(function () {
    //   $("body").toggleClass("fullwidth");
    // });



    $(".fullScreen").click(function () {
      $(".fullScreen").toggleClass("normalScreen");
    });

    var tooltips = new bootstrap.Tooltip(document.body, {
      selector: '[data-bs-toggle="tooltip"]',
    });

  }
}
