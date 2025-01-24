import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-result-market',
  templateUrl: './result-market.component.html',
  styleUrls: ['./result-market.component.scss']
})
export class ResultMarketComponent {
  sportsId: number = 4;
  marketName: string = 'To Win The Toss';
  eventList: any = [];
  runnerId: string = '';
  runnerName: string = '';
  eventName: string = '';
  eventId: string = '';
  runnerError: boolean = false;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,) {
  }

  ngOnInit(): void {
    this.getEvents();
  }


  deletePendingEvent(){
    this.spinner.show();
    this.accountService.deletePendingEvent().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          this.getEvents();
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

  onSportsIdChange(event: any) {
    
    this.sportsId = event.target.value;
    if (this.sportsId != 4) {
      this.marketName = 'Match Odds'
    }
    this.getEvents();
  }

  onMarketChange(event: any) {
    this.marketName = event.target.value;
    this.getEvents();
  }

  getRunnerValue(rnr: any): string {
    return JSON.stringify({ id: rnr.id, runnerName: rnr.runnerName });
  }

  onRunnerChange(event: any): void {
    
    const selectedValue = event.target.value;
    if (selectedValue) {
      this.runnerError = false;
      const selectedRunner = JSON.parse(selectedValue);
      const runnerId = selectedRunner.id;
      const runnerName = selectedRunner.runnerName;
      this.runnerId = runnerId;
      this.runnerName = runnerName;
    }
    else {
      this.runnerError = true;
      this.runnerName = ''
      this.runnerId = ''
    }
  }


  getEvents() {
    this.eventList = [];
    this.spinner.show();
    this.accountService.getEventMarket(this.sportsId, this.marketName).subscribe({
      next: (response: any) => {
        this.eventList = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  setUpModal(data: any) {
    
    if (this.runnerName !== '' && this.runnerId !== '') {
      this.eventName = data.eventName;
      this.eventId = data.betfairEventId;
      document.getElementById('modalTriggerButton')?.click();
    } else {
      this.runnerError = true;
    }
  }

  setvalue(list: any) {
      this.eventId = list.betfairEventId;
      this.marketName = list.betfairMarketName;
      this.eventName = list.eventName;
  }

  abandonedMarket() {
    this.eventList = [];
    this.spinner.show();
    this.accountService.abandonedMarket( this.eventId, this.marketName).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('clsDlt')?.click();
          this.getEvents();
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

  deleteMarket() {
    this.eventList = [];
    this.spinner.show();
    this.accountService.deleteMarket( this.eventId, this.marketName).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('clsDlt')?.click();
          this.getEvents();
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



  declare() {
    this.eventList = [];
    this.spinner.show();
    this.accountService.matchResult(this.runnerId, this.eventId, this.runnerName, this.marketName).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('closeDeclareBtn')?.click();
          this.getEvents();

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

  reset() {
    this.eventName = ''
    this.runnerId = ''
    this.runnerName = ''
    this.runnerError = false;
    this.eventId = ''
  }

   private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }
}
