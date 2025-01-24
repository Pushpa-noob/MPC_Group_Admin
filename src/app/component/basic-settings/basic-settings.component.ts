import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-basic-settings',
  templateUrl: './basic-settings.component.html',
  styleUrls: ['./basic-settings.component.scss']
})
export class BasicSettingsComponent implements OnInit {
  basicSettingsForm!: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  feviconPreview: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  color: string = '#000000';
  isSettings: boolean = true;
  basicSettings: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.basicSettingsForm = this.fb.group({
      BaseColour: [this.color, Validators.required],
      UserId: [0],
      DomainId: [0],
      LogoPath: ['', Validators.required],
      FaviconPath: ['', Validators.required],
      WebsiteTitle: ['', Validators.required],
      WhatsAppNumber: [''],
      Telegram: [''],
      Instagram: [''],
      Email: [''],
      EnquiryNumber: [''],
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      //
    }    
    this.spinner.hide();
  }

  onColorChange(color: string): void {
    this.color = color;
    this.basicSettingsForm.get('BaseColour')?.setValue(color);
  }

  getSettings() {
    this.basicSettings = [];
    this.spinner.show();
    this.accountService.getBasicSettings().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.basicSettings = response.data;
        } else {          
          this.isSettings = false;
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  addSettings() {
    if (this.basicSettingsForm.invalid) {
      this.validateAllFormFields(this.basicSettingsForm);
      return;
    }
    this.spinner.show();
    this.accountService.addBasicSettings(this.basicSettingsForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.basicSettingsForm.reset();
          this.clearPreviewUrls();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  updateSettings() {
    if (this.basicSettingsForm.invalid) {
      this.validateAllFormFields(this.basicSettingsForm);
      return;
    }
    this.spinner.show();
    this.accountService.updateBasicSettings(this.basicSettingsForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.basicSettingsForm.reset();
          this.clearPreviewUrls();
          this.getSettings();
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
      BaseColour: {
        required: 'BaseColour field is required',
      },
      LogoPath: {
        required: 'LogoPath field is required',
      },
      FaviconPath: {
        required: 'FaviconPath is required',
      },
      WebsiteTitle: {
        required: 'WebsiteTitle is required',
      },
    };

    return errorMessages[field]?.[errorName] || 'Invalid field';
  }

  onFileSelected(event: any, type: string): void {
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
      if (type === "Logo") {
        this.logoPreview = reader.result;
      } else if (type === "Favicon") {
        this.feviconPreview = reader.result;
      }
    };

    // Upload the file
    this.accountService.uploadFile(fileData, type).subscribe({
      next: (response: any) => {
        if (response.status) {
          const imagePath = response.data.replace('wwwroot/', environment.apiBaseUrl.replace("/api/v1", ""));
          if (type === "Logo") {
            this.basicSettingsForm.patchValue({
              LogoPath: imagePath,
            });
          } else if (type === "Favicon") {
            this.basicSettingsForm.patchValue({
              FaviconPath: imagePath,
            });
          }
        }
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  clearPreviewUrls() {
    this.logoPreview = "";
    this.feviconPreview = "";
    document.getElementById('clsmdl')?.click();
  }

  getModelValue(settings: any) {
    
    this.color = settings.baseColour;
    this.logoPreview = settings.logoPath;
    this.feviconPreview = settings.faviconPath;
    this.basicSettingsForm.patchValue({
      BaseColour: settings.baseColour,
      UserId: settings.userId,
      DomainId: settings.domainId,
      LogoPath: settings.logoPath,
      FaviconPath: settings.faviconPath,
      WebsiteTitle: settings.websiteTitle,
      WhatsAppNumber: settings.whatsAppNumber,
      Telegram: settings.telegram,
      Instagram: settings.instagram,
      Email: settings.email,
      EnquiryNumber: settings.enquiryNumber,
    });
  }
}
