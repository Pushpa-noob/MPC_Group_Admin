import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  showDomainInput: boolean = false;
  userForm: FormGroup;
  domainForm: FormGroup;
  parentDetails: any = []
  isApproved: boolean = false;
  parentRole: number = 0;
  userType: string = ""
  parentId: number = 0;
  roles: any = [];
  domains: any = [];
  isDomainActive: Boolean = true;
  losingCommissionValue: number = 0;
  matchCommissionValue: number = 0;
  sessionCommissionValue: number = 0;
  previousSportsShare: number = 0;
  previousCasinoSportsShare: number = 0;
  websiteMode: string = localStorage.getItem('websiteMode') ?? 'b2b';
  domain: number = 0;
  isB2B: boolean = false; // A flag to control if the form should be disabled
  isShareChecked: boolean = false;
  isCommissionChecked: boolean = false;
  isBonusChecked:boolean=false;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder, private sharedService: SharedService) {
    this.userForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator]],
      fullName: ['', Validators.required],
      mobile: [''],
      sportsShare: [0],
      casinoShare: [0],
      matchCommission: [true],
      childLevel: [0, Validators.required],
      domainId: [0],
      domain: [''],
      referralCode: [0],
      parentId: [0],
      roleId: [0],
      creditRef: [0, Validators.required],
      isEveryRefilBonus: [false],
      isFirstRefilBonus: [false],
      isLosingCommision: [false],
      losingCommision: [0],
      isLosingBonus: [false],
      losingBonus: [0],
    });

    this.domainForm = this.fb.group({
      userId: [0],
      domainName: ['', [Validators.required, Validators.pattern('https?://.+')]], // URL validation
      providerId: ['', [Validators.required, Validators.min(1)]], // Provider ID must be a number greater than 0
      casinoType: ['', Validators.required], // Casino type is required
      firstRefilBonus: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]], // Must be a valid number with up to 2 decimal places
      everyRefilBonus: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]] // Must be a valid number with up to 2 decimal places
    });

    // Enable the fields for manual input
    this.domainForm.get('firstRefilBonus')?.enable();
    this.domainForm.get('everyRefilBonus')?.enable();
    const id = localStorage.getItem('roleId');
    this.parentRole = id !== null ? parseInt(id, 10) : 0;
    this.getDomains();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userType = params['type'];
      this.parentId = parseInt(params['parentId']);
      this.userForm.patchValue({ parentId: this.parentId });

    });
    this.getParentDetails();

  }

  toggleSwitch(value: string) {
    debugger
    if(value==='bonus'){
      this.isBonusChecked = !this.isBonusChecked;
      if(!this.isBonusChecked){
        this.userForm.get('losingBonus')?.setValue(0);
      }
      this.userForm.get('isLosingBonus')?.setValue(this.isBonusChecked);
    }else{
      if (value === 'share') {
        this.isShareChecked = !this.isShareChecked;
        this.isCommissionChecked = false; // Uncheck commission if share is checked
    } else if (value === 'commission') {
        this.isCommissionChecked = !this.isCommissionChecked;
        this.isShareChecked = false; // Uncheck share if commission is checked
        this.userForm.get('losingCommision')?.setValue(0)
    }
    if(this.isCommissionChecked){
      this.userForm.get('isLosingCommision')?.setValue(true);
    }else{
      this.userForm.get('isLosingCommision')?.setValue(false);
    }
    this.userForm.get('sportsShare')?.setValue(0);
    this.userForm.get('casinoShare')?.setValue(0);
    }
}



  onCommissionToggle(commissionType: string) {
    const control = this.userForm.get(`${commissionType}Value`);
    const maxValue = this.parentDetails[`${commissionType}Value`];

    if (this.userForm.get(commissionType)?.value) {
      control?.setValidators([Validators.min(0), Validators.max(maxValue)]);
    } else {
      control?.clearValidators();
    }
    control?.updateValueAndValidity();
  }

  onDomainSelect(event: any) {

    this.domain = parseInt(event.target.value);
    const selectedDomain = this.domains.find((x: any) => x.id === this.domain);
    this.userForm.get('domain')?.setValue(selectedDomain.domainName);
  }


  onChildLevelChange(event: Event): void {
    this.showDomainInput = true;
    const selectedRole = (event.target as HTMLSelectElement).value;
    if (selectedRole) {
      this.userForm.get('roleId')?.setValue(selectedRole);
    }
    if (selectedRole !== '2') {
      this.isDomainActive = false;
      this.userForm.get('domain')?.setValue(location.origin);
    } else {
      this.isDomainActive = true;
      this.userForm.get('domain')?.setValue("");
    }
  }




  prepareFormValues(): void {
    if (!this.userForm.get('matchCommission')?.value) {
      this.userForm.get('matchCommissionValue')?.setValue(0);
    }
    if (!this.userForm.get('sessionCommission')?.value) {
      this.userForm.get('sessionCommissionValue')?.setValue(0);
    }
    if (!this.userForm.get('losingCommission')?.value) {
      this.userForm.get('losingCommissionValue')?.setValue(0);
    }
  
    if( this.userForm.get('roleId')?.value != 5){
      if(!this.isShareChecked && !this.isCommissionChecked){
        this.toastr.error("Please fill all required details", 'Failed', {
          timeOut: 5000,
        });
        return;
      }
    }
    this.userForm.get('domainId')?.setValue(this.domain);
    // if (this.websiteMode == 'b2b') {
    //   this.userForm.get('mobile')?.setValue('0000000000')
    //   this.userForm.get('losingCommissionValue')?.setValue(0)
    // }
  }

  permission() {
    this.isApproved = !this.isApproved;
  }


  toggleMode(mode: string) {
    if (mode === 'b2b') {
      const b2BValue = this.userForm.get('b2B')?.value;
      const b2CControl = this.userForm.get('b2C');

      if (b2BValue) {
        b2CControl?.setValue(false);
      }

    } else if (mode === 'b2c') {
      const b2CValue = this.userForm.get('b2C')?.value;
      const b2BControl = this.userForm.get('b2B');

      if (b2CValue) {
        b2BControl?.setValue(false);
      }
    }
    localStorage.setItem('websiteMode', mode)
    this.websiteMode = mode
  }




  backFunction() {
    localStorage.setItem('BackButton', "Ok")
    this.sharedService.setParentId(this.parentId)
    this.router.navigate(['/user_list']);
  }

  updateSportsShare(event: any): void {
    if (event.target.value && event.target.value > 0) {
      this.parentDetails.sportsShare = this.previousSportsShare - event.target.value;
      if (this.parentDetails.sportsShare < 0) {
        this.toastr.error("Sports sharing can not be greater then perent sharing", 'Failed');
        this.parentDetails.sportsShare = this.previousSportsShare;
        this.userForm.get('sportsShare')?.setValue(0);
      }
    } else {
      this.parentDetails.sportsShare = this.previousSportsShare;
    }
  }

  updateCasinoShare(event: any): void {
    if (event.target.value && event.target.value > 0) {
      this.parentDetails.casinoShare = this.previousCasinoSportsShare - event.target.value;
      if (this.parentDetails.casinoShare < 0) {
        this.toastr.error("Casino sharing can not be greater then parent sharing", 'Failed');
        this.parentDetails.casinoShare = this.previousCasinoSportsShare;
        this.userForm.get('sportsShare')?.setValue(0);
      }
    } else {
      this.parentDetails.casinoShare = this.previousCasinoSportsShare;
    }
  }

  checkAndAdjustCommission(commissionType: string): void {
    if (this.userType == "Client") {
      const formValue = this.userForm.get(commissionType)?.value;
      const parentValue = 5;

      if (formValue > parentValue) {
        this.toastr.error("Commission value is must be equal or less then 5", 'Failed');
        this.userForm.get(commissionType)?.setValue(parentValue);
      }
    }

  }



  private passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasValidLength = password.length >= 6;
    if (!hasSpecialCharacter || !hasDigit || !hasUpperCase || !hasValidLength) {
      return { 'invalidPassword': true };

    }
    return null;
  }


  onSubmit(): void {    
    if (this.isApproved) {
      this.prepareFormValues();
      this.userForm.markAllAsTouched();
      if (this.userForm.valid) {
          this.spinner.show();
          this.accountService.addUser(this.userForm.value).subscribe({
            next: (response: any) => {
              if (response.status) {
                this.toastr.success(response.message, 'Success')
                this.backFunction();
              } else {
                this.toastr.error(response.message, 'Failed', {
                  timeOut: 5000,
                });
              }
  
            }, error: (error: any) => {
              this.handleError(error);
            }, complete: () => {
              this.spinner.hide();
            }
          })
      } else {
        this.toastr.error("Please fill all required details", 'Failed', {
          timeOut: 5000,
        });
      }
    } else {
      this.toastr.error("Please select IsApproved first.", 'Failed', {
        timeOut: 5000,
      });
    }
  }


  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }


  getParentDetails() {
    this.spinner.show();
    this.accountService.getParentDetails(this.parentId).subscribe({
      next: (response: any) => {

        if (response.status) {

          this.parentDetails = response.data;
          this.previousSportsShare = this.parentDetails.sportsShare;
          this.previousCasinoSportsShare = this.parentDetails.casinoShare;

          this.parentRole = this.parentDetails.roleId;
          this.roles = this.parentDetails.roles;
          this.initializeForm();
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

  initializeForm() {

    this.userForm.patchValue({
      domain: this.parentDetails.domain,
      losingCommission: this.parentDetails.losingCommission,
      losingCommissionValue: this.parentDetails.losingCommissionValue,
      matchCommission: this.parentDetails.matchCommission,
      matchCommissionValue: 1,//this.parentDetails.matchCommissionValue,
      sessionCommission: this.parentDetails.sessionCommission,
      sessionCommissionValue: 0, //this.parentDetails.sessionCommissionValue,
      referralCode: this.parentDetails.referralCode,
      isFirstRefilBonus: this.parentDetails.isFirstRefilBonus,
      isEveryRefilBonus: this.parentDetails.isEveryRefilBonus,
      currencyCode: this.parentDetails.currencyCode,
      exposureLimit: -1,
    });
    // Set initial values for b2B and b2C based on roleId
    if (this.parentDetails.roleId === 1) {
      this.userForm.patchValue({
        b2B: false,
        b2C: false,
      });
    } else {
      this.userForm.patchValue({
        b2B: this.parentDetails.b2B,
        b2C: this.parentDetails.b2C,
        domain: this.parentDetails.domain
      });
    }
    this.domain = this.parentDetails.domainId;
    if (this.userType == 'client') {
      this.userForm.get('roleId')?.setValue(5);
      this.userForm.get('domain')?.setValue(this.parentDetails.domain);
    }

    if (this.parentId === 1) {
      this.userForm.get('roleId')?.setValue(2);
      this.isDomainActive = true;
      this.showDomainInput = true;
    }
  }

  getDomains(): void {
    this.spinner.show();
    this.accountService.getDomains().subscribe({
      next: response => {

        if (response.status) {
          this.domains = response.data;
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  addDomain(): void {
    if (this.domainForm.valid) {
      this.spinner.show();
      this.accountService.addDomain(this.domainForm.value).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, 'Success');
            document.getElementById("clsadddomain")?.click();
            this.getDomains();
          } else {
            this.toastr.error(response.message, 'Failed');
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
      this.toastr.error("Required Fields", 'Failed');
    }
  }
}