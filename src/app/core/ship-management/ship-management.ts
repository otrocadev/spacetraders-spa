import { WaypointType } from '../route-management/route-management';
import { Deposit, Item } from '../shared/shared.models';

export type ShipStatus = 'IN_TRANSIT' | 'IN_ORBIT' | 'DOCKED';
export type ShipFlightmode = 'DRIFT' | 'STEALTH' | 'CRUISE' | 'BURN';
export type ShipRole =
  | 'ABRICATOR'
  | 'HARVESTER'
  | 'HAULER'
  | 'INTERCEPTOR'
  | 'EXCAVATOR'
  | 'TRANSPORT'
  | 'REPAIR'
  | 'SURVEYOR'
  | 'COMMAND'
  | 'CARRIER'
  | 'PATROL'
  | 'SATELLITE'
  | 'EXPLORER'
  | 'REFINERY';

export type ShipFrameSymbol =
  | 'FRAME_PROBE'
  | 'FRAME_DRONE'
  | 'FRAME_INTERCEPTOR'
  | 'FRAME_RACER'
  | 'FRAME_FIGHTER'
  | 'FRAME_FRIGATE'
  | 'FRAME_SHUTTLE'
  | 'FRAME_EXPLORER'
  | 'FRAME_MINER'
  | 'FRAME_LIGHT_FREIGHTER'
  | 'FRAME_HEAVY_FREIGHTER'
  | 'FRAME_TRANSPORT'
  | 'FRAME_DESTROYER'
  | 'FRAME_CRUISER'
  | 'FRAME_CARRIER'
  | 'FRAME_BULK_FREIGHTER';

export type ShipReactorSymbol =
  | 'REACTOR_SOLAR_I'
  | 'REACTOR_FUSION_I'
  | 'REACTOR_FISSION_I'
  | 'REACTOR_CHEMICAL_I'
  | 'REACTOR_ANTIMATTER_I';

export type ShipEngineSymbol =
  | 'ENGINE_IMPULSE_DRIVE_I'
  | 'ENGINE_ION_DRIVE_I'
  | 'ENGINE_ION_DRIVE_II'
  | 'ENGINE_HYPER_DRIVE_I';

export type ShipModuleSymbol =
  | 'MODULE_MINERAL_PROCESSOR_I'
  | 'MODULE_GAS_PROCESSOR_I'
  | 'MODULE_CARGO_HOLD_I'
  | 'MODULE_CARGO_HOLD_II'
  | 'MODULE_CARGO_HOLD_III'
  | 'MODULE_CREW_QUARTERS_I'
  | 'MODULE_ENVOY_QUARTERS_I'
  | 'MODULE_PASSENGER_CABIN_I'
  | 'MODULE_MICRO_REFINERY_I'
  | 'MODULE_ORE_REFINERY_I'
  | 'MODULE_FUEL_REFINERY_I'
  | 'MODULE_SCIENCE_LAB_I'
  | 'MODULE_JUMP_DRIVE_I'
  | 'MODULE_JUMP_DRIVE_II'
  | 'MODULE_JUMP_DRIVE_III'
  | 'MODULE_WARP_DRIVE_I'
  | 'MODULE_WARP_DRIVE_II'
  | 'MODULE_WARP_DRIVE_III'
  | 'MODULE_SHIELD_GENERATOR_I'
  | 'MODULE_SHIELD_GENERATOR_II';

export type ShipMountSymbol =
  | 'MOUNT_GAS_SIPHON_I'
  | 'MOUNT_GAS_SIPHON_II'
  | 'MOUNT_GAS_SIPHON_III'
  | 'MOUNT_SURVEYOR_I'
  | 'MOUNT_SURVEYOR_II'
  | 'MOUNT_SURVEYOR_III'
  | 'MOUNT_SENSOR_ARRAY_I'
  | 'MOUNT_SENSOR_ARRAY_II'
  | 'MOUNT_SENSOR_ARRAY_III'
  | 'MOUNT_MINING_LASER_I'
  | 'MOUNT_MINING_LASER_II'
  | 'MOUNT_MINING_LASER_III'
  | 'MOUNT_LASER_CANNON_I'
  | 'MOUNT_MISSILE_LAUNCHER_I'
  | 'MOUNT_TURRET_I';

export interface ShipListAPIResponse {
  data: ShipDetails[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ShipDetails {
  symbol: string;
  registration: ShipRegistration;
  nav: ShipNavigation;
  crew: ShipCrew;
  frame: ShipFrame;
  reactor: ShipReactor;
  engine: ShipEngine;
  modules: ShipModule[];
  mounts: ShipMount[];
  cargo: ShipCargo;
  fuel: ShipFuel;
  cooldown: ShipCooldown;
}

export interface ShipRegistration {
  name: string;
  factionSymbol: string;
  role: ShipRole;
}

export interface ShipNavigation {
  systemSymbol: string;
  waypointSymbol: string;
  route: ShipRoute;
  status: ShipStatus;
  flightMode: ShipFlightmode;
}

export interface ShipRoute {
  destination: Waypoint;
  origin: Waypoint;
  departureTime: string;
  arrival: string;
}

export interface Waypoint {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
}

export interface ShipCrew {
  current: number;
  required: number;
  capacity: number;
  rotation: string;
  morale: number;
  wages: number;
}

export interface ShipFrame {
  symbol: ShipFrameSymbol;
  name: string;
  condition: number; // 0 to 1
  integrity: number; // 0 to 1
  description: string;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  requirements: {
    power: number;
    crew: number;
  };
  quality: number; // 0 to 5
}

export interface ShipReactor {
  symbol: ShipReactorSymbol;
  name: string;
  condition: number; // 0 to 1
  integrity: number; // 0 to 1
  description: string;
  powerOutput: number;
  requirements: {
    crew: number;
  };
  quality: number; // 0 to 5
}

export interface ShipEngine {
  symbol: ShipEngineSymbol;
  name: string;
  condition: number; // 0 to 1
  integrity: number; // 0 to 1
  description: string;
  speed: number;
  requirements: {
    power: number;
    crew: number;
  };
  quality: number; // 0 to 5
}

export interface ShipModule {
  symbol: ShipModuleSymbol;
  name: string;
  description: string;
  requirements: {
    power: number;
    crew: number;
    slots: number;
  };
  capacity?: number; // Only f    or cargo hold modules
}

export interface ShipMount {
  symbol: ShipMountSymbol;
  name: string;
  description: string;
  requirements: {
    power: number;
    crew: number;
  };
  strength: number;
  deposits?: Deposit[]; // Only for surveyor mounts
}

export interface ShipCargo {
  capacity: number;
  units: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  symbol: Item;
  name: string;
  description: string;
  units: number;
}

export interface ShipFuel {
  current: number;
  capacity: number;
  consumed: {
    amount: number;
    timestamp: string;
  };
}

export interface ShipCooldown {
  shipSymbol: string;
  totalSeconds: number;
  remainingSeconds: number;
}
