import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { SORT_OPTIONS, SortOption } from '../../models/filters-options';

@Component({
  selector: 'app-sort-filter',
  imports: [],
  templateUrl: './sort-filter.html',
  styleUrl: './sort-filter.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SortFilter {
  placeholder = input<string>('Sort by');
  selectedValue = input<string>('popularity-desc');

  selectionChange = output<string>();

  isOpen = signal(false);
  options = signal<SortOption[]>([...SORT_OPTIONS]);

  private elementRef = inject(ElementRef);

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isOpen.update(open => !open);
  }

  selectOption(option: SortOption) {
    this.selectionChange.emit(option.value);
    this.isOpen.set(false);
  }

  getSelectedLabel(): string {
    const selected = this.options().find(opt => opt.value === this.selectedValue());
    return selected ? selected.label : this.placeholder();
  }
}
