import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-unblock-market',
  templateUrl: './unblock-market.component.html',
  styleUrls: ['./unblock-market.component.scss']
})
export class UnblockMarketComponent {
  activeItems: { [key: string]: number } = {};
  searchKeyword: string = "";
  userId: number = 0;
  sportsList: any = [];
  seriesList: any = [];
  marketList: any = [];
  eventList: any = []
  sportsId: number = 0;
  eventId: string = "";
  seriesId: string = "";
  password: string = "";
  marketId: string = "";
  marketName: string = "";
  status: boolean = false;
  eventType: string = "";
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
    const id = localStorage.getItem('admin_userId');
    this.userId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    this.chkSportsStatus()
  }

  toggleNested(level: string, id: number): void {
    if (this.activeItems[level] === id) {
      delete this.activeItems[level];
    } else {
      this.activeItems[level] = id;
    }
  }
  isActive(level: string, id: number): boolean {
    return this.activeItems[level] === id;
  }

    // Market Block Unblock Api Call's Start
    chkSportsStatus() {
      this.spinner.show();
      this.sportsList = [];
      this.accountService.getUsersSportsStatus(this.userId).subscribe({
        next: (response: any) => {
          this.sportsList = response.data;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  
    chkTournamentStatus(id: number) {
      this.spinner.show();
      this.seriesList = [];
      this.sportsId = id
      this.accountService.CheckUserTournamentStatus(this.userId, this.sportsId).subscribe({
        next: (response: any) => {
          this.seriesList = response.tournamentList;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  
    chkEventStatus(id: string) {
      this.spinner.show();
      this.eventList = [];
      this.seriesId = id
      this.accountService.getUsersEventStatus(this.userId, this.seriesId).subscribe({
        next: (response: any) => {
          this.eventList = response.events;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  
    chkMarketStatus(id: string) {
      this.spinner.show();
      this.marketList = [];
      this.eventId = id
      this.accountService.getUserMarketStatus(this.userId, this.eventId).subscribe({
        next: (response: any) => {
          this.marketList = response.market;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  
    blockUnblockSports() {
      this.accountService.blockUnblockSports(this.userId, this.sportsId, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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
  
    blockUnblockTournament() {
  
      this.accountService.blockUnblockTournament(this.seriesId, this.userId, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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
  
    blockUnblockEvent() {
      this.spinner.show();
      this.accountService.blockUnblockEvent(this.userId, this.eventId, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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
  
    blockUnblockMarket() {
      this.accountService.blockUnblockMarket(this.userId, this.marketId, this.eventId, this.marketName, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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
  
    resetBlockunblockMarketModel() {
      this.eventId = "";
      this.seriesId = "";
      this.sportsId = 0;
      this.marketId = ""
      this.marketName = "";
      this.eventList = [];
      this.seriesList = [];
      this.marketList = [];
      this.sportsList = [];
      this.password = "";
    }
  
    resetPassword() {
      this.password = ""
    }
  
  
    setValues(eventType: string, list: any) {
  
      this.eventType = eventType;
      if (eventType == 'sport') {
        this.sportsId = list.sports_id
      } else if (eventType == 'series') {
        this.seriesId = list.series_id;
      } else if (eventType == 'event') {
        this.eventId = list.event_id
      } else {
        this.marketId = list.market_id;
        this.marketName = list.market_name;
      }
    }
  
    blockUnblockType() {
  
      if (this.password.length > 0) {
        if (this.eventType == 'sport') {
          this.blockUnblockSports()
        } else if (this.eventType == 'series') {
          this.blockUnblockTournament();
        } else if (this.eventType == 'event') {
          this.blockUnblockEvent();
        } else {
          this.blockUnblockMarket();
        }
      }
      this.chkSportsStatus()
    }
    //Market Block  Api Call's End

    private handleError(error: any) {
      if (error.status == 401) {
        this.authService.logout();
        this.router.navigate(["/signin"]);
      }
      this.toastr.error(error.message, 'Failed', {
        timeOut: 5000,
      });
      this.spinner.hide();
    }
}
