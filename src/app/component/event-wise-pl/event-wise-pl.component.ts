import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export.service';
@Component({
  selector: 'app-event-wise-pl',
  templateUrl: './event-wise-pl.component.html',
  styleUrls: ['./event-wise-pl.component.scss']
})
export class EventWisePlComponent {
  sportsId: number = 4;
  seriesList: any = [];
  seriesId: string = ''
  eventList: any = []
  eventPL: any = []
  eventId: string = '';
  marketId: string = '';
  tournamentName: string = '';
  eventName: string = '';
  marketName: string = '';
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
  endTime: string ='';
  startTime: string='';
  userId:number=0;
  parentId:number=0;
  keyWord:string='';
  userList:any=[];
  selectedUser:string="";
  innerList :boolean=false;
  breadcrumbs: { username: string ; userId: number }[] = []; // List of breadcrumb data
  constructor(private authService: AuthService,
    private exportService : ExportService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,) {
      const id = localStorage.getItem('admin_userId');
      this.userId = id !== null ? parseInt(id, 10) : 0;
  }


  ngOnInit(): void {
    this.getDate()
    this.getEventPL()
  }

  downloadCSV() {
      this.exportService.exportToCSV(this.eventPL, 'EventWisePL');
  }

  downloadExcel() {
      this.exportService.exportToExcel(this.eventPL, 'EventWisePL');
  }

  downloadPDF() {
      this.exportService.exportToPDF(this.eventPL, 'EventWisePL');
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
    this.getEventPL();
  }
  getIds(): void {
    if (this.keyWord.trim() === '' || this.keyWord.length< 2) {
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

  selectUser(data:any){
  this.userId = data;
  const id = localStorage.getItem('admin_userId');
  this.parentId = id !== null ? parseInt(id, 10) : 0;
  this.pageNum = 1;
  this.takeRecords =50;
  this.skipRecords = 0;
  this.selectedUser = data.loginId;
  this.innerList = true;
  this.getDate();
  this.getEventPL();
  }

  reset(){
    this.keyWord=''
    this.userId = 0;
    const id = localStorage.getItem('admin_userId');
    this.userId = id !== null ? parseInt(id, 10) : 0;
    this.pageNum = 1;
    this.takeRecords =50;
    this.skipRecords = 0;
    this.eventId='';
    this.marketId=''
    this.selectedUser = ""
    this.innerList = false;
    this.breadcrumbs = []
    this.eventList = [];
    this.sportsId = 0
    this.getEventPL();
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
     this.getEventPL();
  }
 
  navToList(data:any){
    const index = this.breadcrumbs.indexOf(data);
    if (index !== -1) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    }
    this.userId =0;
    this.takeRecords = 50;
    this.pageNum = 1;
    this.skipRecords = 0;
    this.parentId = data.userId
    this.getEventPL();
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

  getEventPL() {
    this.eventPL = [];
    this.spinner.show();
    this.accountService.getEventPLHistory(this.userId,this.eventId,this.startTime,this.endTime,this.skipRecords,this.takeRecords,this.parentId).subscribe({
      next: (response: any) => {
        this.eventPL = response.data;
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

  getEventWiseBetHistory(eventId:string,userId:number) {
    this.betHis = []
    this.spinner.show();
    this.accountService.getEventWiseBetHistory(eventId, userId,'', this.startTime, this.endTime, this.skipRecords, this.takeRecords).subscribe({
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
    this.getEventPL();
  }

  updateRecValueBets(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNumBets = 1;
    this.skipRecordsBets = 0;
    this.takeRecordsBets = data;
  }

  resetModel(){
    this.takeRecordsBets = 50;
    this.pageNumBets = 1;
    this.skipRecordsBets = 0
    this.betHis = []
    this.countBets = 0
  }


  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }
}
