import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';



@Component({
  selector: 'app-banking-method',
  templateUrl: './banking-method.component.html',
  styleUrls: ['./banking-method.component.scss']
})
export class BankingMethodComponent implements OnInit {
  bankingMethods: any = [];
  previewUrl: string | ArrayBuffer | null = null;
  fileError: string | null = null;
  bankingMethodForm: FormGroup;
  modelText:string='';
  bankingMethodId:number=0;
  isLocked:boolean=false;
  constructor(private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router, private fb: FormBuilder
  ) {
    this.bankingMethodForm = this.fb.group({
      Name: ['', Validators.required],
      ImagePath: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.getBankingMethods();
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

  private getBankingMethods() {
    this.spinner.show();
    this.accountService.getBankingMethods().subscribe({
      next: (response: any) => {
        if (response.status) {
          
          this.bankingMethods = response.data;
        }
      }, error: (error: any) => {
        this.handleError(error);
      }, complete: () => {
        this.spinner.hide();
      }
    })
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
    const fileType = 'Banking';
    this.accountService.uploadFile(fileData, fileType).subscribe({
      next: (response: any) => {
        if (response.status) {
          const imagePath = response.data.replace('wwwroot/', environment.apiBaseUrl.replace("/api/v1", ""));
          this.bankingMethodForm.patchValue({
            ImagePath: imagePath,
          });
        }
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }


  addBankingMethod() {    
    if (this.bankingMethodForm.valid) {
      this.spinner.show();
      this.accountService.addBankingMethod(this.bankingMethodForm.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.bankingMethodForm.reset();
            document.getElementById("clsmdl")?.click();
            this.getBankingMethods();
            this.toastr.success(response.message, 'Success', {
              timeOut: 5000,
            });
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
      });
    } else {
      this.toastr.error("Invalid form values", 'Failed', {
        timeOut: 5000,
      });
    }
  }

  getModelValues(value:boolean,id:number){
    this.modelText=value?"Active":"InActive";
    this.bankingMethodId=id;
    this.isLocked=value;
  }

  updateBankingMethod(){
    this.spinner.show();
    this.accountService.updateBankingMethod(this.bankingMethodId,this.isLocked).subscribe({
      next: (response: any) => {
        if (response.status) {
          document.getElementById("clsstsmdl")?.click();
          this.getBankingMethods();
          this.toastr.success(response.message, 'Success', {
            timeOut: 5000,
          });
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
  }

  deleteBankingMethod(){
    this.spinner.show();
    this.accountService.deleteBankingMethod(this.bankingMethodId).subscribe({
      next: (response: any) => {
        if (response.status) {
          document.getElementById("clsdltmdl")?.click();
          this.getBankingMethods();
          this.toastr.success(response.message, 'Success', {
            timeOut: 5000,
          });
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
  }
}
