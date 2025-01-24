import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ExportService } from 'src/app/services/export.service';
@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.scss']
})
export class CasinoComponent implements OnInit {
  categories: any = [];
  subCategories: any = [];
  games: any = [];
  filteredData: any[] = [];
  value: string = '';
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject();
  catId: number = 0
  isCat: boolean = true;
  isSubCat: boolean = false;
  isGames: boolean = false;
  subCatId: any = 0;
  // Breadcrumbs tracking variables
  selectedCategory: any = null;
  selectedSubCategory: any = null;
  title: string = '';
  isLocked:boolean=false;
  casinoRequestData:any=[];

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }
  downloadExcel() {
      this.exportService.exportToExcel(this.categories, 'categories');
    }
  getCategories() {
    this.categories = [];
    this.spinner.show();
    this.accountService.getCategories().subscribe({
      next: response => {
        if (response.status) {
          
          this.categories = response.data;
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
    this.resetBreadcrumbs();
  }

  getSubCategories(catId: number) {
    this.subCategories = [];
    this.spinner.show();
    this.isCat = false;
    this.isSubCat = true;
    this.isGames = false;
    this.catId = catId;
    this.selectedCategory = this.categories.find((cat: any) => cat.id === catId);

    this.accountService.getSubCategories(catId).subscribe({
      next: response => {
        if (response.status) {
          this.subCategories = response.data;
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  getGames(subCatId: number) {
    this.games = [];
    this.spinner.show();
    this.isCat = false;
    this.isSubCat = false;
    this.isGames = true;
    this.subCatId = subCatId;
    this.selectedSubCategory = this.subCategories.find((sub: any) => sub.id === subCatId);

    this.accountService.getGames(subCatId).subscribe({
      next: response => {
        if (response.status) {
          this.games = response.data;
          this.filteredData = response.data;
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  onSearchChange(query: any): void {
    query = query.target.value;
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchText => {
      this.filterData(searchText);
    });
    this.searchSubject.next(query);
  }

  filterData(query: string): void {
    if (query && query != "") {
      this.games = this.filteredData.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.games = this.filteredData;
    }
  }

  // Breadcrumbs navigation methods
  resetToCategories(): void {
    this.resetBreadcrumbs();
    this.getCategories();
  }

  resetToSubCategories(): void {
    this.isCat = false;
    this.isSubCat = true;
    this.isGames = false;

    // Reset selected game but keep the selected category
    this.selectedSubCategory = null;
  }

  navigateToCategory(): void {
    this.isCat = true;
    this.isSubCat = false;
    this.isGames = false;
    this.getCategories();
  }

  navigateToSubCategory(): void {
    this.isCat = false;
    this.isSubCat = true;
    this.isGames = false;
    this.getSubCategories(this.catId);
  }

  private resetBreadcrumbs(): void {
    this.selectedCategory = null;
    this.selectedSubCategory = null;
  }

  setModelValues(value: string, title: string,isLocked:boolean) {
    this.value = value;
    this.title = title;
    this.isLocked=isLocked;
  }

  blockUnBlock() {
    if (this.title == "Category") {
      this.catId=parseInt(this.value);
      this.blockUnBlockCasinoProvider();
    } else if (this.title == "SubCategory") {
      this.subCatId=parseInt(this.value);
      this.blockUnBlockSubCategories();
    } else {
      this.blockUnBlockGames();
    }
  }

  blockUnBlockCasinoProvider() {
    this.spinner.show();
    this.accountService.blockUnBlockCasinoProvider(parseInt(this.value)).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, 'success')
          this.getCategories();
          this.closeModel();
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  blockUnBlockSubCategories() {
    this.spinner.show();
    this.accountService.blockUnBlockCasinoSubCategory(parseInt(this.value)).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, 'success')
          this.getSubCategories(this.catId);
          this.closeModel();
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  blockUnBlockGames() {
    this.spinner.show();
    this.accountService.blockUnBlockCasinoGame(this.value).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, 'success')
          this.getGames(this.subCatId);
          this.closeModel();
        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }


  updateSettings(index:number) {
    this.spinner.show();
    if(this.isCat){
      this.casinoRequestData={
        "Id":this.categories[index].id,
        "ProviderId":0,
        "UserId":0,
        "Type":"Provider",
        "MinStake":this.categories[index].settings.afterInplayMinStake,
        "MaxStake":this.categories[index].settings.afterInplayMaxStake,
        "MaxProfit":this.categories[index].settings.maxProfit,
      }
    }else{
      this.casinoRequestData={
        "Id":this.subCategories[index].id,
        "ProviderId":this.subCategories[index].providerId,
        "UserId":0,
        "Type":"SubProvider",
        "MinStake":this.subCategories[index].settings.afterInplayMinStake,
        "MaxStake":this.subCategories[index].settings.afterInplayMaxStake,
        "MaxProfit":this.subCategories[index].settings.maxProfit,
      }
    }
    
    this.accountService.updateCasinoSettings(this.casinoRequestData).subscribe({
      next: response => {
        if (response.status) {
          this.toastr.success(response.message, 'Success')
          
        }else{
          this.toastr.error(response.message, 'Failed')

        }
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  closeModel(){
    document.getElementById('clsdltmdl')?.click();
  }
}
