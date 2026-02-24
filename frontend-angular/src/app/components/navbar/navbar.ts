import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery: string = '';
  searchType: 'universes' | 'characters' = 'universes';
  searchTypeLabel = 'Universos';

  constructor(private router: Router) {}

  setSearchType(type: 'universes' | 'characters', label: string): void {
    this.searchType = type;
    this.searchTypeLabel = label;
  }

  submitSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    if (this.searchType === 'characters') {
      this.router.navigate(['/characters'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/universes'], { queryParams: { search: q } });
    }
    this.searchQuery = '';
  }
}
