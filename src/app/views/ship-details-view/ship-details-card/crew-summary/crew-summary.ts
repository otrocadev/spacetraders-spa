import { Component, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { CrewCapacity } from '../../../../shared/components/crew-capacity/crew-capacity';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { CrewRotation } from '../../../../core/ship-management/ship-management';
import { CreditsPipe } from '../../../../shared/pipes/credits.pipe';

interface CrewDetails {
  current: number;
  required: number;
  capacity: number;
  morale: number;
  rotation: CrewRotation;
  wages: number;
}

@Component({
  selector: 'app-crew-summary',
  imports: [StSurfaceComponent, StProgressComponent, CrewCapacity, IconTitleComponent, CreditsPipe],
  templateUrl: './crew-summary.html',
  styleUrl: './crew-summary.scss',
})
export class CrewSummary {
  readonly crewDetails = input.required<CrewDetails>();
}
