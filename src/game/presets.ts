import {normalModeConfig} from "./offline";

export interface GameConfigPreset {
  name: string;
  errors: number;
  latency: number;
}

export const PRESETS: readonly GameConfigPreset[] = [
  // { name: 'Normal', latency: 0, errors: 0},
  {name: 'High Delay', latency: normalModeConfig.maxActionLatency, errors: 0},
  {name: 'High Error', latency: 0, errors: 50},
]
