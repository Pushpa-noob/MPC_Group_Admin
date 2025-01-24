import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-api-settings',
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.scss']
})
export class ApiSettingsComponent implements OnInit {
  apiForm!: FormGroup;
  apiList: any = [];
  data: any = [];
  constructor(private fb: FormBuilder, private accountService: AccountService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.apiForm = this.fb.group({
      SportsId: [null, [Validators.required]],
      ProviderId: [null, [Validators.required]],
      ProviderName: [null, [Validators.required]],
      ApiType: [null, [Validators.required]],
      Url: [null, [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.getUrlList();
  }

  onSubmit(): void {
    this.spinner.show();
    
    if (this.apiForm.valid) {
      this.accountService.addUrls(this.apiForm.value).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, "Success");
            document.getElementById("clsaddmdl")?.click();
            this.getUrlList();
          } else {
            this.toastr.error(response.message, "Fail");
          }
        },
        complete: () => {
          this.spinner.hide();
        }
      })
    } else {
      this.toastr.error("Required fields", "Fail");
    }
  }
  getData(data: any) {
    this.data = data;
  }

  update(): void {
    this.spinner.show();
      this.accountService.updateUrls(this.data).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, "Success");
            document.getElementById("clsmdl")?.click();
            this.getUrlList();
          } else {
            this.toastr.error(response.message, "Fail");
          }
        },
        complete: () => {
          this.spinner.hide();
        }
      });
  }

  getUrlList() {
    this.apiList = [];
    this.spinner.show();
    this.accountService.getApiUrls().subscribe({
      next: response => {
        if (response.status) {
          this.apiList = response.data;
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
}
