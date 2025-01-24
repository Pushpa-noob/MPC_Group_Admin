// auth.service.ts

import { Injectable, numberAttribute } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { data } from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class AccountService {

    private getDashBoardDetailsUrl = environment.apiBaseUrl + "Dashboard/getDashBoardDetails";
    private addUserUrl = environment.apiBaseUrl + "User/createUser";
    private changePassUrl = environment.apiBaseUrl + "User/changePassowrd";
    private getUserByParentIdUrl = environment.apiBaseUrl + "User/getUsersByParentId";
    private getParentDetailsUrl = environment.apiBaseUrl + "User/getParentDetails";
    private blockMultipleUserUrl = environment.apiBaseUrl + "User/blockMultipleUser";
    private unblockMultipleUserUrl = environment.apiBaseUrl + "User/unblockMultipleUser";
    private getRoleToUpdateLevelUrl = environment.apiBaseUrl + "User/GetRoleToUpdateLevel";
    private updateUserRoleUrl = environment.apiBaseUrl + "User/UpdateUserRole";
    private createEventsFromCommonPortalUrl = environment.apiBaseUrl + "Event/createEventsFromCommonPortal";
    private getAllTournamentUrl = environment.apiBaseUrl + "Tournament/getAllTournamentSettings";
    private updateUserTournamentSettingsUrl = environment.apiBaseUrl + "Tournament/updateUserTournamentSetting";
    private updateTournamentUrl = environment.apiBaseUrl + "Tournament/updateTournament";
    private deleteTournamentUrl = environment.apiBaseUrl + "Tournament/deleteTournament";
    private getAllSportsSettingsUrl = environment.apiBaseUrl + "Sports/getAllSportsSettings";
    private updateSportsSettingsUrl = environment.apiBaseUrl + "Sports/updateSportsSettings";
    private getUsersSportsStatusUrl = environment.apiBaseUrl + "Sports/getUsersSportsStatus";
    private getUsersEventStatusUrl = environment.apiBaseUrl + "Event/getUsersEventStatus";
    private getUserMarketStatusUrl = environment.apiBaseUrl + "MarketSetting/getUserMarketStatus";
    private CheckUserTournamentStatusUrl = environment.apiBaseUrl + "Tournament/CheckUserTournamentStatus";
    private blockUnblockSportsUrl = environment.apiBaseUrl + "Sports/blockUnblockSports";
    private blockUnblockTournamentUrl = environment.apiBaseUrl + "Tournament/blockUnblockTournament";
    private blockUnblockEventUrl = environment.apiBaseUrl + "Event/blockUnblockEvent";
    private blockUnblockMarketUrl = environment.apiBaseUrl + "MarketSetting/blockUnblockMarket";

    private getBankingMethodsUrl = environment.apiBaseUrl + "BankingMethods/getBankingMethods";
    private uploadFileUrl = environment.apiBaseUrl + "FileUpload/UploadFile";
    private addBankingMethodUrl = environment.apiBaseUrl + "BankingMethods/addBankingMethod";
    private updateBankingMethodUrl = environment.apiBaseUrl + "BankingMethods/updateBankingMethodStatus?id=";
    private deleteBankingMethodUrl = environment.apiBaseUrl + "BankingMethods/deleteBankingMethod?id=";
    private addBankingDetailUrl = environment.apiBaseUrl + "BankingMethodDetails/addBankingDetail";
    private updateBankingDetailUrl = environment.apiBaseUrl + "BankingMethodDetails/updateBankingDetail";
    private getBankingDetailsUrl = environment.apiBaseUrl + "BankingMethodDetails/getBankingDetails";
    private getUserShareUrl = environment.apiBaseUrl + "Share/getUserShare";
    private updateUserShareUrl = environment.apiBaseUrl + "Share/updateUserShare";
    private getUserProfileByIdUrl = environment.apiBaseUrl + "User/getUserProfileById";
    private addBalanceUrl = environment.apiBaseUrl + "Wallet/addOwnBalance";
    private resetUserPasswordUrl = environment.apiBaseUrl + "User/resetUserPassword";
    private getSeriesListUrl = environment.apiBaseUrl + "Event/getSeriesList";
    private getEventListUrl = environment.apiBaseUrl + "Event/getEventListDiamond";
    private saveEventUrl = environment.apiBaseUrl + "Event/saveEvent";
    private saveAllTournamentEventUrl = environment.apiBaseUrl + "Event/saveAllTournamentEvent";
    private getEventsHistoryUrl = environment.apiBaseUrl + "Event/getEventsHistory";



    private getCountForPendingRequestsUrl = environment.apiBaseUrl + "Deposit/getCountForPendingRequests";
    private getDepositRequestsByDomainIdUrl = environment.apiBaseUrl + "Deposit/getDepositRequestsByDomainId?transactionType=";
    private getWithdrawalRequestsByDomainIdUrl = environment.apiBaseUrl + "Withdrawal/getWithdrawalRequestsByDomainId?transactionType=";
    private updateDepositRequestUrl = environment.apiBaseUrl + "Deposit/updateDepositRequest";
    private updateWithdrawalRequestUrl = environment.apiBaseUrl + "Withdrawal/updateWithdrawalRequest";
    private updateImagePathUrl = environment.apiBaseUrl + "Withdrawal/updateImagePath?id=";
    private getDepositRequestsForPdfUrl = environment.apiBaseUrl + "Deposit/getDepositRequestsByDomainIdForGeneratingPDF?transactionType=";
    private getWithdrawalRequestsForPdfUrl = environment.apiBaseUrl + "Withdrawal/getWithdrawalRequestsByDomainIdForGeneratingPDF?transactionType=";
    private addBasicSettingsUrl = environment.apiBaseUrl + "BasicSetting/addBasicSettings";
    private getBasicSettingsUrl = environment.apiBaseUrl + "BasicSetting/getBasicSettings";
    private updateBasicSettingsUrl = environment.apiBaseUrl + "BasicSetting/updateBasicSettings";
    private addBannersUrl = environment.apiBaseUrl + "Banner/addBanner";
    private updateBannersUrl = environment.apiBaseUrl + "Banner/updateBanner";
    private deleteBannersUrl = environment.apiBaseUrl + "Banner/deleteBanner?bannerId=";
    
    private getBannersUrl = environment.apiBaseUrl + "Banner/getBanner";
    private addNotificationUrl = environment.apiBaseUrl + "Notification/addNotification";
    private updateNotificationUrl = environment.apiBaseUrl + "Notification/updateNotification";
    private getNotificationUrl = environment.apiBaseUrl + "Notification/getNotifications";
    private deleteNotificationUrl = environment.apiBaseUrl + "Notification/deleteNotification?id=";
    private addChipsUrl = environment.apiBaseUrl + "KeyBoardChips/addChips";
    private updateChipsUrl = environment.apiBaseUrl + "KeyBoardChips/updateChips";
    private getChipsUrl = environment.apiBaseUrl + "KeyBoardChips/getChips";
    private deleteChipsUrl = environment.apiBaseUrl + "KeyBoardChips/deleteChips?id=";
    private manualDepositUrl = environment.apiBaseUrl + "Wallet/manualDeposit";
    private manualWithdrawUrl = environment.apiBaseUrl + "Wallet/manualWithdraw";
    private getTransationHistoryUrl = environment.apiBaseUrl + "Transaction/getTransationHistory";
    private getAllTransationHistoryUrl = environment.apiBaseUrl + "Transaction/getAllTransationHistory";
    private userSettingsUrl = environment.apiBaseUrl + "User/userSettings";
    private WalletUrl = environment.apiBaseUrl + "Wallet/getBalance";
    private getHeaderNotificationsUrl = environment.apiBaseUrl + "Notification/getNewsPerDomain";
    private searchUserUrl = environment.apiBaseUrl + "User/searchUser";
    private getUserSportsUrl = environment.apiBaseUrl + "Sports/getUserSports";
    private updateUserSettingUrl = environment.apiBaseUrl + "Sports/updateUserSetting";
    private getUserTournamentSettingsUrl = environment.apiBaseUrl + "Tournament/getUserTournamentSettings";
    private getOpenMarketsUrl = environment.apiBaseUrl + "MarketSetting/getOpenMarkets";
    private searchOpenMarketsUrl = environment.apiBaseUrl + "MarketSetting/searchOpenMarkets";
    private getAllSportsUrl = environment.apiBaseUrl + "Sports/getAllSports";
    private getTournamentsUrl = environment.apiBaseUrl + "Tournament/getTournaments";
    private getActiveEventsUrl = environment.apiBaseUrl + "Event/getActiveEvents";
    private getMarketsUrl = environment.apiBaseUrl + "MarketSetting/getMarkets";
    private updateMultipleOpenMarketUrl = environment.apiBaseUrl + "MarketSetting/updateOpenMarketStatus"
    private getCashStatementUrl = environment.apiBaseUrl + "Transaction/getCashStatement"
    private getEventsForMarketRiskUrl = environment.apiBaseUrl + "Event/getEventsForUpperLine?type=";
    private getEventDeatilUrl = environment.apiBaseUrl + "Event/getEventDetails?eventId=";
    private getEventPendingBetsUrl = environment.apiBaseUrl + "UserBid/getEventPendingBetsForUpperline?eventId=";
    private getAllPendingBetsUrl = environment.apiBaseUrl + "UserBid/getAllPendingBetsForUpperline";
    private deleteBetsUrl = environment.apiBaseUrl + "UserBid/deleteBets";
    private getDeletedBetsUrl = environment.apiBaseUrl + "UserBid/getDeletedBets?eventId=";
    private getCurrentPositionUrl = environment.apiBaseUrl + "UserBid/getMarketCurrentPosition?eventId=";
    private getPendingBetsUrl = environment.apiBaseUrl + "UserBid/getPendingBets"
    private getAllBetsHistoryUrl = environment.apiBaseUrl + "UserBid/getAllBetsHistory"
    private getEventBetHistoryForUserUrl = environment.apiBaseUrl + "UserBid/getAllBetsHistory"
    private getOverAllPandLUrl = environment.apiBaseUrl + "UserBid/getOverAllPL?userId=";
    private getOddEvenUrl = environment.apiBaseUrl + "Event/getEventsForOddEven";
    private addOddEvenMarketUrl = environment.apiBaseUrl + "Event/addOddEvenMarket?eventId=";
    private updateOddEvenMarketUrl = environment.apiBaseUrl + "Event/updateOddEvenMarket?id=";

    private getUserBetHistoyUrl = environment.apiBaseUrl + "UserBid/getUserBetHistoy"
    private getEventsListUrl = environment.apiBaseUrl + "UserBid/getEventsList"
    private getMarketListUrl = environment.apiBaseUrl + "UserBid/getMarketList"
    private getDeletedBetEventsUrl = environment.apiBaseUrl + "UserBid/getDeletedBetEvents"
    private getDeletedBetHistoryUrl = environment.apiBaseUrl + "UserBid/getDeletedBetHistory"
    private getFancyEventsUrl = environment.apiBaseUrl + "Result/getFancyEvents"
    private getFancyListForResultUrl = environment.apiBaseUrl + "Result/getFancyListForResult"
    private fancyResultUrl = environment.apiBaseUrl + "Result/fancyResult"
    private matchResultUrl = environment.apiBaseUrl + "Result/matchResult"
    private getEventsUrl = environment.apiBaseUrl + "Result/getEvents"
    private getEventFancyHistoryUrl = environment.apiBaseUrl + "Result/getEventFancyHistory"
    private getFancytHistoryByEventIdUrl = environment.apiBaseUrl + "Result/getFancytHistoryByEventId"
    private getEventPLHistoryUrl = environment.apiBaseUrl + "Transaction/getEventWisePL"
    private getUserIdsUrl = environment.apiBaseUrl + "Transaction/getUserIds";

    private getMarketBetsUrl = environment.apiBaseUrl + "UserBid/getMarketBetsForUpperline?eventId=";

    private getCategoriesUrl = environment.apiBaseUrl + "Casino/getCategoriesForParent";
    private getSubCategoriesUrl = environment.apiBaseUrl + "Casino/getSubCategoriesForParent?catId=";
    private getGamesUrl = environment.apiBaseUrl + "Casino/getGames?catId=";
    private blockCasinoProviderUrl = environment.apiBaseUrl + "Casino/blockCasinoProvider?providerId=";
    private blockCasinoSubCategoryUrl = environment.apiBaseUrl + "Casino/blockCasinoCategory?categoryId=";
    private blockCasinoGameUrl = environment.apiBaseUrl + "Casino/blockCasinoGames?code=";
    private getMarketSettingsUrl = environment.apiBaseUrl + "MarketSetting/getMarketSettings?eventId=";
    private updateMarketSettingsUrl = environment.apiBaseUrl + "MarketSetting/updateMarketSettings";
    private getDomainsUrl = environment.apiBaseUrl + "User/getInActiveDomains";
    private addDomainUrl = environment.apiBaseUrl + "User/addDomain";
    private updateUserUrl = environment.apiBaseUrl + "User/updateUser";
    private addApiUrl = environment.apiBaseUrl + "ThirdPartyApiUrls/addUrls";
    private updateApiUrl = environment.apiBaseUrl + "ThirdPartyApiUrls/updateUrls";
    private getApiUrl = environment.apiBaseUrl + "ThirdPartyApiUrls/getThirdPartyUrls";
    private getMarketPLUrl = environment.apiBaseUrl + "Transaction/getMarketPL";
    private getMarketWiseStakeUrl = environment.apiBaseUrl + "Transaction/getMarketWiseStake";
    private finduserUrl = environment.apiBaseUrl + "User/finduser";
    private getEventWiseBetHistoryUrl = environment.apiBaseUrl + "UserBid/getEventWiseBetHistory";
    private getUserWisePLUrl = environment.apiBaseUrl + "Transaction/getUserWisePL";
    private getBalanceSheetUrl = environment.apiBaseUrl + "Wallet/getSettlementDetails?userId="

    private getTopPlayersUrl = environment.apiBaseUrl + "Dashboard/getTopPlayers";
    private loggedInUserUrl = environment.apiBaseUrl + "User/loggedInUser";
    private getAllCategoriesUrl = environment.apiBaseUrl + "Casino/getAllCategories";
    private getAllSubCategoriesUrl = environment.apiBaseUrl + "Casino/getAllSubCategories";
    private getAllGamesByCatIdUrl = environment.apiBaseUrl + "Casino/getAllGamesByCatId";
    private blockCasinoProviderByUserIdUrl = environment.apiBaseUrl + "Casino/blockCasinoProviderByUserId?providerId=";
    private blockCasinoSubCategoryByUserIdUrl = environment.apiBaseUrl + "Casino/blockCasinoCategoryByUserId?categoryId=";
    private blockCasinoGameByUserIdUrl = environment.apiBaseUrl + "Casino/blockCasinoGamesByUserId?code=";
    private getMarketHistoryByMarketNameUrl = environment.apiBaseUrl + "Result/getMarketHistoryByMarketName";
    private abandonedFancyUrl = environment.apiBaseUrl + "Result/abandonedFancy";
    private deleteMarketUrl = environment.apiBaseUrl + "Result/deleteMarket";
    private abandonedMarketUrl = environment.apiBaseUrl + "Result/abandonedMarket";
    private rollbackFancyUrl = environment.apiBaseUrl + "Result/rollbackFancy";
    private rollbackMatchResultUrl = environment.apiBaseUrl + "Result/rollbackMatchResult";
    private getClientAllPendingBetsUrl = environment.apiBaseUrl + "UserBid/getClientAllPendingBets";
    private getUsersPLReportUrl = environment.apiBaseUrl + "Transaction/getUsersPLReport";
    private settlementUrl = environment.apiBaseUrl + "Wallet/settlement?userId=";

    private maintainSettingUrl = environment.apiBaseUrl + "HomePage/setUnSetWebsiteUnderMaintenance?userId=";
    private updateCasinoSettingsUrl =environment.apiBaseUrl +"Casino/updateSettings";
    private updateBonusUrl=environment.apiBaseUrl + "Wallet/updateBonus";
    private deletePendingEventUrl=environment.apiBaseUrl + "Event/deletePendingEvent";

    constructor(private baseService: BaseService, private httpClient: HttpClient) { }

    deletePendingEvent(): Observable<any> {
        return this.baseService.get(this.deletePendingEventUrl);
    }

    getEventsHistory(tournamentId: string): Observable<any> {
        return this.baseService.get(this.getEventsHistoryUrl + "?tournamentId=" + tournamentId);
    }

    getDashBoardDetails(startDate: string, endDate: string): Observable<any> {
        return this.baseService.get(this.getDashBoardDetailsUrl + "?sDate=" + startDate + "&eDate=" + endDate);
    }
    addUser(userForm: any): Observable<any> {
        return this.baseService.post(this.addUserUrl, userForm);
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.baseService.get(this.changePassUrl + "?currentPassword=" + currentPassword + "&newPassword=" + newPassword);
    }

    getUserByParentId(parentId: number, isLocked: boolean, searchKeyword: string, skipRecords: number, takeRecords: number): Observable<any> {
        return this.baseService.get(this.getUserByParentIdUrl + "?parentId=" + parentId + "&isLocked=" + isLocked + "&searchKeyword=" + searchKeyword + "&skipRecords=" + skipRecords + "&takeRecords=" + takeRecords);
    }

    getParentDetails(parentId: number): Observable<any> {
        return this.baseService.get(this.getParentDetailsUrl + "?parentId=" + parentId);
    }

    blockMultipleUser(userId: number[]): Observable<any> {
        return this.baseService.post(this.blockMultipleUserUrl, userId);
    }

    unblockMultipleUser(userId: number[]): Observable<any> {
        return this.baseService.post(this.unblockMultipleUserUrl, userId);
    }

    getRoleToUpdateLevel(userId: number): Observable<any> {
        return this.baseService.get(this.getRoleToUpdateLevelUrl + "?userId=" + userId);
    }

    updateUserRole(userId: number, selectedUserId: number): Observable<any> {
        return this.baseService.get(this.updateUserRoleUrl + "?userId=" + userId + "&roleId=" + selectedUserId);
    }

    createEventsFromCommonPortal(): Observable<any> {
        return this.baseService.get(this.createEventsFromCommonPortalUrl);
    }

    getAllTournament(sportsId: number): Observable<any> {
        return this.baseService.get(this.getAllTournamentUrl + "?sportsId=" + sportsId);
    }

    updateTournament(data: any): Observable<any> {
        return this.baseService.post(this.updateTournamentUrl, data);
    }

    getAllSportsSetting(userId: number): Observable<any> {
        return this.baseService.get(this.getAllSportsSettingsUrl + "?userId=" + userId);
    }

    updateSportsSetting(data: any): Observable<any> {
        return this.baseService.post(this.updateSportsSettingsUrl, data);
    }

    deleteTournament(id: string): Observable<any> {
        return this.baseService.get(this.deleteTournamentUrl + "?tournamentId=" + id);
    }

    getUsersSportsStatus(selectedUserId: number): Observable<any> {
        return this.baseService.get(this.getUsersSportsStatusUrl + "?userId=" + selectedUserId);
    }

    getUsersEventStatus(selectedUserId: number, seriesId: string): Observable<any> {
        return this.baseService.get(this.getUsersEventStatusUrl + "?userId=" + selectedUserId + "&seriesId=" + seriesId);
    }

    getUserMarketStatus(selectedUserId: number, eventId: string): Observable<any> {
        return this.baseService.get(this.getUserMarketStatusUrl + "?eventId=" + eventId + "&userId=" + selectedUserId);
    }

    CheckUserTournamentStatus(selectedUserId: number, sportsId: number): Observable<any> {
        return this.baseService.get(this.CheckUserTournamentStatusUrl + "?sportsId=" + sportsId + "&userId=" + selectedUserId);
    }

    blockUnblockSports(selectedUserId: number, sportsId: number, password: string): Observable<any> {
        return this.baseService.get(this.blockUnblockSportsUrl + "?userId=" + selectedUserId + "&sportsId=" + sportsId + "&password=" + password);
    }

    blockUnblockTournament(seriesId: string, selectedUserId: number, password: string): Observable<any> {

        return this.baseService.get(this.blockUnblockTournamentUrl + "?userId=" + selectedUserId + "&seriesId=" + seriesId + "&password=" + password);
    }

    blockUnblockEvent(selectedUserId: number, eventId: string, password: string): Observable<any> {
        return this.baseService.get(this.blockUnblockEventUrl + "?userId=" + selectedUserId + "&eventId=" + eventId + "&password=" + password);
    }

    blockUnblockMarket(selectedUserId: number, marketId: string, eventId: string, marketName: string, password: string): Observable<any> {
        return this.baseService.get(this.blockUnblockMarketUrl + "?userId=" + selectedUserId + "&marketId=" + marketId + "&eventId=" + eventId + "&marketName=" + marketName + "&password=" + password);
    }

    getBankingMethods(): Observable<any> {
        return this.baseService.get(this.getBankingMethodsUrl);
    }
    uploadFile(file: File, fileType: string): Observable<any> {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('FileType', fileType);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        });
        return this.httpClient.post(this.uploadFileUrl, formData, { headers: headers });
    }

    addBankingMethod(bankMethodForm: any): Observable<any> {
        return this.baseService.post(this.addBankingMethodUrl, bankMethodForm);
    }
    updateBankingMethod(id: any, isLocked: boolean): Observable<any> {
        return this.baseService.get(this.updateBankingMethodUrl + id + "&status=" + isLocked);
    }
    deleteBankingMethod(id: any): Observable<any> {
        return this.baseService.get(this.deleteBankingMethodUrl + id);
    }

    addBankingDetails(bankDetailForm: any): Observable<any> {
        return this.baseService.post(this.addBankingDetailUrl, bankDetailForm);
    }

    getBanksWithDetail(): Observable<any> {
        return this.baseService.get(this.getBankingDetailsUrl);
    }

    getUserShare(userId: number): Observable<any> {
        return this.baseService.get(this.getUserShareUrl + "?userId=" + userId)
    }

    updateUserShare(userId: number, sportsShare: number, casinoShare: number): Observable<any> {
        return this.baseService.get(this.updateUserShareUrl + "?userId=" + userId + "&sportsShare=" + sportsShare + "&casinoShare=" + casinoShare)
    }

    getUserProfileById(userId: number): Observable<any> {
        return this.baseService.get(this.getUserProfileByIdUrl + "?userId=" + userId)
    }

    addOwnBalance(userId: number, amount: number): Observable<any> {
        return this.baseService.get(this.addBalanceUrl + "?userId=" + userId + "&amount=" + amount)
    }

    resetUserPassword(userId: number, password: string): Observable<any> {
        return this.baseService.get(this.resetUserPasswordUrl + "?userId=" + userId + "&password=" + password)
    }

    getSeriesList(sportsId: number): Observable<any> {
        return this.baseService.get(this.getSeriesListUrl + "?betfairSportsId=" + sportsId)
    }

    getEventList(sportsId: number, seriesId: string): Observable<any> {
        return this.baseService.get(this.getEventListUrl + "?betfairSportsId=" + sportsId + "&seriesId=" + seriesId)
    }

    addEvent(data: any): Observable<any> {
        return this.baseService.post(this.saveEventUrl, data)
    }

    saveAllTournamentMatches(sportsId: number, seriesId: string): Observable<any> {
        return this.baseService.get(this.saveAllTournamentEventUrl + "?betfairSportsId=" + sportsId + "&tournamentId=" + seriesId)
    }
    updateBankingDetails(bankDetailForm: any): Observable<any> {
        return this.baseService.post(this.updateBankingDetailUrl, bankDetailForm);
    }

    getCountForPendingRequests(): Observable<any> {
        return this.baseService.get(this.getCountForPendingRequestsUrl);
    }
    getDepositRequestsByDomainId(transactionType: number, skipRecords: number, itemsPerPage: number, startDate: any, endDate: any, utrNumber: string): Observable<any> {
        return this.baseService.get(this.getDepositRequestsByDomainIdUrl + transactionType + "&skipRecords=" + skipRecords + "&takeRecords=" + itemsPerPage + "&startDate=" + startDate + "&endDate=" + endDate + "&utrNumber=" + utrNumber);
    }

    getWithdrawalRequestsByDomainId(transactionType: number, skipRecords: number, itemsPerPage: number, startDate: any, endDate: any, utrNumber: string): Observable<any> {
        return this.baseService.get(this.getWithdrawalRequestsByDomainIdUrl + transactionType + "&skipRecords=" + skipRecords + "&takeRecords=" + itemsPerPage + "&startDate=" + startDate + "&endDate=" + endDate + "&utrNumber=" + utrNumber);
    }

    updateDepositRequest(depositForm: any): Observable<any> {
        return this.baseService.post(this.updateDepositRequestUrl, depositForm);
    }

    updateWithdrawalRequest(withrawalForm: any): Observable<any> {
        return this.baseService.post(this.updateWithdrawalRequestUrl, withrawalForm);
    }

    uploadImage(id: number, imagePath: string): Observable<any> {
        return this.baseService.get(this.updateImagePathUrl + id + "&imagePath=" + imagePath);
    }

    getDepositRequestsForPdf(transactionType: number, startDate: any, endDate: any, utrNumber: string): Observable<any> {
        return this.baseService.get(this.getDepositRequestsForPdfUrl + transactionType + "&startDate=" + startDate + "&endDate=" + endDate + "&utrNumber=" + utrNumber);
    }

    getWithdrawalRequestsForPdf(transactionType: number, startDate: any, endDate: any, utrNumber: string): Observable<any> {
        return this.baseService.get(this.getWithdrawalRequestsForPdfUrl + transactionType + "&startDate=" + startDate + "&endDate=" + endDate + "&utrNumber=" + utrNumber);
    }

    addBasicSettings(basicSettingsForm: any) {
        return this.baseService.post(this.addBasicSettingsUrl, basicSettingsForm);
    }

    getBasicSettings() {
        return this.baseService.get(this.getBasicSettingsUrl);
    }

    updateBasicSettings(basicSettingsForm: any) {
        return this.baseService.post(this.updateBasicSettingsUrl, basicSettingsForm);
    }

    addBanners(bannerForm: any) {
        return this.baseService.post(this.addBannersUrl, bannerForm);
    }

    getBanners() {
        return this.baseService.get(this.getBannersUrl);
    }

    updateBanners(bannerForm: any) {
        return this.baseService.post(this.updateBannersUrl, bannerForm);
    }
    deleteBanners(bannerId: number) {
        debugger;
        return this.baseService.get(this.deleteBannersUrl + bannerId);
    }

    addNotifications(notificationForm: any) {
        return this.baseService.post(this.addNotificationUrl, notificationForm);
    }

    getNotifications() {
        return this.baseService.get(this.getNotificationUrl);
    }

    updateNotifications(notificationForm: any) {
        return this.baseService.post(this.updateNotificationUrl, notificationForm);
    }

    deleteNotifications(id: number) {
        return this.baseService.get(this.deleteNotificationUrl + id);
    }

    addChips(chipsForm: any) {
        return this.baseService.post(this.addChipsUrl, chipsForm);
    }

    getChips() {
        return this.baseService.get(this.getChipsUrl);
    }

    updateChips(chipsForm: any) {
        return this.baseService.post(this.updateChipsUrl, chipsForm);
    }

    deleteChips(id: number) {
        return this.baseService.get(this.deleteChipsUrl + id);
    }

    manualDeposit(userId: number, password: string, amount: number): Observable<any> {
        return this.baseService.get(this.manualDepositUrl + "?userId=" + userId + "&password=" + password + "&amount=" + amount);
    }
    manualWithdraw(userId: number, password: string, amount: number): Observable<any> {
        return this.baseService.get(this.manualWithdrawUrl + "?userId=" + userId + "&password=" + password + "&amount=" + amount);
    }
    getTransationHistory(userId: number, type: string, startTime: string, endTime: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getTransationHistoryUrl + "?userId=" + userId + "&type=" + type + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }
    userSettings(userId: number, type: string, value: boolean, password: string, parentId: number): Observable<any> {
        return this.baseService.get(this.userSettingsUrl + "?userId=" + userId + "&type=" + type + "&value=" + value + "&password=" + password + "&parentId=" + parentId);
    }
    getBalance(userId: number): Observable<any> {
        return this.baseService.get(this.WalletUrl + "?userId=" + userId);
    }
    getHeaderNotifications(doamin: string, userId: number): Observable<any> {
        return this.baseService.get(this.getHeaderNotificationsUrl + "?domain=" + doamin + "&userId=" + userId);
    }
    searchUser(searchKey: string): Observable<any> {
        return this.baseService.get(this.searchUserUrl + "?searchKey=" + searchKey);
    }
    getUserSportsSetting(userId: number, sportsId: number): Observable<any> {
        return this.baseService.get(this.getUserSportsUrl + "?userId=" + userId + "&sportsId=" + sportsId);
    }
    updateUserSetting(data: any): Observable<any> {
        return this.baseService.post(this.updateUserSettingUrl, data);
    }
    getUserTournamentSettings(userId: number, sportsId: number, tournamentId: string): Observable<any> {
        return this.baseService.get(this.getUserTournamentSettingsUrl + "?userId=" + userId + "&sportsId=" + sportsId + "&tournamentId=" + tournamentId);
    }

    getOpenMarkets(sportsId: number, type: string, takeRec: number, skipRec: number, searchKey: string): Observable<any> {
        return this.baseService.get(this.getOpenMarketsUrl + "?sportsId=" + sportsId + "&type=" + type + "&takeRec=" + takeRec + "&skipRec=" + skipRec + "&searchKey=" + searchKey);
    }

    searchOpenMarkets(sportsId: number, seriesId: string, eventId: string, marketName: string, takeRec: number, skipRec: number): Observable<any> {
        return this.baseService.get(this.searchOpenMarketsUrl + "?sportsId=" + sportsId + "&seriesId=" + seriesId +
            "&eventId=" + eventId + "&marketName=" + marketName + "&takeRec=" + takeRec + "&skipRec=" + skipRec);
    }
    getAllSports(): Observable<any> {
        return this.baseService.get(this.getAllSportsUrl);
    }

    getTournaments(sportsId: number): Observable<any> {
        return this.baseService.get(this.getTournamentsUrl + "?sportsId=" + sportsId);
    }

    getActiveEvents(tournamentId: string): Observable<any> {
        return this.baseService.get(this.getActiveEventsUrl + "?tournamentId=" + tournamentId);
    }
    getMarkets(eventId: string): Observable<any> {
        return this.baseService.get(this.getMarketsUrl + "?eventId=" + eventId);
    }

    updateMultipleOpenMarket(data: any): Observable<any> {
        return this.baseService.post(this.updateMultipleOpenMarketUrl, data);
    }

    getCashStatement(userId: number, type: string, skipRec: number, takeRec: number, startTime: string, endTime: string): Observable<any> {
        return this.baseService.get(this.getCashStatementUrl + "?userId=" + userId + "&type=" + type + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&startTime=" + startTime + "&endTime=" + endTime);
    }

    getAllTransationHistory(userId: number, type: string, startTime: string, endTime: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getAllTransationHistoryUrl + "?userId=" + userId + "&type=" + type + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    getEventsForMarketRisk(type: number): Observable<any> {
        return this.baseService.get(this.getEventsForMarketRiskUrl + type);
    }

    getEventDeatil(eventId: string): Observable<any> {
        return this.baseService.get(this.getEventDeatilUrl + eventId);
    }

    getAllPendingBets(): Observable<any> {
        return this.baseService.get(this.getAllPendingBetsUrl);
    }

    getEventPendingBets(eventId: string, userId: number): Observable<any> {
        return this.baseService.get(this.getEventPendingBetsUrl + eventId + "&userId=" + userId);
    }

    deleteBets(ids: any): Observable<any> {
        return this.baseService.post(this.deleteBetsUrl, ids);
    }

    getDeletedBets(eventId: string): Observable<any> {
        return this.baseService.get(this.getDeletedBetsUrl + eventId);
    }

    getCurrentPosition(eventId: string, marketName: string, userId: number, sharingFull: boolean): Observable<any> {
        return this.baseService.get(this.getCurrentPositionUrl + eventId + "&marketName=" + marketName + "&userId=" + userId + "&sharingFull=" + sharingFull);
    }

    getPendingBets(userName: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getPendingBetsUrl + '?userName=' + userName + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    getAllBetHistory(userName: string, marketName: string, eventId: string, runnerId: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getAllBetsHistoryUrl + '?userName=' + userName + "&marketName=" + marketName + "&eventId=" + eventId + "&runnerId=" + runnerId + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }


    getUserBetHistoy(eventId: string, marketName: string, userName: string, startTime: string, endTime: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getUserBetHistoyUrl + '?eventId=' + eventId + "&marketName=" + marketName + "&userName=" + userName + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    getBetEventList(sportsId: number): Observable<any> {
        return this.baseService.get(this.getEventsListUrl + "?sportsId=" + sportsId);
    }

    getBetMarketList(eventId: string): Observable<any> {
        return this.baseService.get(this.getMarketListUrl + "?eventId=" + eventId);
    }

    getDeletedBetEvents(sportsId: number, startTime: string, endTime: string): Observable<any> {
        return this.baseService.get(this.getDeletedBetEventsUrl + "?sportsId=" + sportsId + "&startTime=" + startTime + "&endTime=" + endTime);
    }

    getDeletedBetHistory(userName: string, eventId: string, startTime: string, endTime: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getDeletedBetHistoryUrl + "?userName=" + userName + "&eventId=" + eventId + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    getFancyEvents(): Observable<any> {
        return this.baseService.get(this.getFancyEventsUrl);
    }

    getFancyListForResult(eventId: string): Observable<any> {
        return this.baseService.get(this.getFancyListForResultUrl + "?eventId=" + eventId);
    }

    fancyResult(runnerId: string, eventId: string, runValue: number): Observable<any> {
        return this.baseService.get(this.fancyResultUrl + "?runnerId=" + runnerId + "&eventId=" + eventId + "&runValue=" + runValue);
    }

    getEventMarket(sportsId: number, marketName: string): Observable<any> {
        return this.baseService.get(this.getEventsUrl + "?sportsId=" + sportsId + "&marketName=" + marketName);
    }

    matchResult(runnerId: string, eventId: string, runnerName: string, marketName: string): Observable<any> {
        return this.baseService.get(this.matchResultUrl + "?runnerId=" + runnerId + "&eventId=" + eventId + "&runnerName=" + runnerName + "&marketName=" + marketName);
    }

    getEventFancyHistory(): Observable<any> {
        return this.baseService.get(this.getEventFancyHistoryUrl);
    }

    getFancytHistoryByEventId(eventId: string, searchKey: string): Observable<any> {
        return this.baseService.get(this.getFancytHistoryByEventIdUrl + "?eventId=" + eventId + "&searchKey=" + searchKey);
    }

    getEventPLHistory(userId: number, eventId: string, startTime: string, endTime: string, skipRec: number, takeRec: number, parentId: number): Observable<any> {
        return this.baseService.get(this.getEventPLHistoryUrl + "?userId=" + userId + "&eventId=" + eventId + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&parentId=" + parentId);
    }
    getMarketBets(eventId: string, marketName: string): Observable<any> {
        return this.baseService.get(this.getMarketBetsUrl + eventId + "&marketName=" + marketName);
    }

    getCategories(): Observable<any> {
        return this.baseService.get(this.getCategoriesUrl);
    }

    getSubCategories(catId: number): Observable<any> {
        return this.baseService.get(this.getSubCategoriesUrl + catId);
    }

    getGames(catId: number): Observable<any> {
        let domain =location.origin;
        if (!domain.startsWith("https://")) {
            domain = "https://" + domain.replace(/^http:\/\/|^www\./, ''); // Replace "http://" and remove "www."
        }
        return this.baseService.get(this.getGamesUrl + catId + "&domain=" + domain);
    }

    blockUnBlockCasinoProvider(catId: number): Observable<any> {
        return this.baseService.get(this.blockCasinoProviderUrl + catId);
    }

    blockUnBlockCasinoSubCategory(subCatId: number): Observable<any> {
        return this.baseService.get(this.blockCasinoSubCategoryUrl + subCatId);
    }

    blockUnBlockCasinoGame(code: string): Observable<any> {
        return this.baseService.get(this.blockCasinoGameUrl + code);
    }

    getMarketSettings(eventId: string, marketName: string, isInplay: boolean): Observable<any> {
        return this.baseService.get(this.getMarketSettingsUrl + eventId + "&marketName=" + marketName + "&isInPlay=" + isInplay);
    }
    updateMarketSettings(data: any): Observable<any> {
        return this.baseService.post(this.updateMarketSettingsUrl, data);
    }

    addDomain(domain: any): Observable<any> {
        return this.baseService.post(this.addDomainUrl, domain);
    }

    getDomains(): Observable<any> {
        return this.baseService.get(this.getDomainsUrl);
    }

    updateUser(user: any): Observable<any> {
        return this.baseService.post(this.updateUserUrl, user);
    }

    addUrls(apiForm: any): Observable<any> {
        return this.baseService.post(this.addApiUrl, apiForm);
    }

    updateUrls(apiForm: any): Observable<any> {
        return this.baseService.post(this.updateApiUrl, apiForm);
    }

    getApiUrls(): Observable<any> {
        return this.baseService.get(this.getApiUrl);
    }
    getUserIds(searchKey: string): Observable<any> {
        return this.baseService.get(this.getUserIdsUrl + "?searchKey=" + searchKey);
    }

    getMarketPL(userId: number, eventId: string, marketName: string, runnerId: string, startTime: string, endTime: string, skipRec: number, takeRec: number, parentId: number): Observable<any> {
        return this.baseService.get(this.getMarketPLUrl + "?userId=" + userId + "&eventId=" + eventId + "&marketName=" + marketName + "&runnerId=" + runnerId + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&parentId=" + parentId);
    }

    getMarketWiseStake(userId: number, eventId: string, marketName: string, startTime: string, endTime: string, skipRec: number, takeRec: number, parentId: number): Observable<any> {
        return this.baseService.get(this.getMarketWiseStakeUrl + "?userId=" + userId + "&eventId=" + eventId + "&marketName=" + marketName + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&parentId=" + parentId);
    }
    finduser(searchKey: string): Observable<any> {
        return this.baseService.get(this.finduserUrl + "?searchKey=" + searchKey);
    }

    getEventWiseBetHistory(eventId: string, userId: number, marketName: string, startTime: string, endTime: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getEventWiseBetHistoryUrl + "?userId=" + userId + "&eventId=" + eventId + "&marketName=" + marketName + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    getUserWisePL(userId: number, eventId: string, marketName: string, startTime: string, endTime: string, skipRec: number, takeRec: number, parentId: number): Observable<any> {
        return this.baseService.get(this.getUserWisePLUrl + "?userId=" + userId + "&eventId=" + eventId + "&marketName=" + marketName + "&startTime=" + startTime + "&endTime=" + endTime + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&parentId=" + parentId);
    }

    getBalanceSheet(userId: number): Observable<any> {
        return this.baseService.get(this.getBalanceSheetUrl + userId);
    }

    getTopPlayers(): Observable<any> {
        return this.baseService.get(this.getTopPlayersUrl);
    }

    loggedInUser(websiteMode: string, type: string, skipRecords: number, takeRecords: number, searchKey: string): Observable<any> {
        return this.baseService.get(this.loggedInUserUrl + "?websiteMode=" + websiteMode + "&type=" + type + "&skipRec=" + skipRecords + "&takeRec=" + takeRecords + "&searchKey=" + searchKey);
    }

    getAllCategories(userId: number): Observable<any> {
        return this.baseService.get(this.getAllCategoriesUrl + "?userId=" + userId);
    }
    getAllSubCategories(userId: number, catId: string): Observable<any> {
        return this.baseService.get(this.getAllSubCategoriesUrl + "?userId=" + userId + "&catId=" + catId);
    }
    getAllGamesByCatId(userId: number, catId: string): Observable<any> {
        return this.baseService.get(this.getAllGamesByCatIdUrl + "?userId=" + userId + "&catId=" + catId);
    }

    blockUnBlockCasinoProviderByUserId(catId: number, userId: number, password: string): Observable<any> {
        return this.baseService.get(this.blockCasinoProviderByUserIdUrl + catId + "&userId=" + userId + "&password=" + password);
    }

    blockUnBlockCasinoSubCategoryByUserId(subCatId: number, userId: number, password: string): Observable<any> {
        return this.baseService.get(this.blockCasinoSubCategoryByUserIdUrl + subCatId + "&userId=" + userId + "&password=" + password);
    }

    blockUnBlockCasinoGameByUserId(code: string, userId: number, password: string): Observable<any> {
        return this.baseService.get(this.blockCasinoGameByUserIdUrl + code + "&userId=" + userId + "&password=" + password);
    }

    getMarketHistoryByMarketName(sportsId: number, marketName: string, searchKey: string, skipRec: number, takeRec: number): Observable<any> {
        return this.baseService.get(this.getMarketHistoryByMarketNameUrl + "?sportsId=" + sportsId + "&marketName=" + marketName + "&searchKey=" + searchKey + "&skipRec=" + skipRec + "&takeRec=" + takeRec);
    }

    abandonedFancy(runnerId: string, eventId: string): Observable<any> {
        return this.baseService.get(this.abandonedFancyUrl + "?runnerId=" + runnerId + "&eventId=" + eventId);
    }

    deleteMarket(eventId: string, marketName: string): Observable<any> {
        return this.baseService.get(this.deleteMarketUrl + "?eventId=" + eventId + "&marketName=" + marketName);
    }

    abandonedMarket(eventId: string, marketName: string): Observable<any> {
        return this.baseService.get(this.abandonedMarketUrl + "?eventId=" + eventId + "&marketName=" + marketName);
    }

    rollbackFancy(runnerId: string, eventId: string): Observable<any> {
        return this.baseService.get(this.rollbackFancyUrl + "?runnerId=" + runnerId + "&eventId=" + eventId);
    }

    rollbackMatchResult(eventId: string, marketName: string): Observable<any> {
        return this.baseService.get(this.rollbackMatchResultUrl + "?eventId=" + eventId + "&marketName=" + marketName);
    }

    getClientAllPendingBets(userId: number): Observable<any> {
        return this.baseService.get(this.getClientAllPendingBetsUrl + "?userId=" + userId);
    }

    updateUserTournamentSettings(data: any): Observable<any> {
        return this.baseService.post(this.updateUserTournamentSettingsUrl, data);
    }

    getUsersPLReport(parentId: number, searchKeyword: string, skipRecords: number, takeRecords: number, websiteMode: string, startTime: string, endTime: string): Observable<any> {
        return this.baseService.get(this.getUsersPLReportUrl + "?parentId=" + parentId + "&searchKeyword=" + searchKeyword + "&skipRecords=" + skipRecords + "&takeRecords=" + takeRecords + "&websiteMode=" + websiteMode + "&startTime=" + startTime + "&endTime=" + endTime);
    }

    settlement(userId: number, amount: number, role: string, type: string, isSettlementFull: boolean, password: string): Observable<any> {
        return this.baseService.get(this.settlementUrl + userId + "&amount=" + amount + "&role=" + role + "&type=" + type + "&isSettlementFull=" + isSettlementFull + "&password=" + password);
    }

    getEventBetHistoryForUser(userName: string, marketName: string, eventId: string, runnerId: string, skipRec: number, takeRec: number, userId: number): Observable<any> {
        return this.baseService.get(this.getEventBetHistoryForUserUrl + '?userName=' + userName + "&marketName=" + marketName + "&eventId=" + eventId + "&runnerId=" + runnerId + "&skipRec=" + skipRec + "&takeRec=" + takeRec + "&userId=" + userId);
    }

    getOverAllPandL(userId: number, startTime: string, endTime: string, sharing: boolean): Observable<any> {
        return this.baseService.get(this.getOverAllPandLUrl + userId + "&startTime=" + startTime + "&endTime=" + endTime + "&sharing=" + sharing);
    }

    getOddEven(): Observable<any> {
        return this.baseService.get(this.getOddEvenUrl);
    }

    activeOddEvenMarket(eventId: string, matchType: string): Observable<any> {
        return this.baseService.get(this.addOddEvenMarketUrl + eventId + "&matchType=" + matchType);
    }

    updateOddEvenMarket(id: number): Observable<any> {
        return this.baseService.get(this.updateOddEvenMarketUrl + id);
    }

    maintainSetting(id: number): Observable<any> {
        return this.baseService.get(this.maintainSettingUrl + id);
    }

    updateCasinoSettings(data: any): Observable<any> {
        return this.baseService.post(this.updateCasinoSettingsUrl,data);
    }

    updateBonus(bonusRequest: any) {
        return this.baseService.post(this.updateBonusUrl, bonusRequest);
    }
}

