import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-profit-loss-report',
  templateUrl: './profit-loss-report.component.html',
  styleUrls: ['./profit-loss-report.component.scss']
})
export class ProfitLossReportComponent {
  startTime: string = '';
  endTime: string = '';
  returnObj: any = [];
  returnList: any = [];
  userId: number = 0;
  sharing: boolean = false;
  total: any = [];
  listTotal: number = 0;
  sportsId: number = 0;
  sportsName: string = '';
  breadcrumbs: { userId: number, userName: string }[] = [];
  isHomeClicked :boolean=false;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getDates();
    this.getOverAllPL(0, this.userId);
  }

  onStartTimeChange(newValue: string) {
    this.startTime = newValue;
  }


  onEndTimeChange(newValue: string) {
    this.endTime = newValue;
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


  navigateToUser(userId: number) {
    
    this.getOverAllPL(this.sportsId,userId);
    this.breadcrumbs = this.breadcrumbs.slice(0, this.breadcrumbs.findIndex(bc => bc.userId === userId) + 1);
  }

  getOverAllPL(sportId: number, userId: number) {
    this.spinner.show(); 
    this.userId = userId;
    const userName = this.returnList.find((item: any) => item.userId === userId)?.userName || '';    
    this.accountService.getOverAllPandL(this.userId, this.startTime, this.endTime, this.sharing).subscribe({
      next: response => {   
        debugger;     
        if (response.status) {             
            this.isHomeClicked = userId>0?true:false;
            this.returnList = response.data.overAllPLResponses;
            this.total=response.data.total;
            if (!this.breadcrumbs.some(bc => bc.userId === userId)) {
              this.breadcrumbs.push({ userId, userName });
          }         
        }else{
          this.returnList=[];
        }
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  resetAll() {

  }


  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }
}
