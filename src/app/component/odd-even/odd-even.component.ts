import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-odd-even',
  templateUrl: './odd-even.component.html',
  styleUrls: ['./odd-even.component.scss']
})
export class OddEvenComponent implements OnInit {
  collapsedRows: boolean[] = [];
  events:any=[];
  runnerError: any = [];
  runnerId: string = '';
  runnerName: string = '';
  eventName: string = '';
  eventId: string = '';
  marketName: string = '';
  toggleCollapse(index: number): void {
    this.collapsedRows[index] = !this.collapsedRows[index];
}
  constructor(private router: Router,private authService: AuthService,private spinner:NgxSpinnerService,private accountService:AccountService,private toastrService:ToastrService){}
  ngOnInit(): void {
    this.collapsedRows = new Array(this.events.length).fill(false);
    this.getEvents();
  }

  getEvents(){
    this.spinner.show();
    this.accountService.getOddEven().subscribe({
      next:response=>{
        if(response.status){
          this.events=response.data;
        }
      }, error: (error: any) => {
            this.handleError(error);
          }, complete: () => {
            this.spinner.hide();
          }
    });
  }

  activeMarket(eventId:string,matchType:string){
    this.spinner.show();
    this.accountService.activeOddEvenMarket(eventId,matchType).subscribe({
      next:response=>{
        if(response.status){
          this.toastrService.success(response.message,'Success');
        }else{
          this.toastrService.error(response.message,'Failed');
        }
      }, error: (error: any) => {
            this.handleError(error);
          }, complete: () => {
            this.spinner.hide();
          }
    });
  }

  updateMarket(id:number){
    this.spinner.show();
    this.accountService.updateOddEvenMarket(id).subscribe({
      next:response=>{
        if(response.status){
          this.toastrService.success(response.message,'Success');
        }else{
          this.toastrService.error(response.message,'Failed');
        }
      }, error: (error: any) => {
            this.handleError(error);
          }, complete: () => {
            this.spinner.hide();
          }
    });
  }

  onRunnerChange(event: any,r:number): void {    
    const selectedValue = event.target.value;
    if (selectedValue) {
      this.runnerError[r] = false;
      const selectedRunner = JSON.parse(selectedValue);
      const runnerId = selectedRunner.id;
      const runnerName = selectedRunner.runnerName;
      this.runnerId = runnerId;
      this.runnerName = runnerName;
    }
    else {
      this.runnerError[r] = true;
      this.runnerName = ''
      this.runnerId = ''
    }
  }

  setUpModal(data: any,market:any,r:number) {
    
    if (this.runnerName !== '' && this.runnerId !== '') {
      this.eventName = data.eventName;
      this.eventId = data.betfairEventId;
      this.marketName=market.betfairMarketName;
      document.getElementById('modalTriggerButton')?.click();
    } else {
      this.runnerError[r] = true;
    }
  }

  setvalue(list: any,market:any) {
    this.eventId = list.betfairEventId;
    this.marketName = market.betfairMarketName;
    this.eventName = list.eventName;
}

  getRunnerValue(rnr: any): string {
    return JSON.stringify({ id: rnr.id, runnerName: rnr.runnerName });
  }

  declare() {
    this.events = [];
    this.spinner.show();
    this.accountService.matchResult(this.runnerId, this.eventId, this.runnerName, this.marketName).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastrService.success(response.message, 'Success')
          document.getElementById('closeDeclareBtn')?.click();
          this.getEvents();

        } else {
          this.toastrService.error(response.message, 'Failed')
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
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }
}
