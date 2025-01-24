import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-active-clients',
  templateUrl: './active-clients.component.html',
  styleUrls: ['./active-clients.component.scss']
})
export class ActiveClientsComponent {
  details: any = [];
  websiteMode: any = [];
  getRoleId:number =0;
  type:string = "Active";
  skipRecords: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  isB2BActive: boolean = false;
  isB2CActive: boolean = false;
  sDate:string='';
  eDate:string='';
  valueType:string='';
  permissionValue:boolean=true;
  password:string='';
  parentId:number=0;
  selectedUserId:number=0;
  searchKey:string='';
  constructor(private toastr: ToastrService, private router: Router, private authService: AuthService, private accountService: AccountService, private spinner: NgxSpinnerService) {
    this.websiteMode = localStorage.getItem('websiteMode') ?? 'b2b'
  }

  ngOnInit(): void {
    this.getLoggedInUsers();
  }

  pageChanged(pageNo: any) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getLoggedInUsers();
  }



    //update active or deactive model setting
    updateSetting() {
      this.spinner.show();
      this.accountService.userSettings(this.selectedUserId, this.valueType, this.permissionValue, this.password, this.parentId).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, "Success");
            document.getElementById("clsPerKeyModel")?.click();
            this.getLoggedInUsers();
          } else {
            this.toastr.error(response.message, "Failed");
          }
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }

    resetPassword(){
      this.password='';
    }
  
    setvalue(id:number,type:string){
      this.type=type
this.selectedUserId = id;
    }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
  }

  getLoggedInUsers() {
    this.spinner.show();
    this.accountService.loggedInUser(this.websiteMode,this.type,this.skipRecords,this.takeRecords,this.searchKey).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.details = response.data;
          this.Count = response.totalItems;
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }

}
