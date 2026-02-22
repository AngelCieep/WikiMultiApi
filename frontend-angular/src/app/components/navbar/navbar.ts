import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchQuery: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;

  constructor(private router: Router, private api: ApiService) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    this.isSearching = true;
    this.api.getUniverses().subscribe({
      next: (res) => {
        const query = this.searchQuery.toLowerCase();
        this.searchResults = res.status.filter((u: any) =>
          u.name.toLowerCase().includes(query) ||
          u.slug.toLowerCase().includes(query)
        );
        this.isSearching = false;
      },
      error: () => { this.isSearching = false; }
    });
  }

  goToUniverse(slug: string): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.router.navigate(['/universes', slug]);
  }

  submitSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchResults = [];
      this.router.navigate(['/universes'], { queryParams: { search: this.searchQuery } });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }
}
