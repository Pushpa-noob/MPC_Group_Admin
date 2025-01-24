import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { elementAt } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styleUrls: ['./open-bets.component.scss']
})
export class OpenBetsComponent {
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
  betList:any = [];
  username:string='';
  skipRecords: number = 0;
  count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  betsBackUp:any=[];
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.getPendingBets();
  }

  onUsernameChange(username: string) {
    this.username = username;
      this.getPendingBets();
  }

  pageChanged(pageNo: any) {

    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getPendingBets();
  }

  updateRecValue(event: any) {

    const data = parseInt(event.target.value, 10);
      this.pageNum = 1;
      this.skipRecords = 0;
      this.takeRecords = data;
      this.getPendingBets();
  }


  getPendingBets(){
    this.betList = []
    this.spinner.show();
    this.accountService.getPendingBets(this.username,this.skipRecords,this.takeRecords).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.betList = response.data;
          this.betsBackUp=response.data;
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

  filterBets(marketName: string) {
    if(marketName=="All"){
      this.betList = this.betsBackUp;
    }else{
      this.betList = this.betsBackUp.filter((x:any) => x.marketName.toLowerCase() == marketName.toLowerCase());
    }
    
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }
 
}
