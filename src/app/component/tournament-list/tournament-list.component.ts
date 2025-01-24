import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss']
})
export class TournamentListComponent {
  tournamentList: any = [];
  sportsId: number = 4;
  id: string = "";

  constructor(private authService: AuthService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.getAllTournamentsList()
  }

  onSportChange() {
    this.getAllTournamentsList();
  }

  updateTournament(data: any) {
    this.spinner.show();
    this.accountService.updateTournament(data).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.getAllTournamentsList();
          this.toastr.success(response.message, "Success");
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

  getAllTournamentsList() {
    this.spinner.show();
    this.tournamentList = [];
    this.accountService.getAllTournament(this.sportsId).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.tournamentList = response.data;
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

  dltMdl(id: string) {
    this.id = id
  }

  deleteTournament() {
    this.spinner.show();
    this.accountService.deleteTournament(this.id).subscribe({
      next: (response: any) => {
        if (response.status) {                   
          this.id = "";
          this.getAllTournamentsList(); 
          document.getElementById("clsMdlTo")?.click();
        }else{
          this.toastr.error(response.message,'Failed')
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

  //Handling Errors
  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
    this.spinner.hide();
  }

}
