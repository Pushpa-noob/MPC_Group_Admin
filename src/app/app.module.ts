import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/layout/header/header.component';
import { SidebarComponent } from './component/layout/sidebar/sidebar.component';
import { BaseService } from './services/base.service';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SigninComponent } from './component/signin/signin.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { WinnerLoserComponent } from './component/winner-loser/winner-loser.component';
import { EditUserComponent } from './component/edit-user/edit-user.component';
import { RiskAnalysisComponent } from './component/risk-analysis/risk-analysis.component';
import { RunningMarketComponent } from './component/running-market/running-market.component';
import { BalanceSheetComponent } from './component/balance-sheet/balance-sheet.component';
import { OpenMarketComponent } from './component/open-market/open-market.component';
import { DepositeRequestComponent } from './component/deposite-request/deposite-request.component';
import { AcceptDepositRequestComponent } from './component/accept-deposit-request/accept-deposit-request.component';
import { PendingWithdrawComponent } from './component/pending-withdraw/pending-withdraw.component';
import { AcceptWithdrawRequestComponent } from './component/accept-withdraw-request/accept-withdraw-request.component';
import { BankingMethodComponent } from './component/banking-method/banking-method.component';
import { ManageBankingComponent } from './component/manage-banking/manage-banking.component';
import { TournamentListComponent } from './component/tournament-list/tournament-list.component';
import { AddEventComponent } from './component/add-event/add-event.component';
import { CreateMatchesComponent } from './component/create-matches/create-matches.component';
import { MatchListComponent } from './component/match-list/match-list.component';
import { ResultFancyComponent } from './component/result-fancy/result-fancy.component';
import { ResultMarketComponent } from './component/result-market/result-market.component';
import { RollbackFancyComponent } from './component/rollback-fancy/rollback-fancy.component';
import { RollbackMatchComponent } from './component/rollback-match/rollback-match.component';
import { SportsComponent } from './component/sports/sports.component';
import { NotificationsComponent } from './component/notifications/notifications.component';
import { LogoComponent } from './component/logo/logo.component';
import { KeyboardSettingsComponent } from './component/keyboard-settings/keyboard-settings.component';
import { BannerUploadComponent } from './component/banner-upload/banner-upload.component';
import { ApiSettingsComponent } from './component/api-settings/api-settings.component';
import { ContactDetailComponent } from './component/contact-detail/contact-detail.component';
import { BlockMarketComponent } from './component/block-market/block-market.component';
import { UnblockMarketComponent } from './component/unblock-market/unblock-market.component';
import { EventWisePlComponent } from './component/event-wise-pl/event-wise-pl.component';
import { OpenCheatbetComponent } from './component/open-cheatbet/open-cheatbet.component';
import { ClientBethistoryComponent } from './component/client-bethistory/client-bethistory.component';
import { AccountStatementComponent } from './component/account-statement/account-statement.component';
import { UserWisePlComponent } from './component/user-wise-pl/user-wise-pl.component';
import { MarketWisePlComponent } from './component/market-wise-pl/market-wise-pl.component';
import { BetFailedReasonComponent } from './component/bet-failed-reason/bet-failed-reason.component';
import { MarketWiseStakeComponent } from './component/market-wise-stake/market-wise-stake.component';
import { RequestLogComponent } from './component/request-log/request-log.component';
import { CashStatementComponent } from './component/cash-statement/cash-statement.component';
import { OpenBetsComponent } from './component/open-bets/open-bets.component';
import { BalancesheetHistoryComponent } from './component/balancesheet-history/balancesheet-history.component';
import { AccountStatementHistoryComponent } from './component/account-statement-history/account-statement-history.component';
import { UserWisePlHistoryComponent } from './component/user-wise-pl-history/user-wise-pl-history.component';
import { MarketPlHistoryComponent } from './component/market-pl-history/market-pl-history.component';
import { CashStatementHistoryComponent } from './component/cash-statement-history/cash-statement-history.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { BasicSettingsComponent } from './component/basic-settings/basic-settings.component';
import { ActiveClientsComponent } from './component/active-clients/active-clients.component';
import { LoggedinClientsComponent } from './component/loggedin-clients/loggedin-clients.component';
import { CasinoComponent } from './component/casino/casino.component';
import { ProfitLossReportComponent } from './component/profit-loss-report/profit-loss-report.component';
import { ClientBidsComponent } from './component/client-bids/client-bids.component';
import { NgChartsModule } from 'ng2-charts';
import { OddEvenComponent } from './component/odd-even/odd-even.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent, 
    AppComponent, 
    DashboardComponent,
    SigninComponent,
    UserListComponent,
    WinnerLoserComponent,
    EditUserComponent,
    RiskAnalysisComponent,
    RunningMarketComponent,
    BalanceSheetComponent,
    OpenMarketComponent,
    DepositeRequestComponent,
    AcceptDepositRequestComponent,
    PendingWithdrawComponent,
    AcceptWithdrawRequestComponent,
    BankingMethodComponent,
    ManageBankingComponent,
    TournamentListComponent,
    AddEventComponent,
    CreateMatchesComponent,
    MatchListComponent,
    ResultFancyComponent,
    ResultMarketComponent,
    RollbackFancyComponent,
    RollbackMatchComponent,
    SportsComponent,
    NotificationsComponent,
    LogoComponent,
    KeyboardSettingsComponent,
    BannerUploadComponent,
    ApiSettingsComponent,
    ContactDetailComponent,
    BlockMarketComponent,
    UnblockMarketComponent,
    EventWisePlComponent,
    OpenCheatbetComponent,
    ClientBethistoryComponent,
    AccountStatementComponent,
    UserWisePlComponent,
    MarketWisePlComponent,
    BetFailedReasonComponent,
    MarketWiseStakeComponent,
    RequestLogComponent,
    CashStatementComponent,
    OpenBetsComponent,
    BalancesheetHistoryComponent,
    AccountStatementHistoryComponent,
    UserWisePlHistoryComponent,
    MarketPlHistoryComponent,
    CashStatementHistoryComponent,
    AddUserComponent,
    BasicSettingsComponent,
    ActiveClientsComponent,
    LoggedinClientsComponent,
    CasinoComponent,
    ProfitLossReportComponent,
    ClientBidsComponent,
    OddEvenComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ColorPickerModule,
    // ToastrModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      easing: 'ease-in',
      tapToDismiss: true,
      // disableTimeOut: true,
      // toastClass:'cstmToastr',
      // disableTimeOut: false
    }),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    NgxPaginationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    NgChartsModule
    // AdminRoutingModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },BaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
