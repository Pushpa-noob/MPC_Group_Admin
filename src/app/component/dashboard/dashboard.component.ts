import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChartConfiguration } from 'chart.js';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showDiv: boolean = false;
  details: any = [];
 
  getRoleId: number = 0;
 
  startTime: string = '';
  endTime: string = '';
  isCardVisible: boolean = false;
  isSelected = false;
  public barChartLegend = true;
  i: number = 0;
  public barChartPlugins = [];
  audio = new Audio('assets/success.mp3');
  transactionDetail: any = [];
  private intervalId: any;
  blink:boolean=false;
  private routerSubscription: Subscription | undefined;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Deposit',
        backgroundColor: 'green',
        hoverBackgroundColor: 'green',
      },
      {
        data: [],
        label: 'Withdraw',
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
      },
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(private toastr: ToastrService, private router: Router, private authService: AuthService, private accountService: AccountService, private spinner: NgxSpinnerService) {
    
    const role = localStorage.getItem('roleId');
    this.getRoleId = role !== null ? parseInt(role, 10) : 0;
  }

  ngOnInit(): void {
    this.setDashboardDates('today');
    this.intervalId = setInterval(() => {
      this.selectButton(new MouseEvent('click'));
    }, 30000);

    // Listen to route changes to clear the interval when navigating away
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clearInterval();
      }
    });
  }

  ngOnDestroy() {
    this.clearInterval();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  toggleShow() {
    this.showDiv = !this.showDiv;
  }
  selectButton(event: MouseEvent) {
    this.isSelected = true;
    setTimeout(() => {
      this.isSelected = false;
    }, 1000);
    this.getDashBoardDetails('1_hour_ago');
  }


  setDashboardDates(option: string): void {
    switch (option) {
      case '1_hour_ago':
        this.isCardVisible = false;
        this.startTime = this.getOneHourAgo();
        this.endTime = this.formatDate(new Date()); // Current time
        break;

      case 'today':
        this.isCardVisible = false;
        this.startTime = this.getToday(); // Start of today
        this.endTime = this.formatDate(new Date()); // Current time
        break;

      case 'yesterday':
        this.isCardVisible = false;
        this.startTime = this.getYesterday(); // Start of yesterday
        const yesterdayEnd = new Date();
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999); // End of yesterday
        this.endTime = this.formatDate(yesterdayEnd);
        break;

      case 'one_week_ago':
        this.isCardVisible = false;
        this.startTime = this.getOneWeekAgo(); // One week ago
        this.endTime = this.formatDate(new Date()); // Current time
        break;

      default:
        this.isCardVisible = true;
    }
    this.getDashBoardDetails(option);
  }

  onDateRangeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.setDashboardDates(selectedValue);
}
  getOneHourAgo(): string {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    return this.formatDate(oneHourAgo);
  }

  getToday(): string {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return this.formatDate(todayStart);
  }

  getYesterday(): string {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    return this.formatDate(yesterdayStart);
  }

  getOneWeekAgo(): string {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.formatDate(oneWeekAgo);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  onStartTimeChange(newValue: string) {
    this.startTime = newValue;
  }


  onEndTimeChange(newValue: string) {
    this.endTime = newValue;
  }

  private handleError(error: any) {

    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }

  getDashBoardDetails(option: string) {
    if (this.i == 0) {
      this.spinner.show();
    }
    let startTime = "";
    let endTime = "";
    if (option != '1_hour_ago') {
      startTime = `${this.startTime.split('T')[0]} T00:00:00`; 
      endTime = `${this.endTime.split('T')[0]} T23:59:59`;
    } else {
      startTime = this.startTime;
      endTime = this.endTime;
    }

    this.accountService.getDashBoardDetails(startTime, endTime).subscribe({
      next: (response: any) => {
        this.i++;
        if (response.status) {
          this.details = response.data;
          this.transactionDetail = response.data.transactionObject;
          if (this.transactionDetail != null) {
            if (this.transactionDetail.deposit.pending > 0 || this.transactionDetail.withdrawal.pending > 0) {
              this.playNotificationSound();
              this.blink=true;
              setTimeout(() => {
                this.blink=false;
              }, 2000);
            }
          }
          let fullWeek = this.details.fullWeekTransactions;
          if (Array.isArray(fullWeek) && fullWeek.length > 0) {

            const date = fullWeek.map((item: any) => {
              const date = new Date(item.date);
              if (isNaN(date.getTime())) {
                return '';
              }
              return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            });
            

            let deposit = this.barChartData.datasets[0].data = fullWeek.map((item: any) => {
              const deposit = parseFloat(item.totalDeposit);
              return isNaN(deposit) ? 0 : deposit;
            });

            let withdrawal = this.barChartData.datasets[1].data = fullWeek.map((item: any) => {
              const withdraw = parseFloat(item.totalWithdraw); // Get the absolute value
              return isNaN(withdraw) ? 0 : withdraw;
            });

            this.barChartData = {
              labels: date,
              datasets: [
                {
                  data: deposit,
                  label: 'Deposit',
                  backgroundColor: 'green',
                  hoverBackgroundColor: 'green'
                },
                {
                  data: withdrawal.map(value => Math.abs(value)),
                  label: 'Withdraw',
                  backgroundColor: 'red',
                  hoverBackgroundColor: 'red'
                },
              ]
            };


          }
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

  playNotificationSound() {
    this.audio.currentTime = 0; // Reset the audio to start
    this.audio.play().catch((error) => {
      console.error('Audio play error:', error);
    });
  }
}
