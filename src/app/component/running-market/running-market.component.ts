import { Component, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subscription, Subject, Observable, pipe } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';






@Component({
  selector: 'app-running-market',
  templateUrl: './running-market.component.html',
  styleUrls: ['./running-market.component.scss']
})
export class RunningMarketComponent implements OnInit, OnDestroy {
  isHidden = false;
  isAddClass = false;
  private destroy$ = new Subject<void>();
  eventId = '';
  sportsId = 0;
  eventDetail: any;
  eventDetailBackup: any;
  sessionObj: any;
  token = "TmQxajE0aHR0cHM6Ly9zaGFrdGk5OS5jb20=";
  iframeScoreCardUrl?: SafeResourceUrl;
  iframeTvUrl?: SafeResourceUrl;
  live = false;
  fancySettings: any;
  providerId = 0;
  bets: any[] = [];
  deletedBets: any[] = [];
  betsBackUp: any[] = [];
  lowerLineBets: any[] = [];
  fullSharing: boolean = false;
  marketName: string = 'All';
  currentPosition: any = [];
  userId: number = 0;
  userIdForLowerLine: number = 0;
  private intervalId: any;
  isHighlighted = false;
  loader: boolean = false;
  selectAll: boolean = false;
  ids: any = [];
  startDate: string = "";
  endDate: string = "";
  activeIndex: number | null = null;
  runners: any = [];
  notifications: any = [];
  highlightedIndex: number | null = null;
  highlightedButtons: { [key: number]: boolean } = {};
  sessonBookList: any = [];
  isShown: boolean = true;
  activeTab: string = 'liveScore';
  tvBaseUrl = "https://tv.fstlive.video/?eventid=";

  constructor(
    private toastr: ToastrService,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        this.sportsId = parseInt(params['sportsId'], 10);
        this.eventId = params['eventId'];

        // Start chaining the method calls
        return this.getEventDetail(this.eventId).pipe(
          switchMap(() => this.getPendingBets(this.userId)),
          switchMap(() => this.startInterval()),
          switchMap(() => this.getNotifications()),
          switchMap(() => this.liveScore())
        );
      })
    ).subscribe();
  }
  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
  ngAfterViewInit() {
    $(".tvVolume").click(function () {
      $(".fa-volume-mute, .fa-volume-up").toggleClass("fa-volume-mute fa-volume-up");
    });
  }

  refreshClick(marketName: string, marketIndex: number) {
    this.highlightedButtons[marketIndex] = true;
    this.userId = 0;
    this.getCurrentPosition(marketName, this.userId);

    // Remove the highlight after 1 second
    setTimeout(() => {
      this.highlightedButtons[marketIndex] = false;
    }, 1000);
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'innerSportsBook');
    this.destroy$.next();
    this.destroy$.complete();
    this.clearInterval();
  }

  toggleElement(): void {
    this.isHidden = !this.isHidden;
  }

  toggleClass(): void {
    this.isAddClass = !this.isAddClass;
  }

  toggleTab(tabName: string) {
    if (this.activeTab === tabName) {
      this.activeTab = '';  // Close the tab if it's already open
    } else {
      this.activeTab = tabName;  // Open the clicked tab
    }
  }

  private initializeData() {
    this.getEventDetail(this.eventId);
  }

  private startInterval(): Observable<any> {
    return of(setInterval(() => {
      this.getPendingBets(this.userId).subscribe(); // Subscribe to the observable here
    }, 5000));
  }


  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getNotifications(): Observable<any> {
    return of(setTimeout(() => {
      this.sharedService.notifications$.subscribe((notifications) => {
        this.notifications = notifications.filter((x: any) => x.type == 2);
      });
    }, 3000));
  }






  private getPendingBets(userId: number): Observable<any> {
    return this.accountService.getEventPendingBets(this.eventId, userId).pipe(
      tap(response => {
        if (response.status) {
          this.betsBackUp = response.data;
          this.betsBackUp.forEach(bet => bet.checked = false);
        } else {
          this.bets = [];
          this.betsBackUp = [];
        }
        this.calculateBook();
      }),
      catchError(error => {
        this.handleError(error);
        return of(null); // Return an empty observable to keep the flow
      })
    );
  }


  private getPendingBetsForLowerLine(userId: number): Observable<any> {
    // Return the observable so it can be chained
    return this.accountService.getEventPendingBets(this.eventId, userId).pipe(
      tap(response => {

        if (response.status) {
          this.lowerLineBets = response.data;
        } else {
          this.lowerLineBets = [];
        }
        this.calculateBookForLowerLine();  // Perform calculations when data is available
      }),
      catchError(error => {
        this.handleError(error);   // Handle the error
        return of(null);           // Return an observable so that the chain continues
      })
    );
  }



  private getEventDetail(eventId: string): Observable<any> {
    this.spinner.show(); // Keep the spinner here if needed
    return this.accountService.getEventDeatil(eventId).pipe(
      takeUntil(this.destroy$),
      tap({
        next: response => this.processEventDetailResponse(response), // Process the response here
        error: error => this.handleError(error) // Handle the error
      }),
      finalize(() => this.spinner.hide())
    );
  }


  private processEventDetailResponse(response: any) {
    if (response.status) {
      this.eventDetail = response.eventDetail;
      this.eventDetailBackup = JSON.parse(JSON.stringify(response.eventDetail));
      this.runners = response.eventDetail.markets[0].runners;
      this.fancySettings = this.eventDetail.markets.find((x: any) => x.marketName === 'Fancy');
      this.providerId = response.providerId;
      this.calculateBook();
      this.getMarketRatesDataFromOliver();
    }
  }

  private getMarketRatesDataFromOliver() {
    this.dataService.fetchCompleteEventDetail(this.eventId, 2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.updateOliverMarketData(data));
  }

  private updateOliverMarketData(data: any) {
    if (data !== null) {
      if (this.sportsId == 4) {
        if (data.Fancy?.runners && data.Fancy.runners.length > 0) {
          this.sessionObj = data.Fancy.runners;
        } else {
          setTimeout(() => {
            if (!data.Fancy?.runners || data.Fancy.runners.length === 0) {
              this.sessionObj = [];
            }
          }, 2000);
        }

        // Always check and update fancyMarket if it exists
        const fancyMarket = this.eventDetail.markets.find((x: any) => x.marketName === "Fancy");
        if (fancyMarket) {
          fancyMarket.runners = data.Fancy?.runners || fancyMarket.runners; // Keep existing runners if empty
        }
      }


      this.updateOliverRunners(data);
    }
  }

  private updateOliverRunners(data: any) {
    this.eventDetail.markets.forEach((market: any) => {
      market.runners.forEach((runner: any) => this.updateRunnerRates(market, runner, data));
    });
    if (this.sportsId == 4) {
      const bookMarket = this.eventDetail.markets.filter((x: any) => x.marketName.toLowerCase() === "bookmaker");
      if (bookMarket) {
        const allBackPrices = data.BookMaker.runners.map((r: any) => parseFloat(r.Back.Rate)).filter((Rate: any) => Rate > 0);
        const allLayPrices = data.BookMaker.runners.map((r: any) => parseFloat(r.Lay.Rate)).filter((Rate: any) => Rate > 0);

        // If all runners have non-zero BackPrice1 and LayPrice1
        if (allBackPrices.length > 1 && allLayPrices.length > 1) {

          const lowestBackPrice = Math.min(...allBackPrices);
          const lowestLayPrice = Math.min(...allLayPrices);

          // Update prices for the found runner based on the lowest values
          bookMarket[0].runners.forEach((r: any) => {
            r.rates.back.Rate = (parseFloat(r.rates.back.Rate) === lowestBackPrice) ? lowestBackPrice.toString() : 0;
            r.rates.lay.Rate = (parseFloat(r.rates.lay.Rate) === lowestLayPrice) ? lowestLayPrice.toString() : 0;
          });
        }
      }
    }


  }

  // private updateRunnerRates(market: any, runner: any, data: any) {
  //   let foundRunner: any;
  //   switch (market.marketName.toLowerCase()) {
  //     case "match odds":
  //       foundRunner = data.MatchOdds?.runners.find((r: any) => r.RunnerName === runner.runnerName);
  //       break;
  //     case "bookmaker":
  //       foundRunner = data.BookMaker?.runners.find((r: any) => r.RunnerName === runner.runnerName);

  //       break;
  //     case "to win the toss":
  //       const difference = this.getHourDifference(this.eventDetail?.eventTime);
  //       difference > 1 ? this.initializeTossMarket(market) : this.removeTossMarket();
  //       return;
  //     default:
  //       foundRunner = null;
  //   }

  //   if (!runner.rates) {
  //     runner.rates = {};
  //   }


  //   if (foundRunner) {
  //     runner.rates.back = foundRunner.Back || null;
  //     runner.rates.lay = foundRunner.Lay || null;
  //   }

  // }

  private updateRunnerRates(market: any, runner: any, data: any) {
    let foundRunner: any=null;
    switch (market.marketName.toLowerCase()) {
      case "match odds":
        foundRunner = data.MatchOdds?.runners.find((r: any) => r.RunnerName === runner.runnerName);
        break;
      case "bookmaker":
        foundRunner = data.BookMaker?.runners.find((r: any) => r.RunnerName === runner.runnerName);
        break;
      case "to win the toss":
        const difference = this.getHourDifference(this.eventDetail?.eventTime);
        difference > 1 ? this.initializeTossMarket(market) : this.removeTossMarket();
        return;
      default:
        this.initializeTossMarket(market);
    }

    if (!runner.rates) {
      runner.rates = {};
    }

    if (foundRunner) {
      // Detect change in back rates
      if (runner.rates.back?.Rate !== foundRunner.Back?.Rate) {
        runner.backChanged = true;  // Add flag for blinking
        setTimeout(() => runner.backChanged = false, 1000);  // Remove after 1 second
      }

      // Detect change in lay rates
      if (runner.rates.lay?.Rate !== foundRunner.Lay?.Rate) {
        runner.layChanged = true;  // Add flag for blinking
        setTimeout(() => runner.layChanged = false, 1000);  // Remove after 1 second
      }

      runner.rates.back = foundRunner.Back || null;
      runner.rates.lay = foundRunner.Lay || null;
    }
  }


  private removeTossMarket() {
    const tossMarketIndex = this.eventDetail.markets.findIndex((m: any) => m.marketName.toLowerCase() === "to win the toss");
    if (tossMarketIndex !== -1) {
      this.eventDetail.markets.splice(tossMarketIndex, 1);
    }
  }

  private getHourDifference(givenDateTimeString: string): number {
    const givenDate = new Date(givenDateTimeString);
    const currentDate = new Date();
    return (givenDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
  }

  private initializeTossMarket(market: any) {
    market.runners.forEach((runner: any) => {
      if (!runner.rates) {
        runner.rates = {};
      }
      runner.rates.back = { Rate: "1.98", Price: "100" };
      runner.rates.lay = { Rate: "0", Price: "0" };
    });
  }


  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }



  getCurrentPosition(marketName: string, userId: number) {
    this.loader = true;
    this.currentPosition = [];
    this.marketName = marketName;
    //this.userId = userId;

    // Call getPendingBetsForLowerLine and chain it with getCurrentPosition
    this.getPendingBetsForLowerLine(userId).pipe(
      // Once the lower line bets are processed, call accountService.getCurrentPosition
      switchMap(() => this.accountService.getCurrentPosition(this.eventId, marketName, userId, this.fullSharing))
    )
      .subscribe({
        next: (response: any) => {
          if (response.status) {

            this.currentPosition = response.data;

            const market = this.eventDetailBackup.markets.find((m: any) =>
              m.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase()
            );

            let marketBookList: any[] = [];

            market.runners.forEach((runner: any) => {
              let marketBookDTO = {
                runnerId: runner.runnerId.toString(),
                profitLoss: this.currentPosition.flat()
                  .filter((x: any) => x.runnerId === runner.runnerId.toString())
                  .reduce((acc: number, curr: any) => acc + curr.profitLoss, 0),
                userName: "User P&L",
                orderBy: 6,
                role: "",
                userId: 0,
                totalSum: 0
              };
              marketBookList.push(marketBookDTO);
            });

            // Sort currentPosition after pushing
            this.currentPosition.push(marketBookList);
            this.currentPosition.sort((a: any[], b: any[]) => {
              const aOrder = a[0]?.orderBy || 0;
              const bOrder = b[0]?.orderBy || 0;

              if (aOrder === 5) return -1; // 5 at the top
              if (bOrder === 5) return 1;
              if (aOrder === 6) return -1; // 6 in second place
              if (bOrder === 6) return 1;
              return aOrder - bOrder;      // natural ordering for others
            });
          }
        },
        complete: () => {
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.handleError(error);
        }
      });
  }




  reinitializeBooks() {
    if (this.eventDetail && this.betsBackUp.length > 0) {
      const marketsToReset = this.eventDetail.markets.map((m: any) => m.marketName);//["Match Odds", "BookMaker", "To Win the Toss"];

      marketsToReset.forEach((marketName:any) => {
        const market = this.eventDetail.markets.find((m: any) => m.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase());
        if (market) {
          market.runners.forEach((runner: any) => {
            runner.book = 0;
          });
        }
      });
    }
  }

  reinitializeLowerLineBooks() {
    if (this.eventDetailBackup && this.lowerLineBets.length > 0) {
      const marketsToReset = this.eventDetail.markets.map((m: any) => m.marketName);//["Match Odds", "BookMaker", "To Win the Toss"];

      marketsToReset.forEach((marketName:any) => {
        const market = this.eventDetailBackup.markets.find((m: any) => m.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase());
        if (market) {
          market.runners.forEach((runner: any) => {
            runner.book = 0;
          });
        }
      });
    }
  }

  sharingToggle(sharing: boolean) {
    this.fullSharing = sharing;
    this.calculateBook();
    document.getElementById('clsBook')?.click();
    this.getCurrentPosition(this.marketName, this.userId);
  }

  calculateBook() {
    // Check if eventDetail and betsBackUp are available
    if (this.eventDetail && this.betsBackUp.length > 0) {
      // Reinitialize books if required
      this.reinitializeBooks();

      const marketsToReset = this.eventDetail.markets.map((m: any) => m.marketName);//["Match Odds", "BookMaker", "To Win the Toss"];


      // Loop over each market
      marketsToReset.forEach((marketName:any) => {
        const market = this.eventDetail.markets.find((m: any) =>
          m.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase()
        );
        if (!market) return;

        // Filter bets for the current market
        const bets = this.betsBackUp.filter((bet: any) =>
          bet.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase()
        );
        if (bets.length === 0) return;

        // Loop over each runner in the market
        market.runners.forEach((runner: any) => {
          const runnerId = runner.runnerId.toString();

          // Loop over each bet
          bets.forEach((bet: any) => {
            const isMatchingRunner = bet.runnerId === runnerId;
            const shareFactor = bet.share / 100;
            let adjustment: number;

            // Determine adjustment based on bet selection
            if (bet.selection === "Back") {
              adjustment = isMatchingRunner
                ? -(shareFactor * bet.profit)
                : +(shareFactor * bet.exposure);
            } else {
              adjustment = isMatchingRunner
                ? +(shareFactor * bet.exposure)
                : -(shareFactor * bet.profit);
            }

            // Update the runner's book with the calculated adjustment
            runner.book += this.fullSharing ? (adjustment / shareFactor) : adjustment;
          });
        });
      });
    }
  }

  calculateBookForLowerLine() {
    // Check if eventDetailBackup and lowerLineBets are available
    if (this.eventDetailBackup && this.lowerLineBets.length > 0) {
      // Reinitialize lower line books
      this.reinitializeLowerLineBooks();

      const mNames = ["Match Odds", "BookMaker", "To Win The Toss"];

      // Loop over each market
      mNames.forEach(marketName => {
        const mrkt = this.eventDetailBackup.markets.find((m: any) =>
          m.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase()
        );
        if (!mrkt) return;

        // Filter lower line bets for the current market
        const bets = this.lowerLineBets.filter((bet: any) =>
          bet.marketName.toLocaleLowerCase() === marketName.toLocaleLowerCase()
        );
        if (bets.length === 0) return;

        // Loop over each runner in the market
        mrkt.runners.forEach((runner: any) => {
          const runnerId = runner.runnerId.toString();

          // Loop over each bet
          bets.forEach((bet: any) => {
            const isMatchingRunner = bet.runnerId === runnerId;
            const shareFactor = bet.share / 100;
            let adjustment: number;

            // Determine adjustment based on bet selection
            if (bet.selection === "Back") {
              adjustment = isMatchingRunner
                ? -(shareFactor * bet.profit)
                : +(shareFactor * bet.exposure);
            } else {
              adjustment = isMatchingRunner
                ? +(shareFactor * bet.exposure)
                : -(shareFactor * bet.profit);
            }
            runner.book += this.fullSharing ? (adjustment / shareFactor) : adjustment;
          });
        });
      });
    }
    return true;
  }


  getFilteredBets(marketName: string, selection: string, runnerId?: string) {
    this.bets = [];
    this.marketName = marketName;
    // Convert inputs to lowercase for case-insensitive comparison
    const lowerCaseMarketName = marketName.toLowerCase();
    const lowerCaseSelection = selection.toLowerCase();
    const lowerCaseRunnerId = runnerId ? runnerId.toLowerCase() : '';

    // Filter bets based on provided parameters
    this.bets = this.betsBackUp.filter((x: any) => {
      const matchesMarketName = x.marketName.toLowerCase() === lowerCaseMarketName;
      const matchesSelection = selection === 'All' || x.selection.toLowerCase() === lowerCaseSelection;
      const matchesRunnerId = !runnerId || x.runnerId.toLowerCase() === lowerCaseRunnerId;

      return matchesMarketName && matchesSelection && matchesRunnerId;
    });
  }

  getAllBets() {
    this.bets = this.betsBackUp;
  }

  filterBets(marketName: string) {
    if(marketName=="All"){
      this.marketName==marketName;
      this.bets = this.betsBackUp;
    }else{
      this.marketName = marketName;
      this.bets = this.betsBackUp.filter(x => x.marketName.toLowerCase() == marketName.toLowerCase());
    }
    
  }

  filterSelectionBets(selection: string) {
      this.bets = this.betsBackUp.filter(x => x.selection.toLowerCase() == selection.toLowerCase());  
  }

  getCount(selection:string):number{
    return this.betsBackUp.filter(x => x.selection.toLowerCase() == selection.toLowerCase())?.length; 
  }

  getMarketBetsCount(marketName: string):number {
    if(marketName=="All"){
      return this.betsBackUp?.length;
    }else{
      return this.betsBackUp.filter(x => x.marketName.toLowerCase() == marketName.toLowerCase())?.length;
    }
    
  }

  getBetsCount(marketName: string, selection: string): number {
    if (selection === "All") {
      return this.betsBackUp.filter((x: any) => x.marketName === marketName).length;
    } else {
      return this.betsBackUp.filter((x: any) => x.selection.toLowerCase() === selection.toLowerCase() && x.marketName === marketName).length;
    }
  }

  getFancyBetsCount(marketName: string, selection: string, runnerId: string) {
    if (selection === "All") {
      return this.betsBackUp.filter((x: any) => x.marketName === marketName && x.runnerId.toLowerCase() === runnerId.toLowerCase()).length;
    } else {
      return this.betsBackUp.filter((x: any) => x.selection.toLowerCase() === selection.toLowerCase() && x.marketName === marketName && x.runnerId.toLowerCase() === runnerId.toLowerCase()).length;
    }
  }

  liveScore(): Observable<any> {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://nxbet247.com/live-score-card/${this.sportsId}/${this.eventId}`
    );
    this.iframeScoreCardUrl = safeUrl;

    return of(this.iframeScoreCardUrl).pipe(
      tap(() => this.live = true)
    );
  }


  liveTV() {
    //if(this.eventDetail.isLive==1 && this.eventDetail.state=="Resume" && this.eventDetail.channel!=="0"){
    this.iframeTvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.tvBaseUrl + this.eventId
    );
    this.live = true;
    // }
  }

  toggleAllCheckboxes() {
    this.bets.forEach(bet => {
      bet.checked = this.selectAll;
      if (this.selectAll) {
        if (!this.ids.includes(bet.id)) {
          this.ids.push(bet.id);
        }
      } else {
        this.ids = [];
      }
    });

  }

  toggleLiveScore() {
    this.isShown = !this.isShown;  // Toggle the value of isShown
  }

  onCheckboxChange(bet: any) {
    if (bet.checked) {
      if (!this.ids.includes(bet.id)) {
        this.ids.push(bet.id);
      }
    } else {
      this.ids = this.ids.filter((id: any) => id !== bet.id);
    }
    this.checkIfAllSelected();
  }

  checkIfAllSelected() {

    this.selectAll = this.bets.every(bet => bet.checked);
    if (this.selectAll) {
      this.ids = this.bets.map(bet => bet.id);
    }
  }

  deleteBets() {
    this.spinner.show();
    this.accountService.deleteBets(this.ids).subscribe({
      next: response => {
        if (response.status) {
          this.bets = this.betsBackUp.filter(bet => !this.ids.includes(bet.id));
          this.toastr.success(response.message, 'Success');
        } else {
          this.toastr.error(response.message, 'Error');
        }
      }, error: error => {
        this.handleError(error);
      }, complete: () => {
        this.spinner.hide();
      }
    })
  }

  getDeleteBets(marketName: string) {

    this.deletedBets = [];
    this.spinner.show();
    this.accountService.getDeletedBets(this.eventId).subscribe({
      next: response => {
        if (response.status) {
          this.deletedBets = response.data.filter((X: any) => X.marketName.toLowerCase() == marketName.toLocaleLowerCase());
        }
      }, error: error => {
        this.handleError(error);
      }, complete: () => {
        this.spinner.hide();
      }
    });
  }

  filterBetsByDateRange(): void {
    if (!this.startDate || !this.endDate) {
      return; // Do nothing if either date is not set
    }
    this.bets = [];
    const startDateTime = this.convertToIST(new Date(this.startDate));
    startDateTime.setSeconds(0);

    const endDateTime = this.convertToIST(new Date(this.endDate));
    endDateTime.setSeconds(59);

    this.bets = this.betsBackUp.filter(bet => {
      const createdOn = new Date(bet.createdOn);
      return createdOn >= startDateTime && createdOn <= endDateTime;
    });
  }

  // Helper method to convert a Date object to IST
  private convertToIST(date: Date): Date {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
    return new Date(utcTime + istOffset);
  }

  resetDates(): void {
    this.startDate = '';
    this.endDate = '';
    this.bets = this.betsBackUp;
  }

  isSuspended(runner: any, market: any): boolean {
    if (market.marketSettings.isFancyLock) {
      return true;
    }
    if (!runner || (typeof runner === 'object' && Object.keys(runner).length === 0)) {
      return true;
    }
    if (runner.runnerStatus === true) {
      return true;
    }
    if (!runner.rates || (typeof runner.rates === 'object' && Object.keys(runner.rates).length === 0)) {
      return true;
    }
    if(market.isLocked){
      return true;
    }
    if (typeof runner.rates === 'object') {
      if (market.marketName == "Match Odds") {
        if (runner.rates?.back?.Rate === 0 && runner.rates?.lay?.Rate === 0) {
          return true;
        }
      } else {
        if (runner.rates?.back?.Rate === 0 || runner.rates?.lay?.Rate === 0) {
          return true;
        }
      }
    }
    return false;
  }

  isSessionSuspended(Session: any): boolean {
    if (this.fancySettings.marketSettings.isFancyLock) {
      return true;
    }
    if (Session.Status === true) {
      return true;
    } if (Session.Back?.Rate === 0 && Session.Lay?.Rate === 0) {
      return true;
    }
    return false;
  }
  

  fancyBook(runnerName: string, odds: number) {

    this.sessonBookList = [];
    const fancyBets = this.betsBackUp.filter((x: any) =>
      x.runnerName.toLowerCase() === runnerName.toLowerCase() && x.eventId === this.eventId
    );

    if (fancyBets.length > 0) {
      let minOdds = Math.min(...fancyBets.map(x => x.odds));
      if (odds == 0) {
        odds = minOdds;
      }
      const min = odds - 10;
      const max = odds + 5;

      this.sessonBookList = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach(element => {
        if (element.selection == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            }
          }
        }
      });
    }
    return this.sessonBookList;
  }

  getSessionPl(runnerName: string, odds: number): number {

    let sessionPl: any = [];
    const fancyBets = this.betsBackUp.filter((x: any) =>
      x.runnerName.toLowerCase() === runnerName.toLowerCase() && x.eventId === this.eventId
    );
    if (fancyBets.length > 0) {
      let minOdds = Math.min(...fancyBets.map(x => x.odds));
      if (odds == 0) {
        odds = minOdds;
      }
      const min = minOdds - 15;
      const max = odds + 15;

      sessionPl = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach((element: any) => {
        if (element.selection == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              sessionPl[currentIndex].RunValue = index;
              sessionPl[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            } else {
              sessionPl[currentIndex].RunValue = index;
              sessionPl[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              sessionPl[currentIndex].RunValue = index;
              sessionPl[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            } else {
              sessionPl[currentIndex].RunValue = index;
              sessionPl[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            }
          }
        }
      });
      const data = sessionPl.find((x: any) => x.Pl !== 0);
      return data ? data.Pl : 0;
    }
    return 0;
  }

}


