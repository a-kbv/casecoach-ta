import { Component, signal, input, output, computed } from '@angular/core';
import { FilterOption } from '../../models/filters-options';

@Component({
  selector: 'app-form-dropdown',
  imports: [],
  templateUrl: './form-dropdown.html',
  styleUrl: './form-dropdown.scss'
})
export class FormDropdown {
// Inputs
options = input.required<FilterOption[]>();
placeholder = input.required<string>();
value = input<string>('');
isInvalid = input<boolean>(false);

// Outputs
valueChange = output<string>();

// Internal state
isOpen = signal(false);

// Computed
selectedValue = computed(() => this.value());
selectedOption = computed(() => {
  const value = this.selectedValue();
  return this.options().find(option => option.value === value);
});

toggleDropdown() {
  this.isOpen.update(open => !open);
}

selectOption(option: FilterOption) {
  this.valueChange.emit(option.value);
  this.isOpen.set(false);
}

onBlur() {
  //delay to allow click events to fire
  setTimeout(() => this.isOpen.set(false), 150);
}
}
