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

  constructor() {
    // Component initialized
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    const currentState = this.isOpen();
    const newState = !currentState;

    this.isOpen.set(newState);

    if (newState) {
      // When opening, ensure proper positioning
      setTimeout(() => {
        this.positionDropdown();
      }, 0);
    }
  }

  private positionDropdown() {
    const button = this.elementRef.nativeElement.querySelector('.sort-button');
    const menu = this.elementRef.nativeElement.querySelector('.sort-dropdown-menu');

    if (button && menu) {
      const buttonRect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = menu.offsetHeight;

      // Check if there's enough space below the button
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        // Position above the button
        menu.style.top = 'auto';
        menu.style.bottom = '100%';
        menu.style.marginTop = '0';
        menu.style.marginBottom = '4px';
      } else {
        // Position below the button (default)
        menu.style.top = '100%';
        menu.style.bottom = 'auto';
        menu.style.marginTop = '4px';
        menu.style.marginBottom = '0';
      }
    }
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
