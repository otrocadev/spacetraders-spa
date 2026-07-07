import { Component, ElementRef, HostListener, input, signal, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';

export interface HoverDetailsItem {
  label: string;
  detail: string;
  value?: string | number;
}

@Component({
  selector: 'app-hover-details-panel',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './hover-details-panel.html',
  styleUrl: './hover-details-panel.scss',
})
export class HoverDetailsPanel {
  readonly title = input('Details');
  readonly subtitle = input('');
  readonly items = input<HoverDetailsItem[]>([]);

  @ViewChild('trigger') private readonly triggerRef?: ElementRef<HTMLElement>;

  readonly isOpen = signal(false);

  @HostListener('mouseenter')
  onEnter(): void {
    this.isOpen.set(true);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.isOpen.set(false);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.isOpen.set(true);
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.isOpen.set(false);
  }

  getPopoverStyles(): Record<string, string> {
    const rect = this.triggerRef?.nativeElement.getBoundingClientRect();

    if (!rect) {
      return {};
    }

    return {
      top: `${rect.bottom + 8}px`,
      left: `${Math.max(rect.left, 8)}px`,
      width: `${Math.min(rect.width + 24, 380)}px`,
    };
  }
}
