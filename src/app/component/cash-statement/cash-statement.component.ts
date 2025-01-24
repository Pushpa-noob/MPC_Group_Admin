import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-cash-statement',
  templateUrl: './cash-statement.component.html',
  styleUrls: ['./cash-statement.component.scss']
})
export class CashStatementComponent {
  filterType: string = '';
  startTime: string = '';
  parentId: number = 0;
  endTime: string = '';
  skipRecords: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 10;
  transObj: any = [];
  getRoleId:number=0
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
    const role = localStorage.getItem('roleId');
    this.getRoleId = role !== null ? parseInt(role, 10) : 0;
    this.setFilter('user');
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
    this.getStatement();
  }

  updateRecValue(event: any) {
    const data = parseInt(event.target.value, 10);
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = data;
    this.getStatement();
  }

  setFilter(type: string) {
    
    this.filterType = type;
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = 50;
  }

  getStatement() {
    if (this.startTime != "" || this.endTime != "") {
      this.spinner.show();
      const startTime = `${this.startTime.split('T')[0]}T00:00:00`; // 'YYYY-MM-DD 00:00:00'
      const endTime = `${this.endTime.split('T')[0]}T23:59:59`;
      this.accountService.getCashStatement(this.parentId, this.filterType, this.skipRecords, this.takeRecords, startTime, endTime).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.transObj = response.data;
            this.Count = response.totalItems;
          }
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.toastr.error("Please select both start time and end time", "Failed")
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
