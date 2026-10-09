import { Component, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../services/search-service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnDestroy {
  searchService = inject(SearchService);
  ngOnDestroy(): void {
    this.searchService.searchTerm.set('')
  }
}
