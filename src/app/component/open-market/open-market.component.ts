import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportService } from 'src/app/services/export.service';
interface Market {
  eventId: number;
  marketName: string;
  // Add other properties if needed
}
@Component({
  selector: 'app-open-market',
  templateUrl: './open-market.component.html',
  styleUrls: ['./open-market.component.scss']
})
export class OpenMarketComponent {
  returnObj: any = [];
  type: string = 'All';
  takeRec: number = 50;
  skipRec: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  isSearchValid: boolean = true;
  selectedMarkets: Market[] = [];
  searchKeyword: string = "";
  userId: number = 0;
  sportsList: any = [];
  seriesList: any = [];
  marketList: any = [];
  eventList: any = [];
  bets: any = [];
  sportsId: any = 0;
  eventId: string = "";
  seriesId: string = "";
  password: string = "";
  marketId: string = "";
  marketName: string = "";
  status: boolean = false;
  eventType: string = "";
  marketSettings:any=[];
  isInPlay:boolean=false;
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private exportService: ExportService,
    private sharedService: SharedService) {
    const id = localStorage.getItem('admin_userId');
    this.userId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    this.getSports();
    this.getOpenmarkets()
  }
downloadCSV() {
    this.exportService.exportToCSV(this.returnObj, 'returnObj');
  }

  downloadPDF() {
    this.exportService.exportToPDF(this.returnObj, 'returnObj');
  }

  search() {
    
    if (this.searchKeyword.length >= 2) {
      this.type = "Search"
      this.getOpenmarkets();
    }
  }

  getOpenmarkets() {
    this.returnObj = [];
    this.spinner.show();
    this.accountService.getOpenMarkets(this.sportsId, this.type, this.takeRec, this.skipRec, this.searchKeyword,).subscribe({
      next: (response: any) => {
        this.Count = response.totalItems
        this.returnObj = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  searchOpenmarkets() {
    this.returnObj = [];
    this.spinner.show();
    this.accountService.searchOpenMarkets(this.sportsId, this.seriesId, this.eventId, this.marketName, this.takeRec, this.skipRec).subscribe({
      next: (response: any) => {
        this.returnObj = response.data;
        this.Count = response.totalItems;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  getSports() {
    this.sportsList = [];
    this.spinner.show();
    this.accountService.getAllSports().subscribe({
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

  

  onSportChange(event: any) {
    
    this.sportsId=event.target.value;
    this.getOpenmarkets();
  }

  resetAll() {
    this.pageNum = 1;
    this.takeRec = 50;
    this.skipRec = 0;
    this.eventId = "";
    this.eventList = [];
    this.marketName == ""
    this.marketList = [];
    this.seriesId = ""
    this.seriesList = []
    this.sportsId = ""
    this.sportsList = []
    this.password = ""
    this.searchKeyword = ""
    this.returnObj = ""
    this.selectedMarkets = [];
    this.getOpenmarkets();
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRec = 0;
    this.takeRec = data;
    this.getOpenmarkets();
  }

  pageChanged(pageNo: any) {

    this.pageNum = pageNo;
    this.skipRec = (pageNo - 1) * this.takeRec;
    this.getOpenmarkets();
  }


  selectMarkets(data: Market) {

    
    const index = this.selectedMarkets.findIndex(
      market => market.eventId === data.eventId && market.marketName === data.marketName
    );

    if (index === -1) {
      this.selectedMarkets.push({
        eventId: data.eventId,
        marketName: data.marketName
      });
    } else {
      this.selectedMarkets.splice(index, 1);
    }
  }

  setType(type: string) {
    this.type = type;
  }

  callApi() {
    this.updateMultipleStatus(this.type)
  }

  getMarketSettings(marketId:string,eventId:string,marketName:string,isInPlay:boolean){
    this.isInPlay=isInPlay;
    this.spinner.show();
    this.marketSettings=[];
    this.accountService.getMarketSettings(eventId,marketName,isInPlay).subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.marketSettings=response.data;
          this.marketSettings.marketId=marketId;
          this.marketSettings.eventId=eventId;
          this.marketSettings.marketName=marketName;
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

  updateMarketSettings(){
    
    this.marketSettings.isInPlay=this.isInPlay;
    this.accountService.updateMarketSettings(this.marketSettings).subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.toastr.success(response.message, 'success')
          document.getElementById("clsdep")?.click();          
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

  updateMultipleStatus(type: string) {
    this.spinner.show();
    const payload = {
      password: this.password,
      type: type,
      MarketReq: this.selectedMarkets
    };
    this.accountService.updateMultipleOpenMarket(payload).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'success')
          document.getElementById("cldCnfPassMdl")?.click();
          this.type = "All";
          this.searchKeyword = "";
          this.password = "";
          this.getOpenmarkets();
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

  getBets(eventId: string, marketName: string,sportsName:string,tournament:string,event:string) {
    this.bets = [];
    this.spinner.show();
    this.marketName = `${sportsName}/${tournament}/${event}/${marketName}`;
    this.accountService.getMarketBets(eventId, marketName).subscribe({
      next: response => {
        
        if (response.status) {
          this.bets = response.data;
        }

      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

  downloadExcel(): void {
    this.spinner.show();
    const bets = this.bets;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bets.map((req: any) => ({
      'Client Name[LoginId]': req.userName,
      'Runner': req.runnerName,
      'Type': req.selection,
      'Rate': req.odds,
      'Stake': req.stake,
      'P/L': (req.selection === 'Back' || req.selection === 'Yes') ?req.profit:req.exposure ,
      'Place Time': req.betTime,      
      'Match Time': req.createdOn,
     
    })));

    const workbook: XLSX.WorkBook = { Sheets: { 'Withdrawal Requests': worksheet }, SheetNames: ['Withdrawal Requests'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Withdrawal-requests');
    this.toastr.success("Excel downloaded successfully", 'Success', { timeOut: 5000 });
    this.spinner.hide()

  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

