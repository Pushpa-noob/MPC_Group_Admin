import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-rollback-fancy',
  templateUrl: './rollback-fancy.component.html',
  styleUrls: ['./rollback-fancy.component.scss']
})
export class RollbackFancyComponent {
  searchKey: string = "";
  eventList: any = [];
  fancyList: any = [];
  eventId: string = "";
  runnerId:string="";
  runnerName:string="";
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



  onEventChange(event: any) {
    
    this.eventId = event.target.value;
    this.getFancyHistory();
  }

  getFancyEvents() {
    this.eventList = [];
    this.spinner.show();
    this.accountService.getEventFancyHistory().subscribe({
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


  getFancyHistory() {
    this.fancyList = [];
    this.spinner.show();
    this.accountService.getFancytHistoryByEventId(this.eventId, this.searchKey).subscribe({
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
  searchFancy() {
    this.fancyList = [];
    this.spinner.show();
    this.accountService.getFancytHistoryByEventId(this.eventId, this.searchKey).subscribe({
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

  setModel(data: any) {
    this.runnerId = data.runnerId;
    this.eventId = data.eventId;
    this.runnerName = data.runnerName;
  }

  rollbackfancy() {
    
    this.spinner.show();
    this.accountService.rollbackFancy(this.runnerId, this.eventId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('closeBtnfancyAbnd')?.click();
          this.getFancyHistory();
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

   private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }
}
