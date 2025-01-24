import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  pendingRequestsCount:any=0;
  role:string =""
  getRoleId:number=0
  websiteMode:string="";
  private intervalId: any;
  dropdownStates: { [key: string]: boolean } = {};
  constructor(private toastr:ToastrService,private router: Router, private accountService: AccountService,private authService:AuthService)
   {
    const role = localStorage.getItem('roleId');
    this.getRoleId = role !== null ? parseInt(role, 10) : 0;
      this.websiteMode = localStorage.getItem('websiteMode') ?? 'b2b'
    }
  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.getCountForPendingRequests();
      this.role = localStorage.getItem("LoginRole") ?? "";
      this.intervalId = setInterval(() => this.getCountForPendingRequests(), 30000);
    }
    
  }

  ngOnDestroy(): void {
    // Clear the interval to prevent memory leaks
    if (this.intervalId && location.origin.includes('signin')) {
      clearInterval(this.intervalId);
    }
  }
  toggleDropdownul(key: string) {
    this.dropdownStates[key] = !this.dropdownStates[key];
  }

  closeDropdown(key: string) {
    this.dropdownStates[key] = false;
  }

  isDropdownOpen(key: string): boolean {
    return !!this.dropdownStates[key];
  }
 getCountForPendingRequests(){
    this.accountService.getCountForPendingRequests().subscribe({
      next:response=>{
        
        if(response.status){
          this.pendingRequestsCount=response.data;
        }
      },
      error: error => this.handleError(error)
    })
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(["/signin"]);
    }
  }

  toggleDropdown(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const dropdown = target.nextElementSibling as HTMLElement;

    document.querySelectorAll('.cstm_drop ul').forEach((element: Element) => {
      if (element !== dropdown) {
        element.classList.remove('show');
      }
    });
    dropdown.classList.toggle('show');
  }


  ngAfterViewInit() {
    const handleResize = () => {
      if (window.innerWidth < 991) {
        $(".link-tag").off("click").on("click", function () {
          $("body").removeClass("fullwidth");
        });
      } else {
        $(".link-tag").off("click");
      }
    };
  
    // Initial check
    handleResize();
  
    window.addEventListener('resize', handleResize);
    
  }
  
}
