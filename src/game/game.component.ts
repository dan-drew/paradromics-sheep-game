import {Component, computed, HostListener, inject, OnInit, signal, effect} from '@angular/core';
import {Runner} from "./offline";
import {DEFAULT_DIMENSIONS} from "./constants";
import {GameConfigService} from "./game-config.service";
import {timer} from "rxjs";

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  protected readonly config = inject(GameConfigService)
  protected readonly gameWidth = `${DEFAULT_DIMENSIONS.width}px`;
  protected readonly playing = signal(false);
  protected readonly lookAheadWidth = computed(() => this.playing() ? `${this.config.lookAhead() * 10}%` : '0')
  protected readonly flashError = signal(false);
  private runner?: Runner;

  constructor() {
    effect(() => {
      this.runner?.updateConfigSetting('speed', this.config.speed() + this.config.defaults.speed)
    })
  }

  ngOnInit() {
    this.runner = Runner.initializeInstance('#gameContainer', this.config.config)
  }

  @HostListener('game-playing')
  private onPlaying() {
    this.playing.set(true)
  }

  @HostListener('game-stopped')
  private onStopped() {
    this.playing.set(false)
  }

  @HostListener('game-error')
  private onGameError() {
    this.flashBorder()
  }

  protected flashBorder() {
    this.flashError.set(true)
    timer(500).subscribe(() => {
      this.flashError.set(false)
    });
  }
}
