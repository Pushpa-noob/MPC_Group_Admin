import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-result-fancy',
  templateUrl: './result-fancy.component.html',
  styleUrls: ['./result-fancy.component.scss']
})
export class ResultFancyComponent {
  eventId: string = '';
  fancyList: any[] = [];
  eventList: any[] = [];
  resultRun: any[] = [];
  runnerName: string = '';
  runnerId: string = '';
  runValue: number =0;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }
  ngOnInit(): void {
  }

  setValues(data: any, i: number): void {
    
    this.runnerName = data.runnerName;
    this.runnerId = data.runnerId;
    this.eventId = data.eventId;
    if (this.resultRun[i] !== undefined) {
      this.runValue = this.resultRun[i];
    } else {
      this.runValue = 0;
    }
  }

 
  reset(): void {
    this.resultRun = [];
    this.runnerName = '';
    this.runnerId = '';
    this.eventId = '';
    this.runValue = 0;
  }

  getFancyEvents() {
    this.eventList = []; 
    this.spinner.show();
    this.accountService.getFancyEvents().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.eventList = response.data;
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

  onEventChange(event: any) {
    
    this.eventId = event.target.value;
    this.getFancyListForResult();
  }

  getFancyListForResult() {
    this.fancyList = [];
    this.spinner.show();
    this.accountService.getFancyListForResult(this.eventId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.fancyList = response.data;
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

  abndnMdl(data:any){
    this.runnerName = data.runnerName;
    this.runnerId = data.runnerId;
    this.eventId = data.eventId;
  }

  abandoned() {
    
    this.spinner.show();
    this.accountService.abandonedFancy(this.runnerId, this.eventId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('clsAbnFancy')?.click();
          this.getFancyListForResult();
        } else {
          this.toastr.error(response.message, 'Failed')
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

  declare(){
    this.spinner.show();
    this.accountService.fancyResult(this.runnerId,this.eventId,this.runValue).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getFancyListForResult();
          document.getElementById('clsMdlDec')?.click();
          this.toastr.success(response.message,'Success')
        }else{
          this.toastr.error(response.message,'failed')
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

   private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }
}
