import { apiClient } from './client';
import type { Lap, Session } from '../features/pace-delta/paceDelta.types';

export async function getSessions(): Promise<Session[]> {
  return apiClient<Session[]>('/sessions');
}

export async function getLaps(sessionKey: number): Promise<Lap[]> {
  return apiClient<Lap[]>(`/laps?session_key=${sessionKey}`);
}
