import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  imports: [],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.scss'
})
export class SearchFilter {
  placeholder = input<string>('Search');
  value = input<string>('');

  searchChange = output<string>();

  searchValue = signal(this.value());

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  }

  performSearch() {
    this.searchChange.emit(this.searchValue());
  }

  clearSearch() {
    this.searchValue.set('');
    this.searchChange.emit('');
  }
}
