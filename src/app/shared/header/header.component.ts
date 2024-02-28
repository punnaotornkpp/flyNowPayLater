import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {  
  dropdownVisible: boolean = true;

  constructor(private dialog : MatDialog) {}


  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

     openSearch() {
    const dialogRef = this.dialog.open(SearchComponent, {
                      
      // data: { name: this.name, animal: this.animal },
    });
    // dialogRef.afterClosed().subscribe((result) => {});
  }

}

