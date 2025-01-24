import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-winner-loser',
  templateUrl: './winner-loser.component.html',
  styleUrls: ['./winner-loser.component.scss']
})
export class WinnerLoserComponent {
  details: any = [];
  constructor(private toastr:ToastrService,private router: Router, private authService: AuthService, private accountService: AccountService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getTopPlayers();
  }

  private handleError(error: any) {
    if (error.status == 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
   
    this.spinner.hide();
  }

 private  getTopPlayers() {
    this.details=[]
    this.spinner.show();
    this.accountService.getTopPlayers().subscribe({
      next: (response: any) => {
        
        if (response.status) {
          this.details = response.data;
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
