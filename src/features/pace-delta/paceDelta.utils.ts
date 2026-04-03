import type { Lap, TeamDelta } from './paceDelta.types';

export function getFastestLapsByDriver(laps: Lap[]): Lap[] {
  const driverMap = new Map<number, Lap>();

  for (const lap of laps) {
    if (lap.lap_duration === null || lap.is_pit_out_lap) {
      continue;
    }

    const existingLap = driverMap.get(lap.driver_number);
    if (!existingLap || lap.lap_duration < (existingLap.lap_duration as number)) {
      driverMap.set(lap.driver_number, lap);
    }
  }

  return Array.from(driverMap.values());
}

export function groupByTeam(fastestLaps: Lap[]): Record<string, Lap[]> {
  return fastestLaps.reduce((acc, lap) => {
    const team = lap.team_name ?? 'Unknown Team';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(lap);
    return acc;
  }, {} as Record<string, Lap[]>);
}

export function computeTeamDeltas(groupedData: Record<string, Lap[]>): TeamDelta[] {
  const deltas: TeamDelta[] = [];

  for (const [team, laps] of Object.entries(groupedData)) {
    if (laps.length < 2) continue;

    const sortedLaps = [...laps].sort((a, b) => (a.lap_duration as number) - (b.lap_duration as number));
    
    const faster = sortedLaps[0];
    const slower = sortedLaps[1];

    const fasterLapTime = faster.lap_duration as number;
    const slowerLapTime = slower.lap_duration as number;

    deltas.push({
      team,
      fasterDriver: faster.driver_number,
      slowerDriver: slower.driver_number,
      fasterLap: fasterLapTime,
      slowerLap: slowerLapTime,
      delta: slowerLapTime - fasterLapTime,
    });
  }

  return deltas;
}
