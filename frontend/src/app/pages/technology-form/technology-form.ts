import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Technology, CreateTechnologyRequest, UpdateTechnologyRequest, Usage, Difficulty, Popularity } from '../../models/technology';
import { TechnologyApi } from '../../api/technology-api';
import { Spinner } from '../../shared/spinner/spinner';
import { ConfirmDeleteModal } from '../../shared/modal/confirm-delete-modal/confirm-delete-modal';
import { FormDropdown } from '../../shared/form/form-dropdown/form-dropdown';
import { DIFFICULTY_OPTIONS, POPULARITY_OPTIONS, TYPESCRIPT_OPTIONS, USAGE_OPTIONS } from '../../shared/models/filters-options';

@Component({
  selector: 'app-technology-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Spinner,
    ConfirmDeleteModal,
    FormDropdown],
  templateUrl: './technology-form.html',
  styleUrl: './technology-form.scss',
  standalone: true
})
export class TechnologyForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private technologyApi = inject(TechnologyApi);

  form!: FormGroup;
  isSubmitting = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);
  showDeleteModal = signal(false);

  mode = signal<'create' | 'edit'>('create');
  technologyId = signal<string | null>(null);
  title = computed(() => this.mode() === 'create' ? 'Create Technology' : 'Update Technology');
  currentYear = new Date().getFullYear();

  usageOptions = USAGE_OPTIONS;
  difficultyOptions = DIFFICULTY_OPTIONS;
  popularityOptions = POPULARITY_OPTIONS;
  typescriptOptions = TYPESCRIPT_OPTIONS;

  constructor() {
    this.initializeForm();
    this.setupRouteListener();
  }

  private initializeForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      usage: ['', Validators.required],
      difficulty: ['', Validators.required],
      popularity: ['', Validators.required],
      firstRelease: [new Date().getFullYear(), [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]],
        typescript: ['false'],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  private setupRouteListener() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mode.set('edit');
        this.technologyId.set(params['id']);
        this.loadTechnology(params['id']);
      } else {
        this.mode.set('create');
        this.technologyId.set(null);
      }
    });
  }

  private loadTechnology(id: string) {
    this.isLoading.set(true);
    this.technologyApi.getTechnologyById(id).subscribe({
      next: (tech) => {
        this.form.patchValue({
          ...tech,
          typescript: tech.typescript ? 'true' : 'false'
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load technology');
        this.isLoading.set(false);
      }
    });
  }

      onSubmit() {
        if (this.form.valid && !this.isSubmitting()) {
          this.isSubmitting.set(true);
          this.error.set(null);

          const formData = {
            ...this.form.value,
            typescript: this.form.value.typescript === 'true'
          };

          if (this.mode() === 'create') {
            this.createTechnology(formData);
          } else {
            this.updateTechnology(formData);
          }
        } else {
          this.markFormGroupTouched();
        }
      }

  private createTechnology(data: CreateTechnologyRequest) {
    this.technologyApi.createTechnology(data).subscribe({
      next: (tech) => {
        this.router.navigate(['/']);
      },
        error: (error) => {
          this.error.set('Failed to create technology');
          this.isSubmitting.set(false);
        }
    });
  }

  private updateTechnology(data: UpdateTechnologyRequest) {
    const id = this.technologyId();
    if (id) {
      this.technologyApi.patchTechnology(id, data).subscribe({
        next: (tech) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error.set('Failed to update technology');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }


  onDelete() {
    this.showDeleteModal.set(true);
  }

  onDeleteConfirm() {
    const id = this.technologyId();
    if (id) {
      this.isSubmitting.set(true);
      this.technologyApi.deleteTechnology(id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error.set('Failed to delete technology');
          this.isSubmitting.set(false);
        }
      });
    }
    this.showDeleteModal.set(false);
  }

  onDeleteCancel() {
    this.showDeleteModal.set(false);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} must be no more than ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${this.getFieldLabel(fieldName)} must be no more than ${field.errors['max'].max}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      usage: 'Usage',
      difficulty: 'Difficulty',
      popularity: 'Popularity',
      firstRelease: 'First Release',
      typescript: 'TypeScript',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

}
