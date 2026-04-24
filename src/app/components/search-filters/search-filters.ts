import { Component, output } from '@angular/core';
import { ActiveFilter } from '../../models/filter.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.css',
})
export class SearchFilters {
  changedFilters = output<ActiveFilter>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      text: [''],
      state: [''],
      type: [''],
      platform: [''],
      genre: [''],
    });
    this.form.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(),
      )
      .subscribe((valores) => {
        this.changedFilters.emit({
          text: valores.text || '',
          state: valores.state || '',
          type: valores.type || '',
          platform: valores.platform || '',
          genre: valores.genre || '',
        });
      });
  }

  existsFilters(): boolean {
    const v = this.form.value;
    return !!(v.text || v.state || v.platform || v.genre);
  }

  cleanFilters(): void {
    this.form.reset({
      text: '',
      state: '',
      type: '',
      platform: '',
      genre: '',
    });
  }
}
