import { Item } from '../shared/shared.models';

export type WaypointType =
  | 'PLANET'
  | 'GAS_GIANT'
  | 'MOON'
  | 'ORBITAL_STATION'
  | 'JUMP_GATE'
  | 'ASTEROID_FIELD'
  | 'ASTEROID'
  | 'ENGINEERED_ASTEROID'
  | 'ASTEROID_BASE'
  | 'NEBULA'
  | 'DEBRIS_FIELD'
  | 'GRAVITY_WELL'
  | 'ARTIFICIAL_GRAVITY_WELL'
  | 'FUEL_STATION';

export type WaypointModifier =
  | 'STRIPPED'
  | 'UNSTABLE'
  | 'RADIATION_LEAK'
  | 'CRITICAL_LIMIT'
  | 'CIVIL_UNREST';

export type WaypointTrait =
  | 'UNCHARTED'
  | 'UNDER_CONSTRUCTION'
  | 'MARKETPLACE'
  | 'SHIPYARD'
  | 'OUTPOST'
  | 'SCATTERED_SETTLEMENTS'
  | 'SPRAWLING_CITIES'
  | 'MEGA_STRUCTURES'
  | 'PIRATE_BASE'
  | 'OVERCROWDED'
  | 'HIGH_TECH'
  | 'CORRUPT'
  | 'BUREAUCRATIC'
  | 'TRADING_HUB'
  | 'INDUSTRIAL'
  | 'BLACK_MARKET'
  | 'RESEARCH_FACILITY'
  | 'MILITARY_BASE'
  | 'SURVEILLANCE_OUTPOST'
  | 'EXPLORATION_OUTPOST'
  | 'MINERAL_DEPOSITS'
  | 'COMMON_METAL_DEPOSITS'
  | 'PRECIOUS_METAL_DEPOSITS'
  | 'RARE_METAL_DEPOSITS'
  | 'METHANE_POOLS'
  | 'ICE_CRYSTALS'
  | 'EXPLOSIVE_GASES'
  | 'STRONG_MAGNETOSPHERE'
  | 'VIBRANT_AURORAS'
  | 'SALT_FLATS'
  | 'CANYONS'
  | 'PERPETUAL_DAYLIGHT'
  | 'PERPETUAL_OVERCAST'
  | 'DRY_SEABEDS'
  | 'MAGMA_SEAS'
  | 'SUPERVOLCANOES'
  | 'ASH_CLOUDS'
  | 'VAST_RUINS'
  | 'MUTATED_FLORA'
  | 'TERRAFORMED'
  | 'EXTREME_TEMPERATURES'
  | 'EXTREME_PRESSURE'
  | 'DIVERSE_LIFE'
  | 'SCARCE_LIFE'
  | 'FOSSILS'
  | 'WEAK_GRAVITY'
  | 'STRONG_GRAVITY'
  | 'CRUSHING_GRAVITY'
  | 'TOXIC_ATMOSPHERE'
  | 'CORROSIVE_ATMOSPHERE'
  | 'BREATHABLE_ATMOSPHERE'
  | 'THIN_ATMOSPHERE'
  | 'JOVIAN'
  | 'ROCKY'
  | 'VOLCANIC'
  | 'FROZEN'
  | 'SWAMP'
  | 'BARREN'
  | 'TEMPERATE'
  | 'JUNGLE'
  | 'OCEAN'
  | 'RADIOACTIVE'
  | 'MICRO_GRAVITY_ANOMALIES'
  | 'DEBRIS_CLUSTER'
  | 'DEEP_CRATERS'
  | 'SHALLOW_CRATERS'
  | 'UNSTABLE_COMPOSITION'
  | 'HOLLOWED_INTERIOR'
  | 'STRIPPED';

export type TradeGoodType = 'IMPORT' | 'EXPORT' | 'EXCHANGE';

export interface RouteDetails {
  id: string;
  name?: string;
  shipSymbol?: string; // de momento no se asocia a una nave, pero queda para si se hace
  virtualInvertoryCapacity: number; // cuando se selecione la nave asignara la que tenga esa nave
  virtualInventory: RouteInventoryItem[];
  steps: RouteStep[];
}

export interface RouteStep {
  index: number;
  origin: { systemSymbol: string; waypointSymbol: string };
  destination: { systemSymbol: string; waypointSymbol: string };
  comercialActions?: ComercialAction[];
}

interface ComercialAction {
  type: 'BUY' | 'SELL';
  item: Item;
  quantity: number;
}

export interface RouteInventoryItem {
  symbol: Item;
  name: string;
  quantity: number;
}

export interface StoreSystemDetails {
  symbol: string;
  waypoints: StoreWaypointDetails[];
}

export interface StoreWaypointDetails {
  symbol: string;
  type: WaypointType;
  x: number;
  y: number;
  jumpGate: boolean;
  hasMarketplace: boolean;
  marketplace?: StoreMarketplaceDetails;
}

export interface StoreMarketplaceDetails {
  imports: StoreMarketGoodDetails[];
  exports: StoreMarketGoodDetails[];
}

export interface StoreMarketGoodDetails {
  symbol: Item;
  name: string;
  type: TradeGoodType;
  tradeVolume: number;
}

export interface MarketGoodDetailsResponse {
  symbol: Item;
  name: string;
  description: string;
}

export interface MarketDetailsResponse {
  data: {
    symbol: string;
    imports: MarketGoodDetailsResponse[];
    exports: MarketGoodDetailsResponse[];
    exchange: MarketGoodDetailsResponse[];
  };
}

export interface ListSystemWaypointsResponse {
  data: WaypointDetails[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface WaypointDetails {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
  orbitals: { symbol: string }[];
  orbits?: string;
  faction?: {
    symbol: string;
  };
  traits: WaypointTraits[];
  modifiers?: WaypointModifiers[];
  chart?: ChartDetails;
  isUnderConstruction: boolean;
}

export interface WaypointTraits {
  symbol: WaypointTrait;
  name: string;
  description: string;
}

export interface WaypointModifiers {
  symbol: WaypointModifier;
  name: string;
  description: string;
}

export interface ChartDetails {
  waypointSymbol: string;
  submittedBy: string;
  submittedOn: string;
}
