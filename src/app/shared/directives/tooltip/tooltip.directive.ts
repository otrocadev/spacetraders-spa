import { Directive, ElementRef, HostListener, input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  readonly tooltip = input.required<string>({ alias: 'appTooltip' });

  private tooltipElement?: HTMLDivElement;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  @HostListener('focusin')
  @HostListener('mousemove')
  showTooltip(): void {
    const text = this.tooltip();

    if (!text) {
      return;
    }

    if (this.tooltipElement) {
      return;
    }

    const tooltipElement = this.renderer.createElement('div') as HTMLDivElement;
    const hostRect = this.hostElement.nativeElement.getBoundingClientRect();

    this.renderer.setAttribute(tooltipElement, 'role', 'tooltip');
    this.renderer.addClass(tooltipElement, 'app-tooltip');
    this.renderer.setStyle(tooltipElement, 'top', `${Math.max(hostRect.top - 8, 8)}px`);
    this.renderer.setStyle(tooltipElement, 'left', `${hostRect.left + hostRect.width / 2}px`);
    this.renderer.setProperty(tooltipElement, 'textContent', text);

    this.renderer.appendChild(document.body, tooltipElement);
    this.tooltipElement = tooltipElement;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hideTooltip(): void {
    if (!this.tooltipElement) {
      return;
    }

    this.renderer.removeChild(document.body, this.tooltipElement);
    this.tooltipElement = undefined;
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }
}
