import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Config, defaultBaseConfig, normalModeConfig} from "./offline";

interface GameConfigPreset {
  name: string;
  errors: number;
  latency: number;
}

const PRESETS: GameConfigPreset[] = [
  // { name: 'Normal', latency: 0, errors: 0},
  { name: 'High Delay', latency: normalModeConfig.maxActionLatency, errors: 0 },
  { name: 'High Error', latency: 0, errors: 50 },
]

interface SessionSettings {
  latency: number;
  errorRate: number;
  lookAhead: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  public readonly defaults = Object.freeze(Object.assign({}, defaultBaseConfig, normalModeConfig))
  public readonly config: Config = Object.assign({}, this.defaults);
  public readonly maxLookAhead = 5
  public readonly lookAhead: WritableSignal<number>
  public readonly speed: WritableSignal<number>
  public readonly latency: WritableSignal<number>
  public readonly errorRate: WritableSignal<number>
  public readonly presets = PRESETS

  setPreset(preset: GameConfigPreset) {
    this.latency.set(preset.latency);
    this.errorRate.set(preset.errors);
  }

  constructor() {
    const settings = this.loadSaved()
    this.lookAhead = signal(settings?.lookAhead ?? this.maxLookAhead);
    this.speed = signal(0)
    this.latency = signal(settings?.latency ?? this.config.actionLatency)
    this.errorRate = signal(settings?.errorRate ?? this.config.errorRate)

    effect(() => {
      this.config.actionLatency = this.latency()
      this.config.errorRate = this.errorRate()

      const settings: SessionSettings = {
        latency: this.latency(),
        errorRate: this.errorRate(),
        lookAhead: this.lookAhead()
      }

      sessionStorage.setItem('settings', JSON.stringify(settings));
    })
  }

  private loadSaved(): SessionSettings | null {
    const settingsString = sessionStorage.getItem('settings')
    if (settingsString) {
      try {
        return JSON.parse(settingsString) as SessionSettings;
        // if ('latency' in settings) this.latency.set(settings.latency);
        // if ('errorRate' in settings) this.errorRate.set(settings.errorRate);
        // if ('lookAhead' in settings) this.lookAhead.set(settings.lookAhead);
      } catch {}
    }
    return null
  }
}
