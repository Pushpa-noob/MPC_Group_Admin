import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pending-withdraw',
  templateUrl: './pending-withdraw.component.html',
  styleUrls: ['./pending-withdraw.component.scss']
})
export class PendingWithdrawComponent implements OnInit {
  skipRecords = 0;
  itemsPerPage = 10;
  transactionType = 0;
  totalItems = 0;
  currentPage = 1;
  withdrawalRequests: any[] = [];
  withdrawalForm: FormGroup;
  bankDetails: any;
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
    this.withdrawalForm = this.fb.group({
      Id: [0],
      UserId: [0],
      ParentId: [0],
      DomainId: [0],
      BankAccountId: [0],
      Amount: ['', Validators.required],
      TransactionStatus: [0],
      Remarks: ['', Validators.required],
      FullName: [''],
      UtrNumber: ['', Validators.required],
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
    this.accountService.getWithdrawalRequestsByDomainId(this.transactionType, this.skipRecords, this.itemsPerPage, this.startDate, this.endDate,'').subscribe({
      next: response => {
        if (response.status) {
          this.withdrawalRequests = response.data;
          this.totalItems = response.totalItems;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  getModelValues(request: any): void {
    this.withdrawalForm.reset();
    this.bankDetails = request.bankDetails || [];
    this.withdrawalForm.patchValue({
      Id: request.id,
      UserId: request.userId,
      ParentId: request.parentId,
      DomainId: request.domainId,
      BankAccountId: request.bankAccountId,
      Amount: request.amount,
      FullName: `${request.clientLoginId} (${request.clientFullName})`
    });
  }

  updateRequest(type: any): void {
    this.withdrawalForm.patchValue({ TransactionStatus: type });
    if(type==2){
      this.withdrawalForm.patchValue({ UtrNumber: "0" });
    }
    if (this.withdrawalForm.invalid) {
      this.validateAllFormFields(this.withdrawalForm,type);
      return;
    }

    this.spinner.show();
    this.accountService.updateWithdrawalRequest(this.withdrawalForm.value).subscribe({
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

  validateAllFormFields(formGroup: FormGroup,type:number): void {
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
        required: 'UTR number field is required',
      },
      // Add more field-specific error messages as needed
    };

    return errorMessages[field]?.[errorName] || 'Invalid field';
  }

  private resetForm(): void {
    this.withdrawalForm.reset({
      Id: 0,
      UserId: 0,
      ParentId: 0,
      DomainId: 0,
      BankAccountId: 0,
      Amount: '',
      TransactionStatus: 0,
      Remarks: '',
      FullName: ''
    });
    this.withdrawalRequests = [];
    this.totalItems = 0;
  }

  private closeModals(): void {
    document.getElementById('clswidtmdl')?.click();
    document.getElementById('clsrjtmdl')?.click();
  }
}
