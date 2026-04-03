import { getSessions, getLaps } from '../../api/openf1';
import type { TeamDelta } from './paceDelta.types';
import { getFastestLapsByDriver, groupByTeam, computeTeamDeltas } from './paceDelta.utils';

export async function getTeammatePaceDelta(): Promise<TeamDelta[]> {
  const sessions = await getSessions();
  
  if (!sessions || sessions.length === 0) {
    return [];
  }

  const qualifyingSessions = sessions.filter(
    (s) => s.session_type?.toLowerCase() === 'qualifying' || s.session_name?.toLowerCase() === 'qualifying'
  );

  if (qualifyingSessions.length === 0) {
    return [];
  }

  const sortedSessions = [...qualifyingSessions].sort(
    (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
  );

  const mostRecentSession = sortedSessions[0];
  const laps = await getLaps(mostRecentSession.session_key);

  if (!laps || laps.length === 0) {
    return [];
  }

  const fastestLaps = getFastestLapsByDriver(laps);
  const groupedData = groupByTeam(fastestLaps);
  
  return computeTeamDeltas(groupedData);
}
