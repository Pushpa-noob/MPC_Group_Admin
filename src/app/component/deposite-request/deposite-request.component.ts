import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-deposite-request',
  templateUrl: './deposite-request.component.html',
  styleUrls: ['./deposite-request.component.scss']
})
export class DepositeRequestComponent implements OnInit {  
  skipRecords = 0;
  itemsPerPage = 10;
  transactionType = 0;
  totalItems = 0;
  currentPage = 1;
  depositRequests: any[] = [];
  depositForm: FormGroup;
  screenShotLink: string | ArrayBuffer | null = null;
  startDate: any;
  endDate: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.depositForm = this.fb.group({
      Id: [0],
      UserId: [0],
      FullName: [''],
      Amount: ['', Validators.required],
      UtrNumber: ['', Validators.required],
      Remarks: ['', Validators.required],
      TransactionStatus: [0],
      ImagePath: [''],
      BankingId: [0],
    });
  }

  ngOnInit(): void {
    this.setDefaultDates();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      
    }    
    this.spinner.hide();
  }

  setDefaultDates(): void {
    const currentDate = new Date();
    
    // Set endDate to current date at 23:59:59
    this.endDate = `${currentDate.getFullYear()}-${this.padZero(currentDate.getMonth() + 1)}-${this.padZero(currentDate.getDate())}T23:59:59`;
    
    // Set startDate to 7 days before the current date at 00:00:00
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 7);
    this.startDate = `${startDate.getFullYear()}-${this.padZero(startDate.getMonth() + 1)}-${this.padZero(startDate.getDate())}T00:00:00`;
    this.pendingRequests();
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  pageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skipRecords = this.itemsPerPage * (pageNumber - 1);
    this.pendingRequests();
  }

  pendingRequests(): void {
    this.spinner.show();
    this.accountService.getDepositRequestsByDomainId(this.transactionType, this.skipRecords, this.itemsPerPage,this.startDate,this.endDate,'').subscribe({
      next: response => {
        if (response.status) {
          this.depositRequests = response.data;
          this.totalItems = response.totalItems;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  getModelValues(request: any): void {
    this.screenShotLink = request.imagePath;
    this.depositForm.patchValue({
      FullName: `${request.clientLoginId} (${request.clientFullName})`,
      Id: request.id,
      UserId: request.userId,
      Amount: request.amount,
      UtrNumber: request.utrNumber,
      ImagePath: request.imagePath,
      BankingId: request.bankingId,
    });
  }

  updateRequest(type: any): void {
    this.depositForm.patchValue({ TransactionStatus: type });
    if (this.depositForm.invalid) {
      this.validateAllFormFields(this.depositForm);
      return;
    }
    this.spinner.show();
    this.accountService.updateDepositRequest(this.depositForm.value).subscribe({
      next: response => {
        if (response.status) {
          this.resetForm();
          this.pendingRequests();
          this.closeModals();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control && control.invalid && control.errors) {
        Object.keys(control.errors).forEach(errorName => {
          this.toastr.error(this.getErrorMessage(field, errorName, control.errors![errorName]), 'Failed', { timeOut: 5000 });
        });
      }
    });
  }

  getErrorMessage(field: string, errorName: string, errorValue: any): string {
    const errorMessages: { [key: string]: { [key: string]: string } } = {
      Remarks: {
        required: 'Remarks field is required',
      },
      Amount: {
        required: 'Amount field is required',
      },
      UtrNumber: {
        required: 'UTR Number is required',
      },
      // Add more field-specific error messages as needed
    };

    return errorMessages[field]?.[errorName] || 'Invalid field';
  }

  private resetForm(): void {
    this.depositForm.reset({
      Id: 0,
      UserId: 0,
      FullName: '',
      Amount: '',
      UtrNumber: '',
      Remarks: '',
      TransactionStatus: 0,
      ImagePath: '',
      BankingId: 0,
    });
    this.depositRequests = [];
    this.totalItems = 0;
  }
  private closeModals(): void {
    document.getElementById('clsdpstmdl')?.click();
  }
}
