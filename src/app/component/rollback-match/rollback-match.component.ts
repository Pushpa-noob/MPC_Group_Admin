import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-rollback-match',
  templateUrl: './rollback-match.component.html',
  styleUrls: ['./rollback-match.component.scss']
})
export class RollbackMatchComponent {
  marketName: string = "To Win the Toss"
  sportsId: number = 4;
  searchKey: string = ""
  marketList: any = [];
  skipRecords: number = 0;
  count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  runnerId: string="";
  eventId: string="";
  runnerName: any;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }
  ngOnInit(): void {
    this.getMarketHistoryByMarketName();
  }

  selectSport(event: any) {
    this.sportsId = event.target.value;
    if (this.sportsId != 4) {
      this.marketName == 'Match Odds'
    } else {
      this.marketName == 'To Win the Toss'
    }
    this.getMarketHistoryByMarketName();
  }
  selectMarket(event: any) {
    this.marketName = event.target.value;
    this.getMarketHistoryByMarketName();

  }

  pageChanged(pageNo: any) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getMarketHistoryByMarketName();
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
    this.getMarketHistoryByMarketName();
  }
  searchEvent() {
    this.marketList = [];
    this.spinner.show();
    this.accountService.getMarketHistoryByMarketName(this.sportsId, this.marketName, this.searchKey,this.skipRecords,this.takeRecords).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.marketList = response.data;
          this.count = response.totalItems
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
    this.eventId = data.eventId;
    this.runnerName = data.eventName;
  }

  getMarketHistoryByMarketName() {
    this.marketList = [];
    this.spinner.show();
    this.accountService.getMarketHistoryByMarketName(this.sportsId, this.marketName, this.searchKey,this.skipRecords,this.takeRecords).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.marketList = response.data;
          this.count = response.totalItems
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

  rollbackMatchResult() {
    
    this.spinner.show();
    this.accountService.rollbackMatchResult(this.eventId,this.marketName).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById('closeBtnmarketAbnd')?.click();
          this.getMarketHistoryByMarketName();
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
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"])
    }
    this.toastr.error(error.message, 'Failed', {
      timeOut: 5000,
    });
    this.spinner.hide();
  }

}
