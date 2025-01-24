import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-banner-upload',
  templateUrl: './banner-upload.component.html',
  styleUrls: ['./banner-upload.component.scss']
})
export class BannerUploadComponent implements OnInit {
  bannerForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  banners: any = [];
  fileError: string | null = null;
  bannerId: number = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private authService: AuthService
  ) {
    this.bannerForm = this.fb.group({
      Id: [0],
      ImagePath: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBanners();
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      //
    }
    this.spinner.hide();
  }

  getBanners() {
    this.banners = [];
    this.spinner.show();
    this.accountService.getBanners().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.banners = response.data;
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  addBanner() {
    if (this.bannerForm.invalid) {
      this.toastr.error("Please upload the banner", 'Failed', { timeOut: 5000 });
      return;
    }
    this.spinner.show();
    this.accountService.addBanners(this.bannerForm.value).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.bannerForm.reset();
          this.previewUrl = "";
          this.getBanners();
          this.toastr.success(response.message, 'Success', { timeOut: 5000 });
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 5000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  deleteBanner() {
    this.spinner.show();
    this.accountService.deleteBanners(this.bannerId).subscribe({
      next: (response: any) => {
        if (response.status) {
          document.getElementById("clsmdl")?.click();
          this.toastr.success(response.message, 'Success', { timeOut: 3000 });          
          this.getBanners();
        } else {
          this.toastr.error(response.message, 'Failed', { timeOut: 3000 });
        }
      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    });
  }

  getModelValues(banners: any) {
    this.bannerId = banners.id;
  }

  onFileSelected(event: any): void {
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
    const fileType = 'Banner';
    this.accountService.uploadFile(fileData, fileType).subscribe({
      next: (response: any) => {
        if (response.status) {
          const imagePath = response.data.replace('wwwroot/', environment.apiBaseUrl.replace("/api/v1", ""));
          this.bannerForm.patchValue({
            ImagePath: imagePath,
          });
        }
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }


}
