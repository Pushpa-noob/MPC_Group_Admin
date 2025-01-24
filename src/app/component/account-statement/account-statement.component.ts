import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent {
  filterType: string = 'All';
  startTime: string = '';
  parentId: number = 0;
  endTime: string = '';
  skipRecords: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  transObj: any = [];
  returnObj: any = [];
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    this.getDates();
    this.getTransationHistory();
  }

  onStartTimeChange(newValue: string) {
    this.startTime = newValue;
  }


  onEndTimeChange(newValue: string) {
    this.endTime = newValue;
  }

  resetAll() {
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = 50;
    this.Count = 0;
    this.filterType = "Own";
    this.startTime = "";
    this.endTime = ""
  }
  pageChanged(pageNo: any) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getTransationHistory();
  }

  getHistoryData(value: string) {

    this.filterType = value;
    this.pageNum = 1
    this.skipRecords = 0;
    this.takeRecords = 20;
    this.getTransationHistory()
  }

  getHistory(type: string) {
    if (type == 'report') {
      this.filterType = "AllCredit";
    } else {
      this.filterType = "All";
    }
    this.skipRecords = 0;
    this.takeRecords = 50;
    this.pageNum = 1;
    this.getTransationHistory();
  }

  getTransationHistory() {
    this.spinner.show();
    this.returnObj = [];
    const startTime = `${this.startTime.split('T')[0]} T00:00:00`; // 'YYYY-MM-DD 00:00:00'
    const endTime = `${this.endTime.split('T')[0]} T23:59:59`;
    this.accountService.getAllTransationHistory(this.parentId, this.filterType, startTime, endTime, this.skipRecords, this.takeRecords).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.returnObj = response.data;
          this.Count = response.totalItems
        } else {
          this.returnObj = [];
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

  getDates() {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 0);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    this.startTime = this.formatDate(startDate);
    this.endTime = this.formatDate(endDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
    this.getTransationHistory();
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

  openInNewTab(data: any) {
    if(data.marketName=="cash" || data.marketName=="Settlement" || data.marketName=="Match Commision" || data.marketName=="Session Commision"){
      return;
    }
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace('/user_list', '/client_bids');
    const finalUrl = newUrl.split('?')[0] + `?marketName=${data.marketName}&eventId=${data.eventId}&runnerId=${data.runnerId}&userId=${data.userId}`;
  
    window.open(finalUrl, '_blank');
  }
}
