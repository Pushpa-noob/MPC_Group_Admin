import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { elementAt } from 'rxjs';
import { ExportService } from 'src/app/services/export.service';

import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-client-bids',
  templateUrl: './client-bids.component.html',
  styleUrls: ['./client-bids.component.scss']
})
export class ClientBidsComponent {
  sportsId: number = 4;
  seriesList:any =[];
  seriesId:string = ''
  eventList:any =[]
  marketList:any =[]
  eventId:string = '';
  marketId: string = '' ;
  tournamentName:string ='';
  eventName:string ='';
  marketName:string='';
  userId:number=0;
  betList:any = [];
  username:string='';
  skipRecords: number = 0;
  count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  runnerId:string=''
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private exportService : ExportService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.marketName = params['marketName'];
      this.eventId = params['eventId'];
      this.runnerId = params['runnerId'];
      this.userId=Number(params['userId']);
    });
    
    this.getAllBetHistory();
  }
  
  getAllBetHistory(){
    this.betList = []
    this.spinner.show();
    this.accountService.getEventBetHistoryForUser(this.username,this.marketName,this.eventId,this.runnerId,this.skipRecords,this.takeRecords,this.userId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.betList = response.data;
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

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

  downloadCSV() {
    this.exportService.exportToCSV(this.betList, 'betList');
}

downloadExcel() {
    this.exportService.exportToExcel(this.betList, 'betList');
}

downloadPDF() {
    this.exportService.exportToPDF(this.betList, 'betList');
}
  
  pageChanged(pageNo: any) {

    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getAllBetHistory();
  }

  updateRecValue(event: any) {

    const data = parseInt(event.target.value, 10);
      this.pageNum = 1;
      this.skipRecords = 0;
      this.takeRecords = data;
      this.getAllBetHistory();
  }

  onUsernameChange(username: string) {
    this.username = username;
    this.getAllBetHistory();
  }
}
