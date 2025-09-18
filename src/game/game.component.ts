import {
  AfterViewInit,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  signal,
  ViewEncapsulation
} from '@angular/core';
import {GameEventType, Runner} from "./offline";
import {DEFAULT_DIMENSIONS} from "./constants";
import {GameConfigService} from "./game-config.service";
import {Subscription, timer} from "rxjs";
import {AppComponent} from "../app/app.component";
import {LoggerService} from "../logger.service";

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements AfterViewInit {
  private readonly app = inject(AppComponent)
  private readonly logger = inject(LoggerService)

  protected readonly config = inject(GameConfigService)
  protected readonly gameWidth = `${DEFAULT_DIMENSIONS.width}px`;
  protected readonly playing = signal(false);
  protected readonly fogWidth = computed(
    () => {
      if (this.playing()) {
        return `${(1 - (this.config.lookAhead() / this.config.maxLookAhead)) * 50}%`;
      } else {
        return '0'
      }
    }
  )
  protected readonly pageWidth = signal(window.visualViewport!.width)
  protected readonly gameScale = computed(() => {
    const scale = this.pageWidth() / DEFAULT_DIMENSIONS.width;
    return Math.min(1, scale).toFixed(2)
  })
  protected readonly flashError = signal(false);
  private runner?: Runner;
  private resizeObserver?: ResizeObserver;
  private resizeTimer?: Subscription;

  constructor() {
    effect(() => {
      this.runner?.updateConfigSetting('speed', this.config.speed() + this.config.defaults.speed)
    })
    effect(() => {
      this.app.playing.set(this.playing())
    })

    this.resizeObserver = new ResizeObserver(() => this.onResize())
    this.resizeObserver.observe(document.body)
  }

  private onResize() {
    if (!this.resizeTimer) {
      this.resizeTimer = timer(100).subscribe(() => {
        delete this.resizeTimer
        this.pageWidth.set(window.visualViewport!.width);
      })
    }
  }

  ngAfterViewInit() {
    // Initialize after view to make sure width is set before
    // the game runner tests dimensions
    this.runner = Runner.initializeInstance('#gameContainer', this.logger, this.config.config)
  }

  trigger(event: GameEventType) {
    this.runner?.trigger(event)
  }

  @HostListener('game-playing')
  private onGamePlaying() {
    this.playing.set(true)
  }

  @HostListener('game-stopped')
  private onGameStopped() {
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
