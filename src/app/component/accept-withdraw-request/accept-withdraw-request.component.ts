import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-accept-withdraw-request',
  templateUrl: './accept-withdraw-request.component.html',
  styleUrls: ['./accept-withdraw-request.component.scss']
})
export class AcceptWithdrawRequestComponent implements OnInit {
  totalItems = 0;
  currentPage = 1;
  skipRecords = 0;
  itemsPerPage = 10;
  transactionType = 1;
  withdrawalRequests: any;
  startDate: any;
  endDate: any;
  previewUrl: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  imagePath: string = '';
  id: number = 0;
  utrNumber: string = '';
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setDefaultDates();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      //
    }    
    this.spinner.hide();
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
    this.withdrawalRequests = [];
    this.totalItems = 0;
    this.accountService.getWithdrawalRequestsByDomainId(this.transactionType, this.skipRecords, this.itemsPerPage, this.startDate, this.endDate, this.utrNumber).subscribe({
      next: response => {
        
        if (response.status) {
          this.withdrawalRequests = response;
          this.totalItems = response.totalItems;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }


  onFileSelected(event: any, id: number): void {
    this.id = id == 0 ? this.id : id;
    const fileInput = event.target as HTMLInputElement;
    const fileData = fileInput.files ? fileInput.files[0] : null;

    if (!fileData) {
      return;
    }

    // Validate file type
    const mimeType = fileData.type;
    if (!mimeType.startsWith('image/')) {
      this.fileError = 'Please select a valid image file';
      return;
    }

    // Optional: Validate file size (example: limit to 5MB)
    if (fileData.size > 5000000) {
      this.fileError = 'File size should not exceed 5MB';
      return;
    } else {
      this.fileError = null;
    }

    // Preview the image
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = () => {
      this.previewUrl = reader.result;
    };

    // Upload the file
    const fileType = 'Banking';
    this.accountService.uploadFile(fileData, fileType).subscribe({
      next: (response: any) => {
        if (response.status) {
          const imagePath = response.data.replace('wwwroot/', environment.apiBaseUrl.replace("/api/v1", ""));
          this.imagePath = imagePath;
        }
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  getImageAndId(id: number, imagePath: string) {
    this.id = id;
    this.imagePath = imagePath;
    this.previewUrl = imagePath;
  }

  uploadImage() {
    if (this.imagePath == '' || this.imagePath == undefined || this.imagePath == "") {
      this.toastr.error("Please select image", 'Failed', { timeOut: 5000 });
      return;
    }
    this.spinner.show();
    this.accountService.uploadImage(this.id, this.imagePath).subscribe({
      next: response => {
        if (response.status) {
          this.closeModel();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
          this.getApprovedAndRejectedRequests();
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    })
  }

  closeModel() {
    document.getElementById('clsimgmdl')?.click();
  }

  reset() {
    this.transactionType = 1;
    this.utrNumber = "";
    this.setDefaultDates();
  }

  downloadExcel(): void {
    this.spinner.show();
    this.accountService.getWithdrawalRequestsForPdf(this.transactionType, this.startDate, this.endDate, this.utrNumber).subscribe({
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
            'Bank Name': req.bankDetails.bankName,
            'Account Holder': req.bankDetails.accountHolderName,
            'Account Number': req.bankDetails.accountNumber,
            'IFSC Code': req.bankDetails.ifscCode,
            'Branch Name': req.bankDetails.branchName
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
}


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
