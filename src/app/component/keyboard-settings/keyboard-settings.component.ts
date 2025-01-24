import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-keyboard-settings',
  templateUrl: './keyboard-settings.component.html',
  styleUrls: ['./keyboard-settings.component.scss']
})
export class KeyboardSettingsComponent implements OnInit {
  chipsForm!: FormGroup;
  chips: any = [];
  id: number = 0;
  chip: string = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.chipsForm = this.fb.group({
      Id: [0],
      KeyName: ['', Validators.required],
      KeyValue: [0, Validators.required]
    });
  }
  ngOnInit(): void {
    this.getChips();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
     
    }    
    this.spinner.hide();
  }

  getModelValues(chip: any) {
    this.id = chip.id;
    this.chipsForm.patchValue({
      Id: chip.id,
      KeyName: chip.keyName,
      KeyValue: chip.keyValue,
    })
  }

  getChips() {
    this.chips = [];
    this.spinner.show();
    
    this.accountService.getChips().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.chips = response.data;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  initializeForm() {
    this.chipsForm.reset();
    this.chipsForm = this.fb.group({
      KeyName: ['', Validators.required],
      KeyValue: [0, Validators.required],
      // Add more fields as needed
    });
  }

  addChips() {
    if (this.chipsForm.invalid) {
      this.validateAllFormFields(this.chipsForm);
      return;
    }
    this.spinner.show();
    this.accountService.addChips(this.chipsForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.initializeForm();
          this.getChips();
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

  updateChips() {
    if (this.chipsForm.invalid) {
      this.validateAllFormFields(this.chipsForm);
      return;
    }
    this.spinner.show();
    this.accountService.updateChips(this.chipsForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.initializeForm();
          this.getChips();
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

  deleteChips() {
    this.spinner.show();
    this.accountService.deleteChips(this.id).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getChips();
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

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control && control.invalid) {
        control.markAsTouched({ onlySelf: true });
        Object.keys(control.errors!).forEach(errorName => {
          this.toastr.error(this.getErrorMessage(field, errorName, control.errors![errorName]), 'Failed', { timeOut: 5000 });
        });
      }
    });
  }

  getErrorMessage(field: string, errorName: string, errorValue: any): string {
    const errorMessages: { [key: string]: { [key: string]: string } } = {
      KeyValue: {
        required: 'Key value field is required',
      },
      KeyName: {
        required: 'Key name field is required',
      }
    };

    return errorMessages[field]?.[errorName] || 'Invalid field';
  }

  closeModels() {
    document.getElementById('clsmdl')?.click();
    document.getElementById('clsaddmdl')?.click();
    document.getElementById('clsdltmdl')?.click();
  }
}
