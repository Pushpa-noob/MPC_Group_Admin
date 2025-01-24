import { Component, DebugElement } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss']
})
export class SportsComponent {
  sportsList: any = []
  sportsId: any = 0;
  userId:number=0
  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
      const id = localStorage.getItem('admin_userId');
      this.userId = id !== null ? parseInt(id, 10) : 0;
  }

  ngOnInit(): void {
    this.getAllSportsSetting()
  }

  getAllSportsSetting() {
    this.spinner.show();
    this.sportsList = [];
    this.accountService.getAllSportsSetting(this.userId).subscribe({
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

  update(data: any) {
    this.spinner.show();
    this.accountService.updateSportsSetting(data).subscribe({
      next: (response: any) => {
        this.getAllSportsSetting();
        this.toastr.success(response.message )
      },
      error: (error: any) => {
        this.handleError(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  //Handling Errors
  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }
}
