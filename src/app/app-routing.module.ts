import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './component/signin/signin.component';

import { DashboardComponent } from './component/dashboard/dashboard.component';
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
import { AuthGuard } from './services/auth-gaurd.service';
import { AddUserComponent } from './component/add-user/add-user.component';
import { BasicSettingsComponent } from './component/basic-settings/basic-settings.component';
import { ActiveClientsComponent } from './component/active-clients/active-clients.component';
import { LoggedinClientsComponent } from './component/loggedin-clients/loggedin-clients.component';
import { CasinoComponent } from './component/casino/casino.component';
import { ProfitLossReportComponent } from './component/profit-loss-report/profit-loss-report.component';
import { ClientBidsComponent } from './component/client-bids/client-bids.component';
import { OddEvenComponent } from './component/odd-even/odd-even.component';










const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'user_list', component: UserListComponent,canActivate: [AuthGuard] },
  { path: 'winner_loser', component: WinnerLoserComponent,canActivate: [AuthGuard] },
  { path: 'add_user', component: EditUserComponent,canActivate: [AuthGuard] },
  { path: 'risk_analysis', component: RiskAnalysisComponent,canActivate: [AuthGuard] },
  { path: 'running_market/:sportsId/:eventId', component: RunningMarketComponent,canActivate: [AuthGuard] },
  { path: 'balance_sheet', component: BalanceSheetComponent,canActivate: [AuthGuard] },
  { path: 'open_market', component: OpenMarketComponent ,canActivate: [AuthGuard]},
  { path: 'deposit_request', component: DepositeRequestComponent ,canActivate: [AuthGuard]},
  { path: 'accept_deposit_request', component: AcceptDepositRequestComponent ,canActivate: [AuthGuard]},
  { path: 'pending_withdraw', component: PendingWithdrawComponent,canActivate: [AuthGuard] },
  { path: 'accept_withdraw_request', component: AcceptWithdrawRequestComponent,canActivate: [AuthGuard] },
  { path: 'banking_method', component: BankingMethodComponent,canActivate: [AuthGuard] },
  { path: 'manage_banking', component: ManageBankingComponent,canActivate: [AuthGuard] },
  { path: 'tournament_list', component: TournamentListComponent,canActivate: [AuthGuard] },
  { path: 'add_event', component: AddEventComponent,canActivate: [AuthGuard] },
  { path: 'create_matches', component: CreateMatchesComponent,canActivate: [AuthGuard] },
  { path: 'match_list/:sportsId/:seriesId/:name', component: MatchListComponent,canActivate: [AuthGuard] },
  { path: 'result_fancy', component: ResultFancyComponent,canActivate: [AuthGuard] },
  { path: 'result_market', component: ResultMarketComponent,canActivate: [AuthGuard] },
  { path: 'rollback_fancy', component: RollbackFancyComponent,canActivate: [AuthGuard] },
  { path: 'rollback_match', component: RollbackMatchComponent,canActivate: [AuthGuard] },
  { path: 'sports', component: SportsComponent,canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent,canActivate: [AuthGuard] },
  // { path: 'logo_upload', component: LogoComponent,canActivate: [AuthGuard] },
  { path: 'keyboard_settings', component: KeyboardSettingsComponent,canActivate: [AuthGuard] },
  { path: 'banner_upload', component: BannerUploadComponent,canActivate: [AuthGuard] },
  { path: 'api_settings', component: ApiSettingsComponent,canActivate: [AuthGuard] },
  { path: 'contact_details', component: ContactDetailComponent,canActivate: [AuthGuard] },
  { path: 'block_market', component: BlockMarketComponent,canActivate: [AuthGuard] },
  { path: 'unblock_market', component: UnblockMarketComponent,canActivate: [AuthGuard] },

  { path: 'event_wise_pl', component: EventWisePlComponent,canActivate: [AuthGuard] },
  { path: 'cheatbet_report', component: OpenCheatbetComponent,canActivate: [AuthGuard] },
  { path: 'client_bet_history', component: ClientBethistoryComponent,canActivate: [AuthGuard] },
  { path: 'account_statement', component: AccountStatementComponent,canActivate: [AuthGuard] },
  { path: 'user_pl_report', component: UserWisePlComponent,canActivate: [AuthGuard] },
  { path: 'market_pl_report', component: MarketWisePlComponent,canActivate: [AuthGuard] },
  { path: 'bet_failed_reason', component: BetFailedReasonComponent,canActivate: [AuthGuard] },
  { path: 'market_wise_stack', component: MarketWiseStakeComponent,canActivate: [AuthGuard] },
  { path: 'request_log', component: RequestLogComponent,canActivate: [AuthGuard] },
  { path: 'cash_statement', component: CashStatementComponent,canActivate: [AuthGuard] },
  { path: 'open_bets', component: OpenBetsComponent,canActivate: [AuthGuard] },
  { path: 'balance_sheet_history', component: BalancesheetHistoryComponent,canActivate: [AuthGuard] },
  { path: 'account_statement_report', component: AccountStatementHistoryComponent,canActivate: [AuthGuard] },
  { path: 'user_pl_report_history', component: UserWisePlHistoryComponent,canActivate: [AuthGuard] },
  { path: 'market_pl_report_history', component: MarketPlHistoryComponent,canActivate: [AuthGuard] },
  { path: 'cash_statement_report', component: CashStatementHistoryComponent,canActivate: [AuthGuard] },
  { path: 'basic_settings', component: BasicSettingsComponent,canActivate: [AuthGuard] },

  { path: 'active_clients', component: ActiveClientsComponent,canActivate: [AuthGuard] },
  { path: 'loggedin_clients', component: LoggedinClientsComponent,canActivate: [AuthGuard] },
  { path: 'casino', component: CasinoComponent },
  { path: 'profit_loss_report', component: ProfitLossReportComponent,canActivate: [AuthGuard] },
  { path: 'edit_user', component: AddUserComponent,canActivate: [AuthGuard] },
  {path: 'client_bids', component: ClientBidsComponent,canActivate:[AuthGuard]},
  {path: 'odd_even', component: OddEvenComponent,canActivate:[AuthGuard]}
  
  // {
  //   path: 'admin', loadChildren: () => import('./admin.module')
  //     .then(mod => mod.AdminModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
