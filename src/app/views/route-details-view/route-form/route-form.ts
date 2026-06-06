import { Component, input, output, inject, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputDebounce } from '../../../shared/components/forms/input-debounce/input-debounce';
import {
  StButtonComponent,
  StDropdownComponent,
  StDropdownItem,
} from '@otrocadev/orbital-spacetraders-ds';
import {
  RouteDetails,
  RouteStep,
  StoreMarketplaceDetails,
  StoreWaypointDetails,
  StoreSystemDetails,
} from '../../../core/route-management/route-management';
import { extractSystemSymbolFromWaypoint } from '../../../core/route-management/route-management.utils';
import { SytemStore } from '../../../core/route-management/sytem-management.store';
import { Item } from '../../../core/shared/shared.models';
import { RouteInventorySummary } from '../route-inventory-summary/route-inventory-summary';

type RouteStepFormValue = {
  originWaypoint?: string | null;
};

@Component({
  selector: 'app-route-form',
  imports: [
    ReactiveFormsModule,
    InputDebounce,
    StButtonComponent,
    StDropdownComponent,
    RouteInventorySummary,
  ],
  templateUrl: './route-form.html',
  styleUrl: './route-form.scss',
})
export class RouteForm {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _sytemStore = inject(SytemStore);
  private _loadedOriginMarketplaceKey: string | null = null;
  private _loadedRouteId: string | null = null;

  public readonly orderTypeOptions: StDropdownItem[] = [
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
  ];
  public readonly currentRoute = input<RouteDetails | null>(null);
  public readonly agentHQ = input<string>('');
  public readonly systems = input<StoreSystemDetails[]>([]);
  public readonly startRoute = output<string>();
  public readonly updateRoute = output<RouteDetails>();

  public readonly routeForm = this._formBuilder.group({
    routeName: ['', [Validators.required, Validators.minLength(8)]],
    steps: this._formBuilder.array([]),
  });

  private readonly _formValue = toSignal(this.routeForm.valueChanges, {
    initialValue: this.routeForm.value,
  });

  public readonly usedOrigins = computed(
    () =>
      new Set(
        ((this._formValue().steps ?? []) as RouteStepFormValue[])
          .map((step) => step.originWaypoint)
          .filter((originWaypoint): originWaypoint is string => !!originWaypoint),
      ),
  );

  public readonly routeNameErrorMessages: Record<string, string> = {
    required: 'Route name is required',
    minlength: 'Route name must be at least 8 characters',
  };

  constructor() {
    effect(() => {
      const route = this.currentRoute();
      if (!route || route.steps.length === 0) return;

      const { systemSymbol, waypointSymbol } = route.steps[0].origin;

      const marketplaceKey = `${systemSymbol}:${waypointSymbol}`;

      if (this._loadedOriginMarketplaceKey === marketplaceKey) {
        return;
      }

      this._loadedOriginMarketplaceKey = marketplaceKey;
      this._sytemStore.loadWaypointMarketplace(systemSymbol, waypointSymbol).subscribe();
    });

    effect(() => {
      const route = this.currentRoute();
      if (!route || route.steps.length === 0) return;

      // Only load if this is a different route than what's already loaded
      if (this._loadedRouteId === route.id) {
        return;
      }

      this._loadedRouteId = route.id;

      // Populate form with route data
      const stepsFormArray = this.steps;
      stepsFormArray.clear();

      // Set route name
      this.routeForm.patchValue({ routeName: route.name });

      // Reconstruct steps array with all data
      route.steps.forEach((step) => {
        const stepGroup = this.createStepGroup(step.origin.waypointSymbol);
        stepGroup.patchValue({
          destinationWaypoint: step.destination.waypointSymbol,
        });

        // Add marketplace actions if they exist
        if (step.comercialActions && step.comercialActions.length > 0) {
          const marketplaceActionsArray = stepGroup.get('marketplaceActions') as FormArray;
          step.comercialActions.forEach((action) => {
            marketplaceActionsArray.push(
              this._formBuilder.group({
                tradeSymbol: [action.item, Validators.required],
                orderType: [action.type, Validators.required],
                units: [action.quantity, [Validators.required, Validators.min(1)]],
              }),
            );
          });
        }

        stepsFormArray.push(stepGroup);
      });
    });
  }

  // Functions to insert/delete form controls
  public insertFirstRouteWaypoint(): void {
    const routeNameControl = this.routeForm.controls.routeName;
    const routeName = routeNameControl.value?.trim() ?? '';

    if (!routeName || routeNameControl.invalid) {
      routeNameControl.markAsDirty();
      routeNameControl.markAsTouched();
      return;
    }

    this.startRoute.emit(routeName);
    this.addStep(this.agentHQ());
  }

  public addStep(originWaypoint: string): void {
    this.steps.push(this.createStepGroup(originWaypoint));

    this.emitRouteUpdate();
  }

  public addTradeOption(stepIndex: number): void {
    const marketplaceActions = this.getMarketplaceActionsArray(stepIndex);

    marketplaceActions.push(this.createTradeOptionGroup());

    this.emitRouteUpdate();
  }

  // helpers for the form logic and validations
  public canAddNavigationStep(): boolean {
    const lastStep = this.steps.at(this.steps.length - 1);
    const nextOrigin = lastStep?.get('destinationWaypoint')?.value ?? '';

    if (!nextOrigin) {
      return false;
    }

    const systemSymbol = extractSystemSymbolFromWaypoint(nextOrigin);
    const systemInfo = this.systems().find((system) => system.symbol === systemSymbol);

    if (!systemInfo) {
      return false;
    }

    const eligibleWaypointSymbols = systemInfo.waypoints
      .filter((waypoint) => waypoint.jumpGate || waypoint.hasMarketplace)
      .map((waypoint) => waypoint.symbol);

    const takenAfterAddingStep = new Set([...this.usedOrigins(), nextOrigin]);

    return eligibleWaypointSymbols.some((symbol) => !takenAfterAddingStep.has(symbol));
  }

  public onDropdownDestinationChange(stepIndex: number, value: string): void {
    const step = this.getStepGroup(stepIndex);
    const destinationControl = step?.get('destinationWaypoint');

    destinationControl?.setValue(value);
    destinationControl?.markAsTouched();
    destinationControl?.markAsDirty();

    // Load marketplace data for the selected destination
    const systemSymbol = extractSystemSymbolFromWaypoint(value);
    this._sytemStore.loadWaypointMarketplace(systemSymbol, value).subscribe();

    this.emitRouteUpdate();
  }

  public getDestinationOptions(stepIndex: number): StDropdownItem[] {
    const step = this.getStepGroup(stepIndex);
    const originWaypoint = step?.get('originWaypoint')?.value ?? '';
    const currentDestination = step?.get('destinationWaypoint')?.value ?? '';
    const systemSymbol = extractSystemSymbolFromWaypoint(originWaypoint);
    const system = this.systems().find((item) => item.symbol === systemSymbol);
    const usedOriginsUntilStep = new Set(
      this.steps.controls
        .slice(0, stepIndex + 1)
        .map((item) => item.get('originWaypoint')?.value)
        .filter(Boolean),
    );

    if (!system) {
      return [];
    }

    return system.waypoints
      .filter(
        (waypoint) =>
          (waypoint.jumpGate || waypoint.hasMarketplace) &&
          (!usedOriginsUntilStep.has(waypoint.symbol) || waypoint.symbol === currentDestination),
      )
      .map((waypoint) => {
        const tags: string[] = [];

        if (waypoint.jumpGate) {
          tags.push('Jump Gate');
        }

        if (waypoint.hasMarketplace) {
          tags.push('Marketplace');
        }

        return {
          label: waypoint.symbol,
          description: tags.join(' | '),
          value: waypoint.symbol,
        };
      });
  }

  public hasOriginMarketplace(stepIndex: number): boolean {
    return this.getOriginWaypointDetails(stepIndex)?.hasMarketplace ?? false;
  }

  public getOriginMarketplace(stepIndex: number): StoreMarketplaceDetails | undefined {
    return this.getOriginWaypointDetails(stepIndex)?.marketplace;
  }

  public getDestinationMarketplace(stepIndex: number): StoreMarketplaceDetails | undefined {
    return this.getDestinationWaypointDetails(stepIndex)?.marketplace;
  }

  public getTradeGoodOptions(
    stepIndex: number,
    actionIndex: number,
  ): { label: string; value: string }[] {
    const action = this.getMarketplaceActionsArray(stepIndex).at(actionIndex);
    const orderType = action?.get('orderType')?.value ?? 'BUY';
    const marketplace = this.getOriginMarketplace(stepIndex);

    if (!marketplace) {
      return [];
    }

    const goods = orderType === 'SELL' ? marketplace.imports : marketplace.exports;

    return goods.map((good) => ({ label: good.name, value: good.symbol }));
  }

  public formatMarketGoods(goods: StoreMarketplaceDetails['imports'] | undefined): string {
    if (!goods || goods.length === 0) {
      return 'none';
    }

    return goods.map((good) => good.symbol).join(', ');
  }

  public onOrderTypeChange(stepIndex: number, actionIndex: number, value: string): void {
    const action = this.getMarketplaceActionsArray(stepIndex).at(actionIndex);

    action?.get('orderType')?.setValue(value);
    action?.get('tradeSymbol')?.setValue('');
    action?.get('orderType')?.markAsTouched();
    action?.get('orderType')?.markAsDirty();

    this.emitRouteUpdate();
  }

  public addMarketplaceAction(stepIndex: number): void {
    const waypoint = this.getOriginWaypointDetails(stepIndex);

    if (!waypoint?.hasMarketplace) {
      return;
    }

    this.addTradeOption(stepIndex);
  }

  public getMarketplaceActionsArray(stepIndex: number): FormArray {
    const step = this.getStepGroup(stepIndex);

    if (!step) {
      return this._formBuilder.array([]);
    }

    const marketplaceActions = step.get('marketplaceActions') as FormArray | null;

    return marketplaceActions || this._formBuilder.array([]);
  }

  private getOriginWaypointDetails(stepIndex: number): StoreWaypointDetails | undefined {
    const originWaypoint = this.getStepGroup(stepIndex)?.get('originWaypoint')?.value ?? '';

    return this.getWaypointDetails(originWaypoint);
  }

  private getDestinationWaypointDetails(stepIndex: number): StoreWaypointDetails | undefined {
    const destinationWaypoint =
      this.getStepGroup(stepIndex)?.get('destinationWaypoint')?.value ?? '';

    return this.getWaypointDetails(destinationWaypoint);
  }

  private getWaypointDetails(waypointSymbol: string): StoreWaypointDetails | undefined {
    if (!waypointSymbol) {
      return undefined;
    }

    const systemSymbol = extractSystemSymbolFromWaypoint(waypointSymbol);
    const system = this.systems().find((item) => item.symbol === systemSymbol);

    return system?.waypoints.find((item) => item.symbol === waypointSymbol);
  }

  private emitRouteUpdate(): void {
    const currentRoute = this.currentRoute();

    if (!currentRoute) {
      return;
    }

    this.updateRoute.emit({
      ...currentRoute,
      name: this.routeForm.controls.routeName.value?.trim() || currentRoute.name,
      steps: this.steps.controls.map((step, index) => this.toRouteStep(step, index)),
    });
  }

  private createStepGroup(originWaypoint: string): FormGroup {
    return this._formBuilder.group({
      originWaypoint: [originWaypoint, Validators.required],
      destinationWaypoint: ['', Validators.required],
      marketplaceActions: this._formBuilder.array([]),
    });
  }

  private createTradeOptionGroup(): FormGroup {
    return this._formBuilder.group({
      tradeSymbol: ['', Validators.required],
      orderType: ['BUY', Validators.required],
      units: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private getStepGroup(stepIndex: number): FormGroup | undefined {
    return this.steps.at(stepIndex) as FormGroup | undefined;
  }

  private toRouteStep(step: AbstractControl, index: number): RouteStep {
    const originWaypoint = step.get('originWaypoint')?.value ?? '';
    const destinationWaypoint = step.get('destinationWaypoint')?.value ?? '';
    const comercialActions = this.toComercialActions(step);

    return {
      index,
      origin: {
        systemSymbol: extractSystemSymbolFromWaypoint(originWaypoint),
        waypointSymbol: originWaypoint,
      },
      destination: {
        systemSymbol: extractSystemSymbolFromWaypoint(destinationWaypoint),
        waypointSymbol: destinationWaypoint,
      },
      comercialActions,
    };
  }

  private toComercialActions(step: AbstractControl): RouteStep['comercialActions'] {
    const marketplaceActions = step.get('marketplaceActions') as FormArray | null;

    if (!marketplaceActions || marketplaceActions.length === 0) {
      return undefined;
    }

    const mappedActions = marketplaceActions.controls
      .map((action) => {
        const rawType = String(action.get('orderType')?.value ?? '')
          .trim()
          .toUpperCase();
        const type: 'BUY' | 'SELL' = rawType === 'SELL' ? 'SELL' : 'BUY';

        const item = String(action.get('tradeSymbol')?.value ?? '')
          .trim()
          .toUpperCase();
        const quantity = Number(action.get('units')?.value ?? 0);

        if (!item || !Number.isFinite(quantity) || quantity <= 0 || !rawType) {
          return null;
        }

        return {
          type,
          item: item as Item,
          quantity,
        };
      })
      .filter((action): action is NonNullable<typeof action> => action !== null);

    return mappedActions.length > 0 ? mappedActions : undefined;
  }

  public get steps(): FormArray {
    return this.routeForm.get('steps') as FormArray;
  }

  public submitRoute(): void {
    this.emitRouteUpdate();
  }
}
