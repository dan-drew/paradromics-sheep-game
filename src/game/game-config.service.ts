import {Injectable, signal} from '@angular/core';
import {Config, defaultBaseConfig, normalModeConfig} from "./offline";

interface GameConfigPreset {
  errors: number;
  latency: number;
}

interface GameConfigPresets {
  normal: GameConfigPreset
  latency: GameConfigPreset
  errors: GameConfigPreset
}

const PRESETS: GameConfigPresets = {
  normal: { latency: 0, errors: 0},
  latency: { latency: normalModeConfig.maxActionLatency, errors: 0 },
  errors: { latency: 0, errors: 50 },
}

type GameConfigPresetName = keyof GameConfigPresets;

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  public readonly defaults = Object.freeze(Object.assign({}, defaultBaseConfig, normalModeConfig))
  public readonly config: Config = Object.assign({}, this.defaults);
  public readonly maxLookAhead = 5
  public readonly lookAhead = signal(this.maxLookAhead);
  public readonly speed = signal(0)
  public readonly presetNames: readonly GameConfigPresetName[] = ['normal', 'latency', 'errors'];

  setPreset(presetName: GameConfigPresetName) {
    const preset: GameConfigPreset = PRESETS[presetName];
    this.config.actionLatency = preset.latency;
    this.config.errorRate = preset.errors;
  }
}
