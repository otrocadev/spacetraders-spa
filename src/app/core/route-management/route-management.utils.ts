/**
 * Extracts system symbol from a waypoint symbol.
 * Example: "X1-YP72-A1" -> "X1-YP72"
 */
export function extractSystemSymbolFromWaypoint(waypointSymbol: string): string {
  const parts = waypointSymbol.split('-');
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : waypointSymbol;
}
