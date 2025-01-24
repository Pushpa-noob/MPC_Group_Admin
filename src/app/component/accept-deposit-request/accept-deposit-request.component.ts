import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-accept-deposit-request',
  templateUrl: './accept-deposit-request.component.html',
  styleUrls: ['./accept-deposit-request.component.scss']
})
@Injectable({
  providedIn: "root"
})
export class AcceptDepositRequestComponent {
  totalItems = 0;
  currentPage = 1;
  skipRecords = 0;
  itemsPerPage = 10;
  transactionType = 1;
  depositRequests: any;
  startDate: any;
  endDate: any;
  utrNumber: string = '';
  depositForm!: FormGroup;
  screenShotLink: string | ArrayBuffer | null = null;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService,
    private fb: FormBuilder,
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

  pageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skipRecords = this.itemsPerPage * (pageNumber - 1);
    this.getApprovedAndRejectedRequests();
  }

  setTransactionType(event: any) {
    this.transactionType = parseInt(event.target.value);
  }

  setDefaultDates(): void {
    const currentDate = new Date();

    // Set endDate to current date at 23:59:59
    this.endDate = `${currentDate.getFullYear()}-${this.padZero(currentDate.getMonth() + 1)}-${this.padZero(currentDate.getDate())}T23:59:59`;

    // Set startDate to 7 days before the current date at 00:00:00
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 7);
    this.startDate = `${startDate.getFullYear()}-${this.padZero(startDate.getMonth() + 1)}-${this.padZero(startDate.getDate())}T00:00:00`;
    this.getApprovedAndRejectedRequests();
  }

  setStartDateRange(event: any): void {

    if (event.target.value) {
      const date = new Date(event.target.value);
      this.startDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}T00:00:00`;
    } else {
      this.startDate = null;
    }
  }

  setEndDateRange(event: any): void {
    if (event.target.value) {
      const date = new Date(event.target.value);
      this.endDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}T23:59:59`;
    } else {
      this.endDate = null;
    }
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }



  getApprovedAndRejectedRequests(): void {
    this.spinner.show();
    this.depositRequests = [];
    this.totalItems = 0;
    this.accountService.getDepositRequestsByDomainId(this.transactionType, this.skipRecords, this.itemsPerPage, this.startDate, this.endDate, this.utrNumber).subscribe({
      next: response => {
        if (response.status) {
          this.depositRequests = response;
          this.totalItems = response.totalItems;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  reset() {
    this, this.utrNumber = "";
    this.transactionType = 1;
    this.setDefaultDates();
  }

  downloadExcel(): void {
    this.spinner.show();
    this.accountService.getDepositRequestsForPdf(this.transactionType, this.startDate, this.endDate, this.utrNumber).subscribe({
      next: response => {
        if (response.status) {
          const depositRequests = response.data;
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(depositRequests.map((req: any) => ({
            'Client Login ID': req.clientLoginId,
            'Client Full Name': req.clientFullName,
            'Parent Login ID': req.parentLoginId,
            'Parent Name': req.parentName,
            'Screen Shot': req.imagePath,
            'Amount': req.amount,
            'UTR Number': req.utrNumber,
            'Created On': req.createdOn,
            'Updated On': req.updatedOn,
            'Bank Name': req.bankingMethodDetail.bankName,
            'Account Holder': req.bankingMethodDetail.accountHolderName,
            'Account Number': req.bankingMethodDetail.accountNumber,
            'IFSC Code': req.bankingMethodDetail.ifscCode,
            'Branch Name': req.bankingMethodDetail.branchName
          })));

          const workbook: XLSX.WorkBook = { Sheets: { 'Withdrawal Requests': worksheet }, SheetNames: ['Withdrawal Requests'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, 'Withdrawal-requests');
          this.toastr.success("Excel downloaded successfully", 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  updateRequest(type: any): void {
    this.depositForm.patchValue({ TransactionStatus: type });
   
    this.spinner.show();
    this.accountService.updateDepositRequest(this.depositForm.value).subscribe({
      next: response => {
        if (response.status) {
          this.resetForm();
          this.getApprovedAndRejectedRequests();
          this.closeModals();
          this.toastr.success('Rejected deposit request rollback successfully','Success' ,{ timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
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


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

