import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-market-wise-stake',
  templateUrl: './market-wise-stake.component.html',
  styleUrls: ['./market-wise-stake.component.scss']
})
export class MarketWiseStakeComponent {
  sportsId: number = 4;
  seriesList: any = [];
  seriesId: string = ''
  eventList: any = []
  marketWiseStake: any = []
  eventId: string = '';
  marketId: string = '';
  tournamentName: string = '';
  eventName: string = '';
  marketName: string = 'Match Odds';
  skipRecords: number = 0;
  count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  skipRecordsBets: number = 0;
  countBets: number = 0;
  pageNumBets: number = 1;
  takeRecordsBets: number = 50;
  betHis: any = [];
  username: string = '';
  endTime: string = '';
  startTime: string = '';
  userId: number = 0;
  parentId: number = 0;
  keyWord: string = '';
  userList: any = [];
  marketList: any = [];
  runnerId:string = "";
  breadcrumbs: { username: string; userId: number }[] = []; // List of breadcrumb data
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private exportService : ExportService,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    this.getDate()
    this.getMarketWiseStake()
  }

  downloadCSV() {
    this.exportService.exportToCSV(this.marketWiseStake, 'MarketWiseStakePL');
}

downloadExcel() {
    this.exportService.exportToExcel(this.marketWiseStake, 'MarketWiseStakePL');
}

downloadPDF() {
    this.exportService.exportToPDF(this.marketWiseStake, 'MarketWiseStakePL');
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

  pageChanged(pageNo: any) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
  }

  onSportChange(event: Event) {
    this.sportsId = Number((event.target as HTMLSelectElement).value);
    this.getEventsHistory();
  }
  onEventChange(event: any) {
    this.eventId = event.target.value;
    this.getmarkets();
  }
  onMarketChange(event: any) {
    this.marketName = event.target.value;
  }
  selectMarket(event: any) {
    this.marketName = event.target.value;
    this.getMarketWiseStake();
  }

  getMarketWiseStake() {
    this.marketWiseStake = [];
    this.spinner.show();
    this.accountService.getMarketWiseStake(this.userId, this.eventId,this.marketName, this.startTime, this.endTime, this.skipRecords, this.takeRecords, this.parentId).subscribe({
      next: (response: any) => {
        this.marketWiseStake = response.data;
        this.count = response.totalItems;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  
  getIds(): void {
    if (this.keyWord.trim() === '' || this.keyWord.length <= 2) {
      this.userList = []; // Clear the list if the input is empty
      return;
    }
    this.spinner.show();
    this.accountService.finduser(this.keyWord).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.userList = response.data;
        } else {
          this.userList = []; // Clear the list if the response status is false
        }
      },
      error: (error: any) => {
        this.handleError(error);
        this.userList = []; // Clear the list on error
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  selectUser(data: any) {
    this.userId = data;
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.pageNum = 1;
    this.takeRecords = 50;
    this.skipRecords = 0;
    this.eventId = '';
    this.marketId = ''
    this.getDate();
    this.getMarketWiseStake();
  }

  getInnerParent(data:any){
    
    this.userId=0;
    this.eventId=data.eventId;
    this.parentId=data.userId;
    this.pageNum = 1;
    this.takeRecords =50;
    this.skipRecords = 0;
     this.keyWord=''
  
     this.breadcrumbs.push({
      username: data.name,
      userId: data.userId
    });
     this.getMarketWiseStake();
  }

  reset() {
    this.keyWord = ''
    this.userId = 0;
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.pageNum = 1;
    this.takeRecords = 50;
    this.skipRecords = 0;
    this.eventId = '';
    this.marketId = ''
    this.breadcrumbs = []
    this.getMarketWiseStake();
  }

  navToList(data: any) {
    const index = this.breadcrumbs.indexOf(data);
    if (index !== -1) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    }
    this.takeRecords = 50;
    this.pageNum = 1;
    this.skipRecords = 0;
    this.parentId = data.userId
    this.getMarketWiseStake();
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

  
  getEventWiseBetHistory(eventId:string) {
    this.betHis = []
    this.spinner.show();
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.accountService.getEventWiseBetHistory(eventId, this.parentId,this.marketName, this.startTime, this.endTime, this.skipRecords, this.takeRecords).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.betHis = response.data;
          this.countBets = response.totalItems;
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

  
  pageChangedBets(pageNo: any) {
    this.pageNumBets = pageNo;
    this.skipRecordsBets = (pageNo - 1) * this.takeRecordsBets;
    this.getMarketWiseStake();
  }

  updateRecValueBets(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNumBets = 1;
    this.skipRecordsBets = 0;
    this.takeRecordsBets = data;
    this.getMarketWiseStake();
  }

  resetModel(){
    this.takeRecordsBets = 50;
    this.pageNumBets = 1;
    this.skipRecordsBets = 0
    this.betHis = []
    this.countBets = 0
  }



   private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }

}
