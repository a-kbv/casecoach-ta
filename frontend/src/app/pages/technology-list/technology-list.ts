import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { SortFilter } from '../../shared/technology/sort-filter/sort-filter';
import { GenericFilter } from '../../shared/technology/generic-filter/generic-filter';
import { SearchFilter } from "../../shared/technology/search-filter/search-filter";
import { CommonModule } from '@angular/common';
import { Technology } from '../../models/technology';
import { Router } from '@angular/router';
import { TechnologyApi } from '../../api/technology-api';
import { Spinner } from '../../shared/spinner/spinner';
import { ListCard } from '../../shared/technology/list-card/list-card';
import {
  USAGE_OPTIONS,
  DIFFICULTY_OPTIONS,
  POPULARITY_OPTIONS,
  FIRST_RELEASE_OPTIONS,
  TYPESCRIPT_OPTIONS,
  FilterOption
} from '../../shared/models/filters-options';

@Component({
  selector: 'app-technology-list',
  imports: [
    SortFilter,
    GenericFilter,
    SearchFilter,
    CommonModule,
    Spinner,
    ListCard,
    CommonModule
],
  templateUrl: './technology-list.html',
  styleUrl: './technology-list.scss'
})
export class TechnologyList {
  private router = inject(Router);
  private technologyApi = inject(TechnologyApi);

  @ViewChild('searchFilter') searchFilter!: SearchFilter;
  @ViewChild('usageFilter') usageFilterRef!: GenericFilter;
  @ViewChild('difficultyFilter') difficultyFilterRef!: GenericFilter;
  @ViewChild('popularityFilter') popularityFilterRef!: GenericFilter;
  @ViewChild('firstReleaseFilter') firstReleaseFilterRef!: GenericFilter;
  @ViewChild('typescriptFilter') typescriptFilterRef!: GenericFilter;

  // Filter options
  readonly USAGE_OPTIONS = USAGE_OPTIONS;
  readonly DIFFICULTY_OPTIONS = DIFFICULTY_OPTIONS;
  readonly POPULARITY_OPTIONS = POPULARITY_OPTIONS;
  readonly FIRST_RELEASE_OPTIONS = FIRST_RELEASE_OPTIONS;
  readonly TYPESCRIPT_OPTIONS = TYPESCRIPT_OPTIONS;

  technologies = signal<Technology[]>([]);
  filteredTechnologies = signal<Technology[]>([]);
  searchTerm = signal('');
  sortBy = signal('popularity-desc');
  isLoading = signal(false);

  usageFilter = signal<string[]>([]);
  difficultyFilter = signal<string[]>([]);
  popularityFilter = signal<string[]>([]);
  firstReleaseFilter = signal<string[]>([]);
  typescriptFilter = signal<boolean | null>(null);

  hasActiveFilters = computed(() => {
    return this.searchTerm() ||
           this.usageFilter().length > 0 ||
           this.difficultyFilter().length > 0 ||
           this.popularityFilter().length > 0 ||
           this.firstReleaseFilter().length > 0 ||
           this.typescriptFilter() !== null;
  });

  constructor() {
    this.loadTechnologies();
  }

  async loadTechnologies() {
    this.isLoading.set(true);
    try {
      this.technologyApi.getAllTechnologies().subscribe({
        next: (technologies: Technology[]) => {
          this.technologies.set(technologies);
          this.filteredTechnologies.set(technologies);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.isLoading.set(false);
        }
      });
    } catch (error: any) {
      this.isLoading.set(false);
    }
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.applyFilters();
  }

  onUsageFilterChange(selected: FilterOption<string>[]) {
    this.usageFilter.set(selected.map(s => s.value));
    this.applyFilters();
  }

  onDifficultyFilterChange(selected: FilterOption<string>[]) {
    this.difficultyFilter.set(selected.map(s => s.value));
    this.applyFilters();
  }

  onPopularityFilterChange(selected: FilterOption<string>[]) {
    this.popularityFilter.set(selected.map(s => s.value));
    this.applyFilters();
  }

  onFirstReleaseFilterChange(selected: FilterOption<string>[]) {
    this.firstReleaseFilter.set(selected.map(s => s.value));
    this.applyFilters();
  }

  onTypeScriptFilterChange(selected: FilterOption<string>[]) {
    const selectedValue = selected.length > 0 ? selected[0].value === 'true' : null;
    this.typescriptFilter.set(selectedValue);
    this.applyFilters();
  }

  onSortChange(sortBy: string) {
    this.sortBy.set(sortBy);
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchTerm.set('');
    this.usageFilter.set([]);
    this.difficultyFilter.set([]);
    this.popularityFilter.set([]);
    this.firstReleaseFilter.set([]);
    this.typescriptFilter.set(null);
    this.sortBy.set('popularity-desc');

    //reset the internal state of all filter components
    this.usageFilterRef?.reset();
    this.difficultyFilterRef?.reset();
    this.popularityFilterRef?.reset();
    this.firstReleaseFilterRef?.reset();
    this.typescriptFilterRef?.reset();

    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.technologies()];

    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(search) ||
        tech.description.toLowerCase().includes(search)
      );
    }

    if (this.usageFilter().length > 0) {
      filtered = filtered.filter(tech =>
        this.usageFilter().includes(tech.usage)
      );
    }

    if (this.difficultyFilter().length > 0) {
      filtered = filtered.filter(tech =>
        this.difficultyFilter().includes(tech.difficulty)
      );
    }

    if (this.popularityFilter().length > 0) {
      filtered = filtered.filter(tech =>
        this.popularityFilter().includes(tech.popularity)
      );
    }

    if (this.firstReleaseFilter().length > 0) {
      filtered = filtered.filter(tech => {
        const year = tech.firstRelease;
        return this.firstReleaseFilter().some(range => {
          switch (range) {
            case 'before-2010': return year < 2010;
            case '2010-2015': return year >= 2010 && year <= 2015;
            case 'after-2015': return year > 2015;
            default: return false;
          }
        });
      });
    }

    if (this.typescriptFilter() !== null) {
      filtered = filtered.filter(tech => tech.typescript === this.typescriptFilter());
    }

        filtered.sort((a, b) => {
          switch (this.sortBy()) {
            case 'popularity-desc': return this.getPopularityOrder(b.popularity) - this.getPopularityOrder(a.popularity);
            case 'difficulty-asc': return this.getDifficultyOrder(a.difficulty) - this.getDifficultyOrder(b.difficulty);
            case 'first-release-asc': return a.firstRelease - b.firstRelease;
            default: return 0;
          }
        });

    this.filteredTechnologies.set(filtered);
  }

  private getPopularityOrder(popularity: string): number {
    switch (popularity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 0;
    }
  }

  private getDifficultyOrder(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 0;
    }
  }

  onEditTechnology(technology: Technology) {
    this.router.navigate(['/technology/edit', technology.id]);
  }

  onCreateTechnology() {
    this.router.navigate(['/technology/add']);
  }
}
