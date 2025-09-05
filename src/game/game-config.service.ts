import {Injectable, signal} from '@angular/core';
import {Config, defaultBaseConfig, normalModeConfig} from "./offline";

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  public readonly defaults = Object.freeze(Object.assign({}, defaultBaseConfig, normalModeConfig))
  public readonly config: Config = Object.assign({}, this.defaults);
  public readonly lookAhead = signal(0)
  public readonly speed = signal(0)
}
