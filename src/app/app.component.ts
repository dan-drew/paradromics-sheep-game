import {AfterViewInit, Component, effect, ElementRef, inject, NgZone, signal, viewChild} from '@angular/core';
import {SliderComponent} from "../slider/slider.component";
import {GameComponent} from "../game/game.component";
import {GameConfigService} from "../game/game-config.service";
import {PercentPipe} from "@angular/common";
import {IS_EXPERIMENTAL, IS_MOBILE, URL_PARAMS} from "../game/constants";
import {GameEventType} from "../game/offline";
import {LoggerService} from "../logger.service";

const INSTRUCTIONS = {
  start: IS_MOBILE  ? 'Tap to start!' : 'Press &uarr; to Start!',
  playing: IS_MOBILE  ? 'Tap to jump' : 'Press &uarr; to Jump or &darr; to Duck',
}

type WindowEvent = string | { event: string, passive: boolean }

// Window events to listen to
const WINDOW_EVENTS: WindowEvent[] = [
  'blur',
  'focus',
  { event: 'keydown', passive: false },
  { event: 'keyup', passive: false },
  { event: 'keypress', passive: false },
]

@Component({
  selector: 'app-root',
  imports: [
    SliderComponent,
    GameComponent,
    PercentPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'column',
    '[class.iframe]': 'iframeSrc'
  }
})
export class AppComponent implements AfterViewInit {
  private readonly logger = inject(LoggerService);
  protected readonly config = inject(GameConfigService);
  readonly playing = signal(false);
  readonly reverseLookAhead = signal(this.config.maxLookAhead - this.config.lookAhead());
  protected readonly appHasFocus = signal(document.hasFocus());
  protected readonly instructions = signal(INSTRUCTIONS.start)
  readonly showSpeed = false
  readonly experimental = IS_EXPERIMENTAL
  protected readonly mobile = IS_MOBILE;
  protected readonly iframeSrc?: string
  protected readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');
  private readonly game = viewChild(GameComponent);
  private readonly elementRef = inject(ElementRef);

  title = 'Sheep Game';

  constructor() {
    // Handle iframe test mode
    if (URL_PARAMS.get('iframe') === '1') {
      const iframeParams = new URLSearchParams(URL_PARAMS)
      iframeParams.delete('iframe');
      const search = iframeParams.size > 0 ? `?${iframeParams}` : ''
      this.iframeSrc = `${window.location.protocol}//${window.location.host}${search}`
    } else {
      // Hide visibility options
      if (URL_PARAMS.get('fog') === '0') {
        this.config.config.fogDisabled = true
        this.config.config.maxActionLatency = 1000
      }

      // Register for window events
      if (!this.iframeSrc) {
        WINDOW_EVENTS.forEach((event: WindowEvent) => {
          if (typeof event === 'string') {
            window.addEventListener(event, this)
          } else {
            window.addEventListener(event.event, this, {passive: event.passive})
          }
        })
      }

      // Dynamic updates
      effect(() => {
        this.config.lookAhead.set(this.config.maxLookAhead - this.reverseLookAhead())
      });

      effect(() => {
        this.instructions.set(this.playing() ? INSTRUCTIONS.playing : INSTRUCTIONS.start)
      })
    }
  }

  ngAfterViewInit() {
    if (this.iframe()) {
      this.iframe()!.nativeElement.src = this.iframeSrc!;
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case 'blur':
        this.appHasFocus.set(false);
        break
      case 'focus':
        this.appHasFocus.set(true);
        break
      case 'keydown':
      case 'keypress':
      case 'keyup':
        const key = (event as KeyboardEvent).key;
        if (this.appHasFocus() && key.startsWith('Arrow')) {
          event.preventDefault()
          event.stopImmediatePropagation()
        }
        break
    }
  }

  protected onButtonEvent(e: Event, gameEvent: string) {
    // e.preventDefault();
    e.stopImmediatePropagation()

    this.game()?.trigger(gameEvent as GameEventType)
  }

  protected onFullScreen() {
    this.elementRef.nativeElement.requestFullscreen().then(() => {
      if ('lock' in screen.orientation) {
        //@ts-ignore
        screen.orientation.lock('landscape-primary').then(() => {
          this.logger.info('Orientation locked');
        }).catch((e: Error) => {
          this.logger.error('Orientation lock failed', e);
        })
      } else {
        this.logger.info('Orientation lock not supported');
      }
    })
  }
}
