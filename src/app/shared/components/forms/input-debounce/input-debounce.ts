import { Component, computed, effect, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StInputComponent } from '@otrocadev/orbital-spacetraders-ds';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-input-debounce',
  imports: [StInputComponent],
  templateUrl: './input-debounce.html',
  styleUrl: './input-debounce.scss',
})
export class InputDebounce {
  private readonly _showDebouncedValidation = signal(false);

  public readonly control = input.required<FormControl<string | null>>();
  public readonly label = input.required<string>();
  public readonly placeholder = input<string>('');
  public readonly tone = input<'brand' | 'accent' | 'neutral'>('accent');
  public readonly debounceMs = input<number>(300);
  public readonly errorMessages = input<Record<string, string>>({});
  public readonly defaultErrorText = input<string>('Invalid value');

  public readonly errorText = computed(() => {
    const control = this.control();

    if (!this._showDebouncedValidation() || !control.invalid) {
      return '';
    }

    const errors = control.errors;
    if (!errors) {
      return this.defaultErrorText();
    }

    const messages = this.errorMessages();
    for (const errorKey of Object.keys(errors)) {
      if (messages[errorKey]) {
        return messages[errorKey];
      }
    }

    return this.defaultErrorText();
  });

  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const debounceMs = this.debounceMs();

      const immediateSubscription = control.valueChanges.subscribe(() => {
        this._showDebouncedValidation.set(false);
      });

      const debouncedSubscription = control.valueChanges
        .pipe(debounceTime(debounceMs), distinctUntilChanged())
        .subscribe(() => {
          this._showDebouncedValidation.set(control.dirty || control.touched);
        });

      onCleanup(() => {
        immediateSubscription.unsubscribe();
        debouncedSubscription.unsubscribe();
      });
    });
  }

  public onValueChange(value: string): void {
    const control = this.control();
    control.markAsDirty();
    control.setValue(value);
  }
}
