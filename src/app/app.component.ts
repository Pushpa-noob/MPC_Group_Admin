import { Component, HostListener, OnInit, AfterViewChecked  } from '@angular/core';
import { Router, NavigationEnd, NavigationStart,  } from '@angular/router';
import { InactivityService } from './services/inactive.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  
  title = 'bright247Exch_Admin';
  showButton = false;
  showHeaderSidebar: boolean = true;
  isSignInPage: boolean = false;
  constructor(private router: Router,private inactivityService:InactivityService) {
    this.inactivityService.initInactivityListener();

    this.showHeaderSidebar = !this.router.url.includes('signin');
}

  @HostListener('window:scroll', ['$event'])
  ngOnInit() {
    this.updateHeaderSidebarVisibility(this.router.url);

     // Subscribe to router events to update visibility dynamically
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderSidebarVisibility(event.urlAfterRedirects);
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeModalAndCleanUp();
      }
    });

    // Listen for back/forward navigation
    window.onpopstate = () => window.location.reload();
  }

  closeModalAndCleanUp(): void {
    // Close the modal and reset associated styles
    const modal = document.querySelector('.modal');
    const backdrop = document.querySelector('.modal-backdrop');
    const body = document.querySelector('body');

    modal?.classList.remove('show');
    (modal as HTMLElement)?.style.removeProperty('display');
    
    backdrop?.classList.remove('fade', 'show');
    backdrop?.remove();
    
    body?.classList.remove('modal-open');
    body?.style.removeProperty('overflow');
    body?.style.removeProperty('padding-right');
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const yOffset = window.pageYOffset;
    this.showButton = yOffset > 150;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private updateHeaderSidebarVisibility(url: string) {
    this.showHeaderSidebar = !url.includes('signin');
  }

 
}
