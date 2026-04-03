import { apiClient } from './client';
import type { Lap, Session, Driver } from '../features/pace-delta/paceDelta.types';

export async function getSessions(params?: Record<string, string | number>): Promise<Session[]> {
  const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '/sessions';
  return apiClient<Session[]>(query.startsWith('/') ? query : `/sessions${query}`);
}

export async function getLaps(sessionKey: number, params?: Record<string, string | number>): Promise<Lap[]> {
  let query = `?session_key=${sessionKey}`;
  if (params) {
    query += `&${new URLSearchParams(params as Record<string, string>).toString()}`;
  }
  return apiClient<Lap[]>(`/laps${query}`);
}

export async function getDrivers(sessionKey: number): Promise<Driver[]> {
  return apiClient<Driver[]>(`/drivers?session_key=${sessionKey}`);
}
