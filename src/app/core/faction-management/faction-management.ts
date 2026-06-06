export type FactionSymbol =
  | 'AEGIS'
  | 'ANCIENTS'
  | 'ASTRO'
  | 'COBALT'
  | 'CORSAIRS'
  | 'CULT'
  | 'COSMIC'
  | 'DOMINION'
  | 'ECHO'
  | 'ETHEREAL'
  | 'GALACTIC'
  | 'LORDS'
  | 'OBSIDIAN'
  | 'OMEGA'
  | 'QUANTUM'
  | 'SHADOW'
  | 'SOLITARY'
  | 'UNITED'
  | 'VOID';

export const FACTION_NAMES: Record<FactionSymbol, string> = {
  AEGIS: 'Aegis Collective',
  ANCIENTS: 'Ancient Guardians',
  ASTRO: 'Astro-Salvage Alliance',
  COBALT: 'Cobalt Traders Alliance',
  CORSAIRS: 'Seventh Space Corsairs',
  CULT: 'Cult of the Machine',
  COSMIC: 'Cosmic Engineers',
  DOMINION: 'Stellar Dominion',
  ECHO: 'Echo Technological Conclave',
  ETHEREAL: 'Ethereal Enclave',
  GALACTIC: 'Galactic Alliance',
  LORDS: 'Lords of the Void',
  OBSIDIAN: 'Obsidian Syndicate',
  OMEGA: 'Omega Star Network',
  QUANTUM: 'Quantum Federation',
  SHADOW: 'Shadow Stalkers',
  SOLITARY: 'Solitary Systems Alliance',
  UNITED: 'United Independent Settlements',
  VOID: 'Voidfarers',
};
