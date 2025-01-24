import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notificationForm!: FormGroup;
  notifications:any=[];
  otherNotifications:any=[];
  id:number=0;
  notification:string='';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService,
    private sharedService:SharedService
  ) {
    this.notificationForm = this.fb.group({
      Id: [0],
      Notification: ['', Validators.required],
      Type:[1]
    });
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      //
    }    
    this.spinner.hide();
  }

  getModelValues(notification:any){
    this.id=notification.id;  
    this.notification=notification.notification;
  }

  getNotifications() {
    this.notifications = [];
    this.spinner.show();
    this.accountService.getNotifications().subscribe({
      next: (response: any) => {
        if (response.status) {
          let data = response.data;
          this.otherNotifications=data.filter((x:any)=>x.type==2);
          this.notifications=data.filter((x:any)=>x.type==1);
         
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  addNotifications(type:number) {
    this.notificationForm.patchValue({
      Type: type,
    });
    if (this.notificationForm.invalid) {
      this.toastr.error("Notification is required", 'Failed', { timeOut: 5000 });
      return;
    }
    this.spinner.show();
    this.accountService.addNotifications(this.notificationForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.notificationForm.reset();
          this.getNotifications();
          this.closeModels();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  updateNotifications() {
    this.notificationForm.patchValue({
      Notification:this.notification,
      Id:this.id
    })
    if (this.notificationForm.invalid) {
      this.toastr.error("Notification is required", 'Failed', { timeOut: 5000 });
      return;
    }
    this.spinner.show();
    this.accountService.updateNotifications(this.notificationForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.notificationForm.reset();
          this.getNotifications();
          this.closeModels();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }
  
  deleteNotifications() {    
    this.spinner.show();
    this.accountService.deleteNotifications(this.id).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getNotifications();
          this.closeModels();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  closeModels(){
    document.getElementById('clseditmdl')?.click();
    document.getElementById('clsdltmdl')?.click();
  }
}
