import { Component, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { CrewCapacity } from '../../../../shared/components/crew-capacity/crew-capacity';

interface CrewDetails {
  current: number;
  required: number;
  capacity: number;
  morale: number;
}

@Component({
  selector: 'app-crew-summary',
  imports: [StSurfaceComponent, StProgressComponent, CrewCapacity],
  templateUrl: './crew-summary.html',
  styleUrl: './crew-summary.scss',
})
export class CrewSummary {
  readonly crewDetails = input.required<CrewDetails>();
}
