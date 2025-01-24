import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  userType: string = ""
  parentId: number = 0;
  userDetails: any = [];
  parentDetail: any = [];
  previousDetails: any;
  previousSportsShare: number = 0;
  previousCasinoSportsShare: number = 0;
  websiteMode: string = localStorage.getItem('websiteMode') ?? 'b2b';
  loginRole:string='';
  getRoleId:number=0;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder, private sharedService: SharedService) {
  }
  ngOnInit(): void {
    
    const role = localStorage.getItem('roleId');
    this.getRoleId = role !== null ? parseInt(role, 10) : 0;
    this.route.queryParams.subscribe(params => {
      this.userType = params['type'];
      this.parentId = params['parentId'];
    });
    this.getDetails()
  }



  backFunction() {
    localStorage.setItem('BackButton' ,"Ok")
    this.sharedService.setParentId(this.parentId)
    this.router.navigate(['/user_list']);
  }

  getDetails() {
    this.spinner.show();
    this.accountService.getParentDetails(this.parentId).subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.userDetails = response.data;
          this.previousDetails = { ...this.userDetails };
          this.getParentDetails();
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

  getParentDetails() {
    this.spinner.show();
    this.accountService.getParentDetails(this.userDetails.parentId).subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.parentDetail = response.data;
          this.previousSportsShare = this.parentDetail.sportsShare;
          this.previousCasinoSportsShare = this.parentDetail.casinoShare;
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

  updateUser() {
    
    let errorMessage = '';


    if (this.userDetails.losingCommissionValue > this.parentDetail.losingCommissionValue) {
      this.userDetails.losingCommissionValue = this.previousDetails.losingCommissionValue
      errorMessage += `Losing Commission must be greater than ${this.previousDetails.losingCommissionValue}. `;
    }

    if (this.userDetails.matchCommissionValue > 5) {
      this.userDetails.matchCommissionValue = this.previousDetails.matchCommissionValue
      errorMessage += `Match Commission must be less than or equal to 5. `;
    }

    if (this.userDetails.sessionCommissionValue > this.parentDetail.sessionCommissionValue) {
      this.userDetails.sessionCommissionValue = this.previousDetails.sessionCommissionValue
      errorMessage += `Session Commission must be less than or equal to ${this.parentDetail.sessionCommissionValue}. `;
    }

    if (this.userDetails.losingBonus > this.parentDetail.losingBonus) {
      errorMessage += `losing bonus must be less than or equal to ${this.parentDetail.losingBonus}. `;
    }


    if (errorMessage) {
      this.toastr.error(errorMessage.trim(), 'Validation Error');
      return;
    }

    this.spinner.show();
    this.accountService.updateUser(this.userDetails).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
          this.getDetails();
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

  toggleSwitch(value: boolean): void {
    debugger
    this.userDetails.isLosingBonus = value;
}

  updateSportsShare(): void {
    
    const newSportsShare = this.userDetails.sportsShare ?? 0; // Set to 0 if null or undefined

    if (newSportsShare >= 0) {
      this.parentDetail.sportsShare = this.previousSportsShare - newSportsShare;
      if (this.parentDetail.sportsShare < 0) {
        this.toastr.error("Sports sharing cannot be greater than parent sharing", 'Failed');
        this.parentDetail.sportsShare = this.previousSportsShare;
        this.userDetails.sportsShare = this.previousDetails.sportsShare;
      }
    } else {
      this.parentDetail.sportsShare = this.previousSportsShare;
      this.userDetails.sportsShare = this.previousDetails.sportsShare;
    }
  }


  updateCasinoSportsShare(): void {
    const newCasinoShare = this.userDetails.casinoShare ?? 0; // Set to 0 if null or undefined

    if (newCasinoShare >= 0) {
      this.parentDetail.casinoShare = this.previousSportsShare - newCasinoShare;
      if (this.parentDetail.casinoShare < 0) {
        this.toastr.error("Casino sharing cannot be greater than parent sharing", 'Failed');
        this.parentDetail.casinoShare = this.previousSportsShare;
        this.userDetails.casinoShare = this.previousDetails.casinoShare;
      }
    } else {
      this.parentDetail.casinoShare = this.previousSportsShare;
      this.userDetails.casinoShare = this.previousDetails.casinoShare;
    }
  }



  handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.spinner.hide();
      this.router.navigate(["/signin"]);
    }
  }
}
