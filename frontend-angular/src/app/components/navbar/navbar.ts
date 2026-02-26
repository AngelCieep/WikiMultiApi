import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styles: `
    .input-group .form-control {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
    }
    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  `,
})
export class Navbar {
  private searchService = inject(SearchService);
  searchInput = signal<string>('');

  handleSearch(event: Event): void {
    event.preventDefault();
    const trimmed = this.searchInput().trim();
    this.searchService.setSearchTerm(trimmed);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchService.clearSearch();
  }
}
