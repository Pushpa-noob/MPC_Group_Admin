import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-manage-banking',
  templateUrl: './manage-banking.component.html',
  styleUrls: ['./manage-banking.component.scss']
})
export class ManageBankingComponent implements OnInit {
  bankingMethods: any[] = [];
  bankingDetails: any[] = [];
  bankDetailForm: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  bankMethodName = 'Bank';
  dropdownOpen = false;
  selectedMethod: any = {};
  modelText = '';
  allBankingDetails:any=[];
  bankImage: string | ArrayBuffer | null = null;

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.bankDetailForm = this.fb.group({
      Id: [0],
      BankingMethodId: [''],
      BankName: ['', Validators.required],
      AccountHolderName: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      IfscCode: [''],
      BranchName: [''],
      QrImagePath: [''],
      IsLocked: [false],
    });
  }

  ngOnInit(): void {
    this.getBankingMethods();
    this.getBanks();
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }

  getBankingMethods() {
    this.spinner.show();
    this.accountService.getBankingMethods().subscribe({
      next: response => {
        
        if (response.status) {
          this.bankingMethods = response.data;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  getFilterBankingDetails(name:string){
    
    this.bankingDetails=[];
    this.bankingDetails=this.allBankingDetails.filter((bank:any)=>bank.bankingMethodName==name);    
  }
  reset(){
    this.bankingDetails=this.allBankingDetails;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectBankingMethod(method: any) {
    this.selectedMethod = method;
    this.dropdownOpen = false;
    this.bankMethodName = method.name;
    this.bankDetailForm.patchValue({
      BankName: method.name,
      BankingMethodId: method.id
    });
  }

  onFileSelected(event: any): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.fileError = 'Please select a valid image file';
      return;
    }

    if (file.size > 5000000) {
      this.fileError = 'File size should not exceed 5MB';
      return;
    }

    this.fileError = null;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => this.previewUrl = reader.result;

    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    this.accountService.uploadFile(file, 'Banking').subscribe({
      next: response => {
        if (response.status) {
          const imagePath = response.data.replace('wwwroot/', environment.apiBaseUrl.replace('/api/v1', ''));
          this.bankDetailForm.patchValue({ QrImagePath: imagePath });
        }
      },
      error: error => this.handleError(error)
    });
  }

  addBankDetail() {
    if (this.bankDetailForm.invalid) {
      this.toastr.error('Invalid form values', 'Failed', { timeOut: 5000 });
      return;
    }

    this.spinner.show();
    this.accountService.addBankingDetails(this.bankDetailForm.value).subscribe({
      next: response => {
        if (response.status) {
          this.getBanks();
          this.bankDetailForm.reset();
          document.getElementById('clsmdl')?.click();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  private getBanks() {
    this.spinner.show();
    this.accountService.getBanksWithDetail().subscribe({
      next: response => {
        if (response.status) {
          this.bankingDetails = response.data;          
          this.allBankingDetails=response.data;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  getModelValues(bank: any, type: any) {
    
    this.modelText = bank.isLocked ? 'Active' : 'InActive';
    this.bankImage = bank.bankingMethodImage;
    this.bankMethodName = bank.bankingMethodName;
    this.previewUrl=bank.qrImagePath;
    this.bankDetailForm.patchValue({
      Id: bank.id,
      BankName: bank.bankName,
      AccountHolderName: bank.accountHolderName,
      AccountNumber: bank.accountNumber,
      IfscCode: bank.ifscCode,
      BranchName: bank.branchName,
      IsLocked: type === 'Status' ? !bank.isLocked : bank.isLocked,
      BankingMethodId: bank.bankingMethodId,
      QrImagePath: bank.qrImagePath
    });
  }

  updateBankDetail() {
    if (this.bankDetailForm.invalid) {
      this.toastr.error('Invalid form values', 'Failed', { timeOut: 5000 });
      return;
    }

    this.spinner.show();
    this.accountService.updateBankingDetails(this.bankDetailForm.value).subscribe({
      next: response => {
        if (response.status) {
          window.location.reload();
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }
}
