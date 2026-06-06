import { Component, computed, input } from '@angular/core';

export type StBadgeTone = 'brand' | 'accent' | 'neutral';
export type StBadgeStyle = 'soft' | 'solid';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrls: ['./badge.scss'],
})
export class BadgeComponent {
  readonly tone = input<StBadgeTone>('brand');
  readonly appearance = input<StBadgeStyle>('soft');

  protected readonly classes = computed(
    () => `st-badge st-badge--${this.tone()} st-badge--${this.appearance()}`,
  );
}
