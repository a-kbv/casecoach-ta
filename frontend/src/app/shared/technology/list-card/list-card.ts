import { Component, input, output } from '@angular/core';
import { Technology } from '../../../models/technology';

@Component({
  selector: 'app-list-card',
  imports: [],
  templateUrl: './list-card.html',
  styleUrl: './list-card.scss'
})
export class ListCard {
  technology = input.required<Technology>();

  editClick = output<Technology>();

  onEditClick() {
    this.editClick.emit(this.technology());
  }

  getUsageLabel(usage: string): string {
    switch (usage) {
      case 'frontend': return 'Front-end';
      case 'backend': return 'Back-end';
      case 'full stack': return 'Full stack';
      default: return usage;
    }
  }

  getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  getPopularityLabel(popularity: string): string {
    return popularity.charAt(0).toUpperCase() + popularity.slice(1);
  }

  getTypeScriptLabel(typescript: boolean): string {
    return typescript ? 'Yes' : 'No';
  }
}
