import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { count, elementAt } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { ExportService } from 'src/app/services/export.service';
declare var bootstrap: any;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  loggedInParent: number = 0;
  private modalInstance: any;
  userList: any = []
  parentId: number = 1;
  role = "";
  isLocked: boolean = false;
  searchKeyword: string = "";
  skipRecords: number = 0;
  Count: number = 0;
  pageNum: number = 1;
  takeRecords: number = 200;
  skipRecordsInner: number = 0;
  CountInner: number = 0;
  pageNumInner: number = 1;
  takeRecordsInner: number = 50;
  selectedUserIds: number[] = [];
  userId: number = 0;
  breadCumName: any = [];
  selectedUserName: string = "";
  selectedUserId: number = 0;
  selectedUserRole: string = "";
  backButtonChk: boolean = false;
  roleList: any = [];
  sportsList: any = [];
  activeSports: any = [];
  seriesList: any = [];
  marketList: any = [];
  eventList: any = []
  sportsId: number = 0;
  eventId: string = "";
  seriesId: string = "";
  password: string = "";
  userBalance: number = 0;
  marketId: string = "";
  marketName: string = "";
  valueType: string = '';
  eventType: string = '';
  userDetails: any = [];
  backupUserDetails: any = [];
  isEditing: boolean = false;
  isSaveDisabled: boolean = true;

  amount: number = 0;
  initialBalanceUser: number = 0;
  initialBalanceParent: number = 0;
  startTime: string = "";
  endTime: string = "";
  returnObj: any = [];
  permissionValue: boolean = false;
  allowBet: boolean = false;
  casinoStatus: boolean = false;
  status: boolean = false;
  activeItems: { [key: string]: number } = {};
  refillBonus: number = 0;
  everyRefillBonus: number = 0;
  chkParent: string = 'No';
  getRoleId: number;
  betList: any = [];
  pendingSettlement: number = 0;
  settlementAmount: number = 0;
  remark: string = "Deposit Cash";
  backUpSettlement: any = [];
  breadcrumbs: { username: string; userId: number }[] = []; // List of breadcrumb data

  CountBkp: number = 0;
  pageNumBkp: number = 0;
  takeRecordsBkp: number = 0;
  skipRecBkp: number = 0;
  type: string = "";
  profileDomain: string = '';
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private exportService: ExportService) {
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    const role = localStorage.getItem('roleId');
    this.getRoleId = role !== null ? parseInt(role, 10) : 0;
    this.loggedInParent = this.parentId;

  }

  ngOnInit(): void {
    const storedValue = localStorage.getItem('BackButton');
    this.chkParent = storedValue !== null ? storedValue : '';

    if (this.chkParent == "Ok") {
      this.parentId = this.sharedService.getParentId();
      localStorage.removeItem('BackButton');
    } else {
      const id = localStorage.getItem('admin_userId');
      this.parentId = id !== null ? parseInt(id, 10) : 0;
    }
    this.searchKeyword = ""
    this.getUserList();
    this.sharedService.setParentId(this.parentId);
    this.getDates();
  }

  getSportsList() {
    this.activeSports = [];
    this.spinner.show();
    this.accountService.getAllSports().subscribe({
      next: (response: any) => {
        debugger;
        if (response.status) {
          this.activeSports = response.data;

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



  onSportChange(event: any) {
    this.sportsId = event.target.value;
    this.getSeries();
    this.getAllSportsSetting();
  }


  maintainSetting(userId: number) {
    this.spinner.show();
    this.accountService.maintainSetting(userId).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
        } else {
          this.toastr.error(response.message, 'Failed');
        }
      }, error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  formatNumber(value: number): string {
    if (value == null) {
      return '';
    }
    const roundedValue = Math.round(value * 100) / 100;

    if (Number.isInteger(roundedValue)) {
      return roundedValue.toString();
    }
    return roundedValue.toFixed(2).replace(/\.00$/, '');
  }




  downloadCSV(tableName: string) {
    if (tableName === 'userList') {
      this.exportService.exportToCSV(this.userList, 'UserTable');
    } else if (tableName === 'returnObj') {
      this.exportService.exportToCSV(this.returnObj, 'HistoryTable');
    }
  }

  downloadExcel(tableName: string) {
    if (tableName === 'userList') {
      this.exportService.exportToExcel(this.userList, 'UserTable');
    } else if (tableName === 'returnObj') {
      this.exportService.exportToExcel(this.returnObj, 'HistoryTable');
    }
  }

  downloadPDF(tableName: string) {
    if (tableName === 'userList') {
      this.exportService.exportToPDF(this.userList, 'UserTable');
    } else if (tableName === 'returnObj') {
      this.exportService.exportToPDF(this.returnObj, 'HistoryTable');
    }
  }

  navToList(data: any) {
    const index = this.breadcrumbs.indexOf(data);
    if (index !== -1) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    }
    this.takeRecords = 50;
    this.pageNum = 1;
    this.skipRecords = 0;
    this.searchKeyword = '';
    this.parentId = data.userId
    this.getUserList();
  }

  onB2BChange(): void {
    this.searchKeyword = "";
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.takeRecords = 50;
    this.pageNum = 1;
    this.skipRecords = 0;
    this.getUserList();
  }

  onB2CChange(): void {
    this.searchKeyword = "";
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.takeRecords = 50;
    this.pageNum = 1;
    this.skipRecords = 0;
  }


  //Active In Active Toggle Button
  toggleLock(event: Event): void {
    this.searchKeyword = "";
    const target = event.target as HTMLInputElement;
    this.isLocked = !target.checked;
    this.getUserList();
  }

  //Go Downline Of Users
  getChilds(id: number, loginId: string, role: string) {
    this.breadcrumbs.push({
      username: loginId,
      userId: id
    });
    this.role = role;
    this.parentId = id,
    this.skipRecords = 0;
    this.takeRecords = 50,
    this.pageNum = 1;
    this.searchKeyword = '';
    this.getUserList();
  }

  //Page Chnage Funtion
  pageChanged(pageNo: any, type: string) {
    this.pageNum = pageNo;
    this.skipRecords = (pageNo - 1) * this.takeRecords;
    if (type == "initial") {
      this.getUserList();
    }

  }

  //inner pageChange
  pageChangedInner(pageNo: any) {

    this.pageNumInner = pageNo;
    this.skipRecordsInner = (pageNo - 1) * this.takeRecordsInner;
    this.getTransationHistory();
  }

  updateRecValue(event: any, type: string) {

    const data = parseInt(event.target.value, 10);
    this.pageNumInner = 1; // Reset to the first page when records per page change
    this.skipRecordsInner = 0; // Reset the skip count
    this.takeRecordsInner = data;

    if (type === 'history') {
      this.pageNumInner = 1; // Reset to the first page when records per page change
      this.skipRecordsInner = 0; // Reset the skip count
      this.takeRecordsInner = data;
      this.getTransationHistory();
    } else {
      this.pageNum = 1; // Reset to the first page when records per page change
      this.skipRecords = 0; // Reset the skip count
      this.takeRecords = data;
      this.searchKeyword = ''
      this.getUserList();
    }
  }


  //select Users to Block/Unblock
  selectUsers(data: any) {
    this.userId = data.userId;
    const index = this.selectedUserIds.indexOf(this.userId);
    if (index === -1) {
      this.selectedUserIds.push(this.userId);
    } else {
      this.selectedUserIds.splice(index, 1);
    }
  }


  //Reset Button Function
  resetAll() {
    this.role = ""
    this.breadcrumbs = [];
    const id = localStorage.getItem('admin_userId');
    this.parentId = id !== null ? parseInt(id, 10) : 0;
    this.selectedUserIds = [];
    this.searchKeyword = '';
    this.pageNum = 1;
    this.skipRecords = 0;
    this.takeRecords = 50;
    this.breadCumName = [];
    this.isLocked = false;


    this.sharedService.setParentId(this.parentId)
    this.getUserList();
  }

  //Get User List
  getUserList() {
    this.userList = []
    this.spinner.show();
    this.accountService.getUserByParentId(this.parentId, this.isLocked, this.searchKeyword, this.skipRecords, this.takeRecords).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.userList = response.users;
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
  }

  //Block multiple Users
  BlockUsers() {
    if (this.selectedUserIds.length == 0) {
      this.toastr.error('Please Select User First');
      return;
    } else {
      this.spinner.show();
      this.accountService.blockMultipleUser(this.selectedUserIds).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message);
            this.selectedUserIds = [];
            this.getUserList();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
          this.toastr.error('An error occurred');
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  //unblock multiple Users
  UnblockUsers() {
    if (this.selectedUserIds.length == 0) {
      this.toastr.error('Please Select User First');
      return;
    } else {
      this.spinner.show();
      this.accountService.unblockMultipleUser(this.selectedUserIds).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message);
            this.selectedUserIds = [];
            this.getUserList();
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
          this.toastr.error('An error occurred');
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  //Get role list to update user role based on parent role 
  GetRolesToUpdate(data: any) {
    this.spinner.show();
    this.userId = data.userId;
    this.selectedUserName = data.loginId;
    this.roleList = [];
    this.accountService.getRoleToUpdateLevel(this.userId).subscribe({
      next: (response: any) => {
        this.roleList = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  //Select Role To Update Level
  roleChange(event: any) {

    this.selectedUserId = event.target.value;
  }

  //update user role
  UpdateUserRole() {

    this.accountService.updateUserRole(this.userId, this.selectedUserId).subscribe({
      next: (response: any) => {
        this.getUserList();
        if (response.status) {
          this.toastr.success(response.message, 'Success')
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

  //breadcum get All users
  getparentId(id: number) {

    this.parentId = id;
    this.breadCumName.some(function (el: any) {
      return el.id === id;
    });
    var totalRes = this.breadCumName.length;
    if (totalRes > 0) {
      const index = this.breadCumName.findIndex(
        (item: any) => item.userId === id
      );
      for (var key in this.breadCumName) {
        if (index < totalRes - 1) {
          var rd: any = totalRes - index;
          for (var i = 1; i <= rd; i++) {
            this.breadCumName.splice(index, i);
          }
        }
      }
    }
    this.getUserList();
  }

  // Market Block Unblock Api Call's Start
  chkSportsStatus(id: number, name: string, role: string) {
    this.spinner.show();
    this.sportsList = [];
    this.selectedUserName = name;
    this.selectedUserId = id;
    this.selectedUserRole = role;
    this.accountService.getUsersSportsStatus(this.selectedUserId).subscribe({
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

  chkTournamentStatus(id: number) {
    this.spinner.show();
    this.seriesList = [];
    this.sportsId = id

    if (this.sportsId == 5) {
      this.accountService.getAllCategories(this.selectedUserId).subscribe({
        next: (response: any) => {
          this.seriesList = response.data;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.accountService.CheckUserTournamentStatus(this.selectedUserId, this.sportsId).subscribe({
        next: (response: any) => {
          this.seriesList = response.tournamentList;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }

  }

  chkEventStatus(id: string) {
    this.spinner.show();
    this.eventList = [];
    this.seriesId = id
    if (this.sportsId == 5) {
      this.accountService.getAllSubCategories(this.selectedUserId, this.seriesId).subscribe({
        next: (response: any) => {
          this.eventList = response.data;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.accountService.getUsersEventStatus(this.selectedUserId, this.seriesId).subscribe({
        next: (response: any) => {
          this.eventList = response.events;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  chkMarketStatus(id: string) {
    this.spinner.show();
    this.marketList = [];
    this.eventId = id
    if (this.sportsId == 5) {
      this.accountService.getAllGamesByCatId(this.selectedUserId, this.eventId).subscribe({
        next: (response: any) => {
          this.marketList = response.data;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
    else {
      this.accountService.getUserMarketStatus(this.selectedUserId, this.eventId).subscribe({
        next: (response: any) => {
          this.marketList = response.market;
        },
        error: (error: any) => {
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }


  }

  blockUnblockSports() {
    this.accountService.blockUnblockSports(this.selectedUserId, this.sportsId, this.password).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById("clsBUmdl")?.click();
          document.getElementById("clsPassModel")?.click();
          this.resetBlockunblockMarketModel();
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

  blockUnblockTournament() {
    if (this.sportsId == 5) {
      this.spinner.show();
      this.accountService.blockUnBlockCasinoProviderByUserId(parseInt(this.seriesId), this.selectedUserId, this.password).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
          } else {
            this.toastr.error(response.message, 'Failed')
          }
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.accountService.blockUnblockTournament(this.seriesId, this.selectedUserId, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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

  }

  blockUnblockEvent() {
    this.spinner.show();
    if (this.sportsId == 5) {
      this.accountService.blockUnBlockCasinoSubCategoryByUserId(parseInt(this.eventId), this.selectedUserId, this.password).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, 'success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
          } else {
            this.toastr.error(response.message, 'Failed')
          }
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this.accountService.blockUnblockEvent(this.selectedUserId, this.eventId, this.password).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success(response.message, 'Success')
            document.getElementById("clsBUmdl")?.click();
            document.getElementById("clsPassModel")?.click();
            this.resetBlockunblockMarketModel();
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
  }

  blockUnblockMarket() {
    this.spinner.show();
    if (this.sportsId == 5) {
      this.accountService.blockUnBlockCasinoGameByUserId(this.marketId, this.selectedUserId, this.password).subscribe({
        next: response => {
          if (response.status) {
            this.toastr.success(response.message, 'success')

          } else {
            this.toastr.error(response.message, 'Failed')
          }
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
    this.accountService.blockUnblockMarket(this.selectedUserId, this.marketId, this.eventId, this.marketName, this.password).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          document.getElementById("clsBUmdl")?.click();
          document.getElementById("clsPassModel")?.click();
          this.resetBlockunblockMarketModel();
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



  resetBlockunblockMarketModel() {
    this.eventId = "";
    this.seriesId = "";
    this.sportsId = 0;
    this.marketId = ""
    this.marketName = "";
    this.eventType = ""
    this.valueType = "";
    this.eventList = [];
    this.seriesList = [];
    this.marketList = [];
    this.sportsList = [];
    this.selectedUserId = 0;
    this.selectedUserName = "";
    this.password = "";
  }

  resetPassword() {
    this.password = ""
  }


  onStartTimeChange(newValue: string) {
    this.startTime = newValue;
  }


  onEndTimeChange(newValue: string) {
    this.endTime = newValue;
  }

  setValues(eventType: string, list: any) {

    if (list.is_locked) {
      this.valueType = "Unlock"
    } else {
      this.valueType = "Block"
    }
    this.eventType = eventType;
    if (eventType == 'sport') {
      //this.providerId = 
      this.sportsId = list.sports_id
    } else if (eventType == 'series') {
      this.seriesId = list.series_id;
    } else if (eventType == 'event') {
      this.eventId = list.event_id
    } else {
      this.marketId = list.market_id;
      this.marketName = list.market_name;
    }
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  blockUnblockType() {

    if (this.password.length > 0) {
      if (this.eventType == 'sport') {
        this.blockUnblockSports()
      } else if (this.eventType == 'series') {
        this.blockUnblockTournament();
      } else if (this.eventType == 'event') {
        this.blockUnblockEvent();
      } else {
        this.blockUnblockMarket();
      }
    }

    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  //Market Block Unblock Api Call's End


  getUserDetails(data: any) {

    this.selectedUserName = data.loginId;
    this.selectedUserId = data.userId;
    this.selectedUserRole = data.role;
    this.status = data.isLocked;
    this.allowBet = data.isDeleted;
    this.casinoStatus = data.casinoBet;
  }

  getUserShare(data: any) {
    this.selectedUserName = data.loginId;
    this.selectedUserId = data.userId;
    this.selectedUserRole = data.role;
    this.spinner.show();
    this.userDetails = [];
    this.accountService.getUserShare(this.selectedUserId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.userDetails = response.data;
          // Initialize backupUserDetails with the current userDetails upon retrieval
          this.backupUserDetails = { ...this.userDetails };
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

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.userDetails = { ...this.backupUserDetails };
    }
  }

  updateUserShare() {
    this.isEditing = false;
    this.spinner.show();
    this.accountService.updateUserShare(this.selectedUserId, this.userDetails.userSportsShare, this.userDetails.userCasinoShare).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, 'Success');
          this.isEditing = false;
          this.isSaveDisabled = true;
          document.getElementById("clsShare")?.click();
          this.getUserList();
        } else {
          this.toastr.error(response.message, 'Failed');
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

  checkSaveButtonState() {
    if (this.userDetails.userSportsShare <= this.userDetails.parentSportShare &&
      this.userDetails.userCasinoShare <= this.userDetails.parentCasinoShare &&
      this.userDetails.userSportsShare >= this.backupUserDetails.userSportsShare &&
      this.userDetails.userCasinoShare >= this.backupUserDetails.userCasinoShare) {
      this.isSaveDisabled = false; // Enable save button
    } else {
      this.isSaveDisabled = true; // Disable save button
    }
  }


  resetUserPassword() {
    this.spinner.show();
    this.accountService.resetUserPassword(this.selectedUserId, this.password).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, "Success")
          document.getElementById("clsPass")?.click();
          this.resetPassword()
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

  copyReferralLink() {
    const referralLink = `${this.profileDomain}#/register?referalCode=${this.userDetails.data?.referralCode}`;

    // Use the Clipboard API to write text to the clipboard
    navigator.clipboard.writeText(referralLink).then(
      () => {
        alert('Referral link copied to clipboard!');
      },
      (err) => {
        console.error('Error copying referral link: ', err);
        alert('Failed to copy referral link.');
      }
    );
  }

  getUserProfileById(data: any) {

    this.profileDomain = data.domainName;
    this.selectedUserName = data.loginId;
    this.selectedUserId = data.userId;
    this.selectedUserRole = data.role;
    this.status = data.isLocked;
    this.allowBet = data.isDeleted;
    this.casinoStatus = data.casinoBet;
    this.spinner.show();
    this.userDetails = [];
    this.accountService.getUserProfileById(this.selectedUserId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.userDetails = response;
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

  getParentDetails(data: any, type: string) {
    this.remark = type == "D" ? "Deposit Cash" : "Withdraw Cash";
    this.userDetails = [];
    this.spinner.show();
    this.selectedUserName = data.loginId;

    this.selectedUserId = data.userId;
    this.selectedUserRole = data.fullName;
    if (data.totalSettlement > 0) {
      this.userBalance = Number((data.availBalance - data.totalSettlement).toFixed(2));
    } else {
      this.userBalance = Number(data.availBalance.toFixed(2));
    }

    this.initialBalanceUser = data.availBalance;
    this.accountService.getParentDetails(this.parentId).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.userDetails = response.data;

          this.initialBalanceParent = this.userDetails.balance;
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

  updateBalancesDeposit() {

    const amountValue = Number(this.amount);
    if (!isNaN(amountValue) && amountValue > 0) {
      this.amount = amountValue;
      this.userDetails.balance = this.initialBalanceParent - amountValue;
      this.userBalance = this.initialBalanceUser + amountValue;
    } else if (this.userBalance > this.initialBalanceParent) {
      alert('Insufficient balance!');
      this.amount = 0;
      this.resetBalances();
    } else if (amountValue < 0 || this.amount === null || this.amount === undefined) {
      this.resetBalances();
    }
  }

  updateBalancesWithdraw() {

    const amountValue = Number(this.amount);
    if (!isNaN(amountValue) && amountValue > 0) {
      this.amount = amountValue;
      this.userDetails.balance = this.initialBalanceParent + amountValue;
      this.userBalance = this.initialBalanceUser - amountValue;
    } else if (this.userBalance > this.initialBalanceParent) {
      alert('Insufficient balance!');
      this.amount = 0;
      this.resetBalances();
    } else if (amountValue < 0 || this.amount === null || this.amount === undefined) {
      this.resetBalances();
    }
  }

  resetBalances() {
    this.userBalance = this.initialBalanceUser;
    this.amount = 0;
    this.userDetails.balance = this.initialBalanceParent;
  }

  manualDeposit() {
    if (this.password?.length == 0 || this.password == "" || this.password == undefined) {
      this.toastr.error("Enter password", 'Failed');
      this.returnObj
    }
    this.spinner.show();
    this.accountService.manualDeposit(this.selectedUserId, this.password, this.amount).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.toastr.success(response.message, 'Success')
          this.getUserList();
          document.getElementById("clsdep")?.click();
          this.resetBalances()
        } else {
          this.toastr.error(response.message, 'Failed');
        }
      },
      error: (error: any) => {
        this.handleError(error);
        this.toastr.error("Enter Password", "Failed");
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
  manualWithdraw() {
    if (this.password?.length == 0 || this.password == "" || this.password == undefined) {
      this.toastr.error("Enter password", 'Failed');
      this.returnObj
    }
    this.spinner.show();
    this.accountService.manualWithdraw(this.selectedUserId, this.password, this.amount).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.toastr.success(response.message, 'Success')
          this.getUserList();
          document.getElementById("clsWith")?.click();
          this.resetBalances()
        } else {
          this.toastr.error(response.message, 'Failed')
        }
      },
      error: (error: any) => {
        this.handleError(error);
        this.toastr.error("Enter Password", "Failed");
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }


  getTransationHistory() {

    this.spinner.show();
    this.returnObj = [];
    const startTime = `${this.startTime.split('T')[0]} T00:00:00`; // 'YYYY-MM-DD 00:00:00'
    const endTime = `${this.endTime.split('T')[0]} T23:59:59`;
    this.accountService.getTransationHistory(this.selectedUserId, this.valueType, startTime, endTime, this.skipRecordsInner, this.takeRecordsInner).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.returnObj = response.data;
          this.CountInner = response.totalItems
        } else {
          this.returnObj = [];
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

  advanceSearchLoad() {
    this.getHistoryData(this.valueType);
  }

  getHistoryData(value: string) {


    this.CountBkp = this.Count;
    this.takeRecordsBkp = this.takeRecords;
    this.skipRecBkp = this.skipRecords;
    this.pageNumBkp = this.pageNum;
    this.pageNum = 0;
    this.Count = 0;
    this.skipRecords = 0;
    this.takeRecords = 0;
    this.selectedUserId = this.backupUserDetails.userId;
    this.valueType = value;
    this.pageNumInner = 1
    this.skipRecordsInner = 0;
    this.takeRecordsInner = 20;
    this.getTransationHistory()
  }

  openInNewTab(data: any) {
    if (data.marketName == "cash" || data.marketName == "Settlement" || data.marketName == "Match Commision" || data.marketName == "Session Commision") {
      return;
    }
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace('/user_list', '/client_bids');
    const finalUrl = newUrl.split('?')[0] + `?marketName=${data.marketName}&eventId=${data.eventId}&runnerId=${data.runnerId}&userId=${data.userId}`;

    window.open(finalUrl, '_blank');
  }

  getHistory(data: any, type: string) {
    this.CountBkp = this.Count;
    this.takeRecordsBkp = this.takeRecords;
    this.skipRecBkp = this.skipRecords;
    this.pageNumBkp = this.pageNum;
    this.backupUserDetails = data;
    this.selectedUserName = data.loginId;
    this.selectedUserId = data.userId;
    this.selectedUserRole = data.fullName;
    this.valueType = "All"
    this.skipRecordsInner = 0;
    this.takeRecordsInner = 20;
    this.pageNumInner = 1;
    this.getDates();

    this.getTransationHistory();
  }

  getDates() {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 0);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    this.startTime = this.formatDate(startDate);
    this.endTime = this.formatDate(endDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  clsHistoryModel() {
    this.pageNum = this.pageNumBkp;
    this.Count = this.CountBkp;
    this.skipRecords = this.skipRecBkp;
    this.takeRecords = this.takeRecordsBkp;
    this.pageNumInner = 0;
    this.CountInner = 0;
    this.skipRecordsInner = 0;
    this.takeRecordsInner = 0;
    this.searchKeyword = "";
    this.pageChanged(this.pageNum, 'other');
    this.valueType = "All"
    this.startTime = "";
    this.endTime = ""
  }

  //Handling Errors
  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }

    this.spinner.hide();
  }

  //active or deactive modal set
  setPermissions(type: string, value: boolean): void {

    if (type === 'isDeleted') {
      this.permissionValue = !this.allowBet;
    } else if (type === 'isLocked') {
      this.permissionValue = !this.status;
    } else if (type === 'casino') {
      this.permissionValue = !this.casinoStatus;
    } else {
      this.permissionValue = value;
    }
    this.valueType = type;
  }

  //update active or deactive model setting
  updateSetting() {
    this.spinner.show();
    this.accountService.userSettings(this.selectedUserId, this.valueType, this.permissionValue, this.password, this.parentId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.toastr.success(response.message, "Success");
          document.getElementById("clsPerModel")?.click();
          document.getElementById("clsPerMdl")?.click();
          this.getUserList();
        } else {
          this.toastr.error(response.message, "Failed");
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

  //get all sports for tournament limit setting
  getSports(list: any) {
    this.selectedUserId = list.userId
    this.selectedUserName = list.loginId
    this.selectedUserRole = list.fullName
    this.sportsId = 4;
    this.getSeries();
  }

  //get series for tournament limit setting
  getSeries() {
    this.seriesList = [];
    this.spinner.show();
    this.accountService.getAllTournament(this.sportsId).subscribe({
      next: (response: any) => {
        this.seriesList = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }



  onTournamentSelected(event: any) {
    this.seriesId = event.target.value;
    this.returnObj = this.seriesList.find((x: { tournamentId: string, name: string }) => x.tournamentId === this.seriesId);

  }


  selectSaveType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.eventType = String(selectElement.value);
  }

  //
  getSetting(data: any) {
    this.getSportsList();
    this.sportsList = [];
    this.selectedUserId = data.userId
    this.selectedUserName = data.loginId
    this.selectedUserRole = data.fullName
    this.sportsId = 4;
    this.getAllSportsSetting();
  }

  getAllSportsSetting() {
    this.spinner.show();
    this.returnObj = [];
    this.accountService.getUserSportsSetting(this.selectedUserId, this.sportsId).subscribe({
      next: (response: any) => {
        if (response.status) {
          debugger;
          this.returnObj = response.data;
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

  getUserTournamentSettings() {
    this.spinner.show();
    this.accountService.getUserTournamentSettings(this.selectedUserId, this.sportsId, this.seriesId).subscribe({
      next: (response: any) => {
        this.seriesList = response.data;
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  updateTournamentSetting() {

    if (this.eventType == "") {
      this.toastr.error('Please select save type', 'Error');
    } else {
      this.spinner.show();
      const payload = {
        password: this.password,
        reqType: this.eventType,
        afterInplayMaxStake: this.returnObj.afterInplayMaxStake,
        beforeInplayMaxStake: this.returnObj.beforeInplayMaxStake,
        sportId: this.returnObj.sportId,
        afterInplayMinStake: this.returnObj.afterInplayMinStake,
        beforeInplayMinStake: this.returnObj.beforeInplayMinStake,
        betDelay: this.returnObj.betDelay,
        maxProfit: this.returnObj.maxProfit,
        maxOdds: this.returnObj.maxOdds,
        userId: this.selectedUserId,
        fancyDelay: this.returnObj.fancyDelay,
        afterInplayBooKMakerMaxStake: this.returnObj.afterInplayBooKMakerMaxStake,
        afterInplayBooKMakerMinStake: this.returnObj.afterInplayBooKMakerMinStake,
        afterInplayFancyMaxStake: this.returnObj.afterInplayFancyMaxStake,
        afterInplayFancyMinStake: this.returnObj.afterInplayFancyMinStake,
        beforeInplayBooKMakerMaxStake: this.returnObj.beforeInplayBooKMakerMaxStake,
        beforeInplayBooKMakerMinStake: this.returnObj.beforeInplayBooKMakerMinStake,
        beforeInplayFancyMaxStake: this.returnObj.beforeInplayFancyMaxStake,
        beforeInplayFancyMinStake: this.returnObj.beforeInplayFancyMinStake,
        bookMakerBetDelay: this.returnObj.bookMakerBetDelay,
        fancyBetDelay: this.returnObj.fancyBetDelay,
        bookMaxProfit: this.returnObj.bookMaxProfit,
        fancyMaxProfit: this.returnObj.fancyMaxProfit,
        matchMaxProfit: this.returnObj.matchMaxProfit,
        tossMaxProfit: this.returnObj.tossMaxProfit,
        tossMaxStake: this.returnObj.tossMaxStake,
        tossMinStake: this.returnObj.tossMinStake,
        tournamentId: this.returnObj.tournamentId,
        tournamentName: this.returnObj.tournamentName
      };
      this.accountService.updateUserTournamentSettings(payload).subscribe({
        next: (response: any) => {
          if (response.status) {

            this.toastr.success(response.message, "Success");
            this.returnObj = []
          } else {
            this.toastr.error(response.message, 'Failed');
          }
        },
        error: (error: any) => {
          this.toastr.error('An error occurred while updating settings', 'Error');
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  resetSettings() {
    this.returnObj = []
    this.seriesList = []
  }

  updateSportsSetting() {

    if (this.eventType == "") {
      this.toastr.error('Please select save type', 'Error');
    } else {
      this.spinner.show();
      const payload = {
        password: this.password,
        eventType: this.eventType,
        afterInplayMaxStake: this.returnObj.afterInplayMaxStake,
        beforeInplayMaxStake: this.returnObj.beforeInplayMaxStake,
        sportId: this.returnObj.sportId,
        afterInplayMinStake: this.returnObj.afterInplayMinStake,
        beforeInplayMinStake: this.returnObj.beforeInplayMinStake,
        betDelay: this.returnObj.betDelay,
        maxProfit: this.returnObj.maxProfit,
        maxOdds: this.returnObj.maxOdds,
        userId: this.selectedUserId,
        fancyDelay: this.returnObj.fancyDelay,
        parentId: this.loggedInParent
      };
      this.accountService.updateUserSetting(payload).subscribe({
        next: (response: any) => {
          if (response.status) {

            this.toastr.success(response.message, "Success");
          } else {
            this.toastr.error(response.message, 'Failed');
          }
        },
        error: (error: any) => {
          this.toastr.error('An error occurred while updating settings', 'Error');
          this.handleError(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  getBonusValues(refillBonus: number, everyRefillBonus: number, userId: number) {
    this.refillBonus = refillBonus;
    this.everyRefillBonus = everyRefillBonus;
    this.userId = userId;
  }

  toggleNested(level: string, id: number): void {
    if (this.activeItems[level] === id) {
      delete this.activeItems[level];
    } else {
      this.activeItems[level] = id;
    }
  }
  isActive(level: string, id: number): boolean {
    return this.activeItems[level] === id;
  }

  getClientAllPendingBets(userId: number) {
    this.spinner.show();
    this.betList = []
    this.selectedUserId = userId;
    this.accountService.getClientAllPendingBets(this.selectedUserId).subscribe({
      next: (response: any) => {

        if (response.status) {
          this.betList = response.data;
        } else {
          this.returnObj = [];
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

  ngAfterViewInit() {
    $(".showpass").click(function () {
      $(".tooltipSpbtm").toggleClass("show");
      setTimeout(function () {
        $(".tooltipSpbtm").removeClass("show");
      }, 5000);
    });
    const modalElement = document.getElementById('blockmarketModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }
}
