import { getSessions, getLaps, getDrivers } from '../../api/openf1';
import type { TeamDelta } from './paceDelta.types';
import { getFastestLapsByDriver, groupByTeam, computeTeamDeltas } from './paceDelta.utils';

export async function getTeammatePaceDelta(): Promise<TeamDelta[]> {
  const sessions = await getSessions({ session_name: 'Qualifying' });
  
  if (!sessions || sessions.length === 0) {
    return [];
  }

  const now = Date.now();
  const pastSessions = [...sessions].filter(
    (s) => new Date(s.date_start).getTime() <= now
  );

  const sortedSessions = pastSessions.sort(
    (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
  );

  // Iterate backwards through sessions until we find one that actually has lap data
  for (const session of sortedSessions) {
    try {
      const sessionKey = session.session_key;

      // Make requests sequentially to avoid immediately triggering the 3 req/sec rate limit
      const laps = await getLaps(sessionKey);
      const drivers = await getDrivers(sessionKey);

      // Add a small artificial delay so tight loop iterations don't bombard the API
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!laps || laps.length === 0 || !drivers || drivers.length === 0) {
        continue; // Skip to the next older session
      }

      // Create a fast lookup for Driver's team names
      const driverTeamMap = new Map<number, string>();
      for (const driver of drivers) {
        driverTeamMap.set(driver.driver_number, driver.team_name);
      }

      // Attach team_name to laps based on driver_number
      const mappedLaps = laps.map(lap => ({
        ...lap,
        team_name: driverTeamMap.get(lap.driver_number) || 'Unknown Team',
      }));

      const fastestLaps = getFastestLapsByDriver(mappedLaps);
      const groupedData = groupByTeam(fastestLaps);
      
      const teamDeltas = computeTeamDeltas(groupedData);

      // If we got valid detlas, return them. Otherwise, continue searching
      if (teamDeltas.length > 0) {
        return teamDeltas;
      }
    } catch (error: any) {
      // Re-throw if it's a 500 or other unexpected error
      throw error;
    }
  }

  return [];
}
