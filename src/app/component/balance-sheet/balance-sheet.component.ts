import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';



@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
  userId: number = 0;
  balanceSheet: any = [];
  backupBalanceSheet: any = [];
  plusData: any = [];
  minusData: any = [];
  total: number = 0;
  roleId: string = '0';
  breadcrumbs: { userId: number, userName: string }[] = [];
  backUpSettlement: any = [];
  selectedUserName: string = "";
  selectedUserId: number = 0;
  selectedUserRole: string = "";
  pendingSettlement: number = 0;
  settlementAmount: number = 0;
  amount: number = 0;
  remark: string = "Deposit Cash";
  password: string = "";
  type: string = "";
  isSettlementFull: boolean = false;
  valueType: string = "Cash";
  skipRecords: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 20;
  startTime: string = "";
  endTime: string = "";
  returnObj: any = [];
  selectedUser: string = '';
  isHomeClicked: boolean = false;
  balance: number = 0;
  Currency: string = '';
  constructor(private accountService: AccountService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {

    this.roleId = localStorage.getItem('roleId') ?? '0';
    this.getBalanceSheet(this.userId);
  }

  getBalanceSheet(userId: number) {
    this.spinner.show();
    this.balanceSheet = [];
    this.userId = userId;
    this.accountService.getBalanceSheet(userId).subscribe({
      next: response => {
        if (response.status) {
          this.isHomeClicked = userId > 0 ? true : false;
          const userName = this.backupBalanceSheet.find((item: any) => item.userId === userId)?.breadCrumb || '';
          this.balanceSheet = response.data;
          this.backupBalanceSheet = response.data;
          this.total = response.message;
          this.plusData = this.balanceSheet.filter((x: any) => x.type == "Plus").sort((a: any, b: any) => {
            const aIsZeroCondition = (a.Settlement === 0 || a.roleId === 0) ? 1 : 0;
            const bIsZeroCondition = (b.Settlement === 0 || b.roleId === 0) ? 1 : 0;

            if (aIsZeroCondition !== bIsZeroCondition) {
              return aIsZeroCondition - bIsZeroCondition;
            }
            return Math.abs(b.Settlement) - Math.abs(a.Settlement);
          });

          this.minusData = this.balanceSheet.filter((x: any) => x.type == "Minus").sort((a: any, b: any) => {
            const aIsZero = a.settlement === 0 || a.roleId === 0;
            const bIsZero = b.settlement === 0 || b.roleId === 0;

            const aIsZeroCondition = (a.Settlement === 0 || a.roleId === 0) ? 1 : 0;
            const bIsZeroCondition = (b.Settlement === 0 || b.roleId === 0) ? 1 : 0;

            if (aIsZeroCondition !== bIsZeroCondition) {
              return aIsZeroCondition - bIsZeroCondition;
            }

            return Math.abs(b.settlement) - Math.abs(a.settlement);
          });

          if (!this.breadcrumbs.some(bc => bc.userId === userId)) {
            this.breadcrumbs.push({ userId, userName });
          }
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  navigateToUser(userId: number) {
    this.getBalanceSheet(userId);
    this.breadcrumbs = this.breadcrumbs.slice(0, this.breadcrumbs.findIndex(bc => bc.userId === userId) + 1);
  }

  getSettlement(list: any, type: string) {
    
    this.type = type;
    this.Currency = list.currency == 1 ? "INR" : "PTS";
    this.remark = type == "Plus" ? "Withdraw Cash" : "Deposit Cash";
    this.backUpSettlement = list;
    this.selectedUserName = list.userName; // Assuming you want to concatenate the full name later
    this.selectedUserId = list.userId;
    this.selectedUserRole = list.role;

    // Ensure totalSettlement is a number and round it to 2 decimal places
    const totalSettlement = parseFloat(list.settlement);

    // Round to 2 decimal places and assign to settlementAmount and pendingSettlement
    this.settlementAmount = parseFloat(totalSettlement.toFixed(2));
    this.pendingSettlement = parseFloat(totalSettlement.toFixed(2));
    // let amnt = parseFloat(this.settlementAmount.toFixed(2));
    // if (this.settlementAmount < 0) {
    //   this.amount = -amnt;
    // } else {
    //   this.amount = amnt;
    // }
  }


  fullAmount() {
    if (typeof this.settlementAmount === 'number' && !isNaN(this.settlementAmount)) {
      let amnt = parseFloat(this.settlementAmount.toFixed(2));
      if (this.settlementAmount < 0) {
        this.amount = -amnt;
      } else {
        this.amount = amnt;
      }
      this.pendingSettlement = 0;
      this.isSettlementFull = true;
    } else {
      console.error("settlementAmount is not a valid number");
    }
  }

  remainingAmount() {
    this.isSettlementFull = false;
    this.settlementAmount = parseFloat(this.backUpSettlement.settlement.toFixed(2));
    if (this.settlementAmount < 0) {
      if (-this.amount > this.settlementAmount) {
        this.pendingSettlement = parseFloat((-this.settlementAmount - this.amount).toFixed(2));
        this.pendingSettlement = -this.pendingSettlement;
      } else {
        this.clearAmount();
      }
    } else {
      if (this.amount > this.settlementAmount) {
        this.clearAmount();
      } else {
        this.pendingSettlement = parseFloat((this.settlementAmount - this.amount).toFixed(2));
      }
    }
  }
  clearAmount() {
    this.amount = 0;
    this.settlementAmount = parseFloat(this.backUpSettlement.settlement.toFixed(2));
    this.pendingSettlement = parseFloat(this.backUpSettlement.settlement.toFixed(2));
  }

  settlement() {

    this.spinner.show();
    this.accountService.settlement(this.backUpSettlement.userId, this.amount, this.backUpSettlement.role, this.type, this.isSettlementFull, this.password).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, "Success");
          document.getElementById("clsStlmntMdl")?.click();
          document.getElementById("clsClearMdl")?.click();
          this.clearAmount();
          this.getBalanceSheet(this.userId);
        } else {
          this.toastr.error(response.message, "Failed");
        }
      }, error: (error: any) => {
        this.toastr.error("Enter Password", "Failed");
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  clearSettlement() {
    this.type="Clear"
    this.spinner.show();
    this.accountService.settlement(this.backUpSettlement.userId, this.amount, this.backUpSettlement.role, this.type, this.isSettlementFull, this.password).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, "Success");
          document.getElementById("clsStlmntMdl")?.click();
          document.getElementById("clsClearMdl")?.click();
          this.clearAmount();
          this.getBalanceSheet(this.userId);
        } else {
          this.toastr.error(response.message, "Failed");
        }
      }, error: (error: any) => {
        this.toastr.error("Enter Password", "Failed");
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  getUser(item: any) {

    this.selectedUserId = item.userId;
    this.selectedUser = item.userName;
    this.valueType = "Cash";
    const currentDate: Date = new Date();
    const oneWeekAgo: Date = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    this.startTime = this.formatDate(oneWeekAgo);
    this.endTime = this.formatDate(currentDate);
    this.getTransationHistory()
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const day = ('0' + date.getDate()).slice(-2);          // Ensure two digits for day
    return `${year}-${month}-${day}`;
  }

  getHistoryData(value: string) {

    this.valueType = value;
    this.pageNum = 1
    this.skipRecords = 0;
    this.takeRecords = 20;
    this.getTransationHistory()
  }

  //Page Chnage Funtion
  pageChanged(pageNo: any) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    this.getTransationHistory();
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
  }

  getTransationHistory() {

    const startTime = `${this.startTime.split('T')[0]} T00:00:00`; // 'YYYY-MM-DD 00:00:00'
    const endTime = `${this.endTime.split('T')[0]} T23:59:59`;
    this.spinner.show();
    this.returnObj = []
    this.accountService.getTransationHistory(this.selectedUserId, this.valueType, startTime, endTime, this.skipRecords, this.takeRecords).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.returnObj = response.data;
          this.Count = response.totalItems
        } else {
          this.returnObj = [];
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

}
