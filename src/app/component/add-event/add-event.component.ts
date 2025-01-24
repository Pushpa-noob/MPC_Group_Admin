import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
  sportsId: number = 4;
  seriesList : any =[];
  seriesId:string = ""; 
constructor(private authService: AuthService,
  private spinner: NgxSpinnerService,
  private accountService: AccountService,
  private toastr: ToastrService,
  private router: Router,
  private route: ActivatedRoute,
  private fb: FormBuilder){
}

ngOnInit(): void {
  this.getSeries();
}

OnValueChange(sportsId: any) {
    
  this.sportsId = sportsId.target.value;
  this.getSeries();
}

getSeries(){
  this.spinner.show();
  this.accountService.getSeriesList(this.sportsId).subscribe({
    next: (response: any) => {
      if (response.status) {
        this.seriesList = response.data
      }else{
        this.seriesList = []
        this.toastr.error(response.message,"Failed")
      }
    },
    error: (error: any) => {
      this.handleError(error);
    },
    complete: () => {
      this.spinner.hide();
    }
  });
}

  addEvent() {
    this.spinner.show();
    this.accountService.createEventsFromCommonPortal().subscribe({
      next: (response: any) => {
        if(response.status){
          this.toastr.success(response.message, 'Success')

        }else{
          this.toastr.error(response.message, 'Failed')

        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
        this.getSeries()
      }
    });
  }

  saveAllTournamentMatches(id:string) {
     
    this.seriesId = id;
    this.spinner.show();
    this.accountService.saveAllTournamentMatches(this.sportsId, this.seriesId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, "Success")
          this.getSeries();
        } else {
          this.toastr.error(response.message, "Failed")
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

    //Handling Errors
    private handleError(error: any) {
      if (error.status == 401) {
        this.authService.logout();
        this.router.navigate(["/signin"]);
      }
      this.spinner.hide();
    }
}
