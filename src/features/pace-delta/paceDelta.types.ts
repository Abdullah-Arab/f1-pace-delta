export interface Session {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  year: number;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  session_type: string;
}

export interface Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  team_name?: string;
  i1_speed: number;
  i2_speed: number;
  st_speed: number;
  date_start: string;
  lap_duration: number | null;
  is_pit_out_lap: boolean;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  lap_number: number;
}

export type TeamDelta = {
  team: string;
  fasterDriver: number;
  slowerDriver: number;
  fasterLap: number;
  slowerLap: number;
  delta: number;
};
