import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  imports: [],
  templateUrl: './confirm-delete-modal.html',
  styleUrl: './confirm-delete-modal.scss'
})
export class ConfirmDeleteModal {
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Delete');
  message = input<string>('Are you sure you want to delete this item?');
  itemName = input<string>('');
  isLoading = input<boolean>(false);

  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
