import { Component, input } from '@angular/core';

@Component({
  selector: 'app-crew-capacity',
  imports: [],
  templateUrl: './crew-capacity.html',
  styleUrl: './crew-capacity.scss',
})
export class CrewCapacity {
  public usedCapacity = input.required<number>();
  public maxCapacity = input.required<number>();
  public minimumRequired = input.required<number>();

  get minimumPercentage(): number {
    return this.toPercent(this.minimumRequired(), this.maxCapacity());
  }

  get usedPercentage(): number {
    return this.toPercent(this.usedCapacity(), this.maxCapacity());
  }

  get usedLabel(): string {
    return `${this.usedCapacity()}/${this.maxCapacity()}`;
  }

  private toPercent(value: number, max: number): number {
    if (max <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (value / max) * 100));
  }
}
