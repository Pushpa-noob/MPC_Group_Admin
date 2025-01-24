import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { forkJoin, of,Subscription, interval } from 'rxjs';




@Component({
  selector: 'app-risk-analysis',
  templateUrl: './risk-analysis.component.html',
  styleUrls: ['./risk-analysis.component.scss']
})
export class RiskAnalysisComponent implements OnInit {
  eventList: any = [];
  sportsIds: number[] = [4, 1, 2];
  apiUrl: string = '';
  thirdPartyData: any = [];
  activeIndex: number | null = null;
  bets: any = [];
  filteredEventList: any[] = [];
  riskToggle: boolean = true;
  parentId: number = 0;
  password: string = '';
  eventId: string = '';
  fancyList:any=[];
  private intervalId: any;
  i:number=0;
  setType:number=0;

  constructor(private dataService: DataService, private toastr: ToastrService, private authService: AuthService, private router: Router, private accountService: AccountService, private spinner: NgxSpinnerService) {
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.getEventList(0);
      //this.startInterval();

    } else {
      this.router.navigate(["/signin"]);
    }
  }

  startInterval() {
    if(this.setType==0){
      this.intervalId = setInterval(async () => {
        await this.getPendingBets();
        this.getEventList(0);
      }, 10000); // 10 seconds
    }
    
  }

  ngOnDestroy() {
    // Clear interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  

  setUpModal(eventId: string) {
    this.eventId = eventId;
    this.password = ''
  }

  blockUnblockEvent() {

    this.spinner.show();
    this.accountService.blockUnblockEvent(this.parentId, this.eventId, this.password).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById("clsCnfrmPass")?.click();
          this.getEventList(0);
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


  getEventList(type: number) {
      this.spinner.show();    
    this.accountService.getEventsForMarketRisk(type).subscribe({
      next: response => {
        if (response.status) {
          
          this.eventList = response.data;
          this.apiUrl = response.message;
          this.getRates();
          this.getPendingBets();
        }else{
          this.eventList=[];
        }

      },
      error: error => this.handleError(error),
      complete: () => this.spinner.hide()
    })
  }

  getRates() {
    let requests = [];
    this.thirdPartyData = [];
    requests = this.sportsIds.map(id =>
      this.dataService.fetchMarketRates(`${this.apiUrl}${id}`).pipe(
        catchError(error => {
          console.error(`Error fetching data for sports ID ${id}:`, error);
          return of({ message: "No events found for this sportsId" }); // Fallback to an empty object with no events message
        })
      )
    );
    forkJoin(requests).subscribe({
      next: responses => {
        responses.forEach(data => {
          if (data && !this.isNoEventsMessage(data)) {
            // Check if data is an array before using spread
            if (Array.isArray(data)) {
              this.thirdPartyData.push(...data);
            } else {
              // Handle case where data is not an array (push it directly)
              this.thirdPartyData.push(data);
            }
          }
        });
        this.fetchRatesAndMerge();
      },
      error: error => {
        console.error('Error fetching market data', error);
      }
    });
  }
  fetchRatesAndMerge() {
    this.eventList.forEach((list: any) => {
      list.list.forEach((event: any) => {
        const match = this.thirdPartyData.find((match: any) => match.EventId === event.betfairEventId);
        if (match) {
          event.fancy = match.fancyCount;
          // Ensure MatchOdds and runners are defined and have expected length
          if (match.MatchOdds && Array.isArray(match.MatchOdds.runners)) {
            if (match.MatchOdds.runners.length > 2) {
              // Ensure each runner and Back/Lay are defined
              event.runner1BackRate = match.MatchOdds.runners[0]?.Back?.Rate ?? null;
              event.runner2BackRate = match.MatchOdds.runners[1]?.Back?.Rate ?? null;
              event.runner3BackRate = match.MatchOdds.runners[2]?.Back?.Rate ?? null;
              event.runner1LayRate = match.MatchOdds.runners[0]?.Lay?.Rate ?? null;
              event.runner2LayRate = match.MatchOdds.runners[1]?.Lay?.Rate ?? null;
              event.runner3LayRate = match.MatchOdds.runners[2]?.Lay?.Rate ?? null;
            } else {
              event.runner1BackRate = match.MatchOdds.runners[0]?.Back?.Rate ?? null;
              event.runner2BackRate = match.MatchOdds.runners[1]?.Back?.Rate ?? null;
              event.runner1LayRate = match.MatchOdds.runners[0]?.Lay?.Rate ?? null;
              event.runner2LayRate = match.MatchOdds.runners[1]?.Lay?.Rate ?? null;
            }
          }
        }
      });
    });
  }

  isNoEventsMessage(data: any): boolean {
    return data.message && data.message === "No events found for this sportsId";
  }



 async getPendingBets() {
   await this.accountService.getAllPendingBets().subscribe({
      next: response => {

        if (response.status) {
          this.bets = response.data;
          this.calculateBook();
        }
      },
      error: error => this.handleError(error)
    });
  }


  

  checkIsBetExist(eventId: string): boolean {
    return this.bets.some((bet: any) => bet.eventId == eventId);
  }

  riskAnalysis(value: any) {
    this.riskToggle = value;
  }

  getBetsCount(eventId: string, marketName: string): number {
    return this.bets.filter((x: any) => x.marketName === marketName && x.eventId == eventId)?.length;
  }

  getFancyBetsCount(eventId: string, runnerName: string): number {
    return this.bets.filter((x: any) => x.runnerName === runnerName && x.eventId == eventId)?.length;
  }


  // calculateBook() {
  //   if (this.eventList.length > 0) {
  //     this.eventList.forEach((list: any) => {
  //       list.list.forEach((event: any) => {
  //         if(this.checkIsBetExist(event.betfairEventId)){
  //           event.runners.forEach((runners: any) => {
  //             let bets=this.bets.filter((x: any) => x.marketName === "Match Odds" && x.eventId == event.betfairEventId);

  //             bets.forEach((bets: any) => {
  //               if (bets.runnerId == runners.runnerId.toString()) {
  //                 if (bets.selection == "Back") {
  //                   runners.book = runners.book - ((bets.share) * bets.profit / 100);
  //                 } else {
  //                   runners.book = runners.book + ((bets.share) * bets.exposure / 100);

  //                 }
  //               } else {
  //                 if (bets.selection == "Back") {
  //                   runners.book = runners.book + ((bets.share) * bets.exposure / 100);
  //                 }
  //                 else {
  //                   runners.book = runners.book - ((bets.share) * bets.profit / 100);
  //                 }
  //               }
  //             });
  //           });
  //         }

  //       })
  //     })
  //   }
  // }


  getFancyBookObject(eventId:string) {
    if(this.bets.length>0){
      let bets = this.bets.filter((x: any) => x.marketName === 'Fancy' && x.eventId === eventId);

      let fancyList = bets.reduce((result: any[], bet: any) => {
        let existingGroup = result.find((item: any) => item.runnerName === bet.runnerName);
        
        if (!existingGroup) {           
          result.push({
            runnerName: bet.runnerName,
            book: this.getFancyPl(bet.runnerName,bet.odds,bet.eventId)
          });
        }

        return result;
      }, []);
      debugger;
     return fancyList;
        
    }
        
  }


 

  getFancyPl(runnerName: string, odds: number,eventId:string) {

   let sessonBookList:any = [];
    const fancyBets = this.bets.filter((x: any) =>
      x.runnerName.toLowerCase() === runnerName.toLowerCase() && x.eventId === eventId
    );

    if (fancyBets.length > 0) {
      let minOdds = Math.min(...fancyBets.map((x:any) => x.odds));
      if (odds == 0) {
        odds = minOdds;
      }
      const min = odds-5;
      const max = odds + 5;

      sessonBookList = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach((element:any) => {
        if (element.selection == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              sessonBookList[currentIndex].RunValue = index;
              sessonBookList[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            } else {
              sessonBookList[currentIndex].RunValue = index;
              sessonBookList[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.odds) {
              sessonBookList[currentIndex].RunValue = index;
              sessonBookList[currentIndex].Pl -= (element.share) * (element.profit) / 100;
            } else {
              sessonBookList[currentIndex].RunValue = index;
              sessonBookList[currentIndex].Pl += (element.share) * (element.exposure) / 100;
            }
          }
        }
      });
    }
    return sessonBookList;
  }

  calculateBook() {
    if (this.eventList.length > 0) {
      this.eventList.forEach((list: any) => {
        list.list.forEach((event: any) => {
          if (this.checkIsBetExist(event.betfairEventId)) {
            
            event.markets.forEach((market: any) => {

              market.runners.forEach((runners: any) => {

                let bets = this.bets.filter((x: any) => x.marketName === market.marketName && x.eventId == event.betfairEventId);

                bets.forEach((bets: any) => {
                  if (bets.runnerId == runners.runnerId.toString()) {
                    if (bets.selection == "Back") {
                      runners.book = runners.book - ((bets.share) * bets.profit / 100);
                    } else {
                      runners.book = runners.book + ((bets.share) * bets.exposure / 100);

                    }
                  } else {
                    if (bets.selection == "Back") {
                      runners.book = runners.book + ((bets.share) * bets.exposure / 100);
                    }
                    else {
                      runners.book = runners.book - ((bets.share) * bets.profit / 100);
                    }
                  }
                });
              });
            });

          }
          
        })
      })
    }
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
      //
    }
    this.spinner.hide();
  }

  checkIfAnyRunnerBookNotZero(runners: any[]): boolean {
    return runners.some(runner => runner.book !== 0);
  }




}
