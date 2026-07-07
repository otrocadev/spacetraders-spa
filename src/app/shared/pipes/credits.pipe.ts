import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'credits',
  standalone: true,
})
export class CreditsPipe implements PipeTransform {
  transform(value: number): string {
    const numericValue = typeof value === 'number' ? value : Number(value);

    if (Number.isNaN(numericValue)) {
      return '';
    }

    const formattedValue = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Math.trunc(numericValue));

    return `$${formattedValue}`;
  }
}
