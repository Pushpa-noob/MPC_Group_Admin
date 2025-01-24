import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent {
  sportsId: number = 0;
  seriesId: string = "";
  srsName: string = "";
  eventList: any = []
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }


  ngOnInit(): void {
     
    this.route.paramMap.subscribe((params) => {
      this.sportsId = parseInt(params.get('sportsId') || '0', 10);
      this.seriesId = params.get('seriesId') ?? '';
      this.srsName = params.get('name') ?? '';
    });
    this.getEvent();
  }

  getEvent() {
     
    this.spinner.show();
    this.accountService.getEventList(this.sportsId, this.seriesId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.eventList = response.data
        } else {
          this.eventList = []
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

  addEvent(data: any) {
     
    this.spinner.show();
    this.accountService.addEvent(data).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, "Success")
          this.getEvent();
        } else {
          this.eventList = []
          this.toastr.error(response.message, "Failed")
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
        this.getEvent();
      }
    });
  }




  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }
}
