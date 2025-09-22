import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, output, signal, effect } from '@angular/core';
import { FilterOption } from '../../models/filters-options';

@Component({
  selector: 'app-generic-filter',
  imports: [CommonModule],
  templateUrl: './generic-filter.html',
  styleUrl: './generic-filter.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class GenericFilter<T = string> {
  showActiveBorder = input<boolean>(true);
  placeholder = input<string>('Filter');
  currentFilter = input<string[]>([]);
  options = input<FilterOption<T>[]>([]);

  selectionChange = output<FilterOption<T>[]>();

  isOpen = signal(false);
  internalOptions = signal<FilterOption<T>[]>([]);

  hasSelection = computed(() => this.currentFilter().length > 0);
  selectedCount = computed(() => this.currentFilter().length);

  constructor(private elementRef: ElementRef) {
    effect(() => {
      this.internalOptions.set([...this.options()]);
    });

    effect(() => {
      const currentFilterValues = this.currentFilter();
      this.internalOptions.update(options =>
        options.map(option => ({
          ...option,
          checked: currentFilterValues.includes(option.value as string)
        }))
      );
    });
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleFilter() {
    this.isOpen.update(open => !open);
  }

  toggleOption(option: FilterOption<T>) {
    this.internalOptions.update(opts =>
      opts.map(opt =>
        opt.value === option.value
          ? { ...opt, checked: !opt.checked }
          : opt
      )
    );
  }

  clearSelection() {
    this.internalOptions.update(opts =>
      opts.map(opt => ({ ...opt, checked: false }))
    );
    this.selectionChange.emit([]);
    this.isOpen.set(false);
  }

  applySelection() {
    const selected = this.internalOptions().filter(opt => opt.checked);
    this.selectionChange.emit(selected);
    this.isOpen.set(false);
  }

  reset() {
    this.internalOptions.set([...this.options()]);
    this.isOpen.set(false);
  }
}
