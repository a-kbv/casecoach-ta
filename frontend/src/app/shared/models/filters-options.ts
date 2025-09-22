import { Usage, Difficulty, Popularity } from '../../models/technology';

export interface FilterOption<T = string> {
  value: T;
  label: string;
  checked: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export const USAGE_OPTIONS: FilterOption<Usage>[] = [
  { value: 'frontend', label: 'Frontend', checked: false },
  { value: 'backend', label: 'Backend', checked: false },
  { value: 'full stack', label: 'Full Stack', checked: false }
];

export const DIFFICULTY_OPTIONS: FilterOption<Difficulty>[] = [
  { value: 'easy', label: 'Easy', checked: false },
  { value: 'medium', label: 'Medium', checked: false },
  { value: 'hard', label: 'Hard', checked: false }
];

export const POPULARITY_OPTIONS: FilterOption<Popularity>[] = [
  { value: 'low', label: 'Low', checked: false },
  { value: 'medium', label: 'Medium', checked: false },
  { value: 'high', label: 'High', checked: false }
];

export const FIRST_RELEASE_OPTIONS: FilterOption<string>[] = [
  { value: 'before-2010', label: 'Before 2010', checked: false },
  { value: '2010-2015', label: '2010 - 2015', checked: false },
  { value: 'after-2015', label: 'After 2015', checked: false }
];

export const TYPESCRIPT_OPTIONS: FilterOption<string>[] = [
  { value: 'true', label: 'Yes', checked: true },
  { value: 'false', label: 'No', checked: false }
];

export const SORT_OPTIONS: SortOption[] = [
  { value: 'popularity-desc', label: 'Most popular' },
  { value: 'difficulty-asc', label: 'Easiest' },
  { value: 'first-release-asc', label: 'Earliest' }
];

