import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-client-bethistory',
  templateUrl: './client-bethistory.component.html',
  styleUrls: ['./client-bethistory.component.scss']
})
export class ClientBethistoryComponent {
  sportsId: number = 4;
  seriesList: any = [];
  seriesId: string = ''
  eventList: any = []
  marketList: any = []
  eventId: string = '';
  marketId: string = '';
  tournamentName: string = '';
  eventName: string = '';
  marketName: string = '';
  skipRecords: number = 0;
  count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  betHis: any = [];
  username: string = '';
  endTime: string ='';
  startTime: string='';
  eventTime:string='';
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.getDate()
    this.getBetHistory();
  }

  getDate() {
    // Calculate the end date (today at 11:59:59 PM)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Calculate the start date (one week ago at 12:00:00 AM)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7); // Subtract 7 days

    // Convert to YYYY-MM-DDTHH:MM format for datetime-local input fields
    this.startTime = this.formatDateTimeLocal(startDate);
    this.endTime = this.formatDateTimeLocal(endDate);
}

// Helper function to format date and time as YYYY-MM-DDTHH:MM
formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}



  onUsernameChange(username: string) {
    this.username = username;
      this.getBetHistory();
  }

  pageChanged(pageNo: any) {

    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getBetHistory();
  }

  updateRecValue(event: any) {

    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
    this.getBetHistory();
  }

  getBetHistory() {
    this.betHis = []
    this.spinner.show();
    this.accountService.getUserBetHistoy(this.eventId, this.marketName, this.username, this.startTime, this.endTime, this.skipRecords, this.takeRecords).subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.betHis = response.data;
          this.count = response.totalItems;
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

  onSportChange(event: Event) {
    this.sportsId = Number((event.target as HTMLSelectElement).value);
    this.getEventsHistory();
  }



  onTournamentChange(event: any) {
    this.seriesId = event.target.value;
    this.getmarkets();
  }

  onEventChange(event: any) {
    this.eventId = event.target.value;
    this.getmarkets();
  }

  onMarketChange(event: any) {
    this.marketName = event.target.value;
    this.getBetHistory();
  }


  getTournaments() {
    this.seriesList = []
    this.spinner.show();
    this.accountService.getTournaments(this.sportsId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.seriesList = response.data;
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


  getEventsHistory() {
    this.eventList = []
    this.spinner.show();
    this.accountService.getBetEventList(this.sportsId).subscribe({
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

  getmarkets() {
    this.marketList = [];
    this.spinner.show();
    this.accountService.getBetMarketList(this.eventId).subscribe({
      next: (response: any) => {
        this.marketList = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  reset(){
    this.username = ''
    this.marketName = ''
    this.eventId = ''
    this.eventList = []
    this.sportsId = 0
    this.marketList = []
    this.getDate();
    this.getBetHistory();
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

}
