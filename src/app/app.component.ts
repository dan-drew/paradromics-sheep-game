import {AfterViewInit, Component, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
import {SliderComponent} from "../slider/slider.component";
import {GameComponent} from "../game/game.component";
import {GameConfigService} from "../game/game-config.service";
import {PercentPipe} from "@angular/common";
import {IS_MOBILE} from "../game/constants";

const INSTRUCTIONS = {
  start: IS_MOBILE  ? 'Tap to start!' : 'Press &uarr; to Start!',
  playing: IS_MOBILE  ? 'Tap to jump' : 'Press &uarr; to Jump or &darr; to Duck',
}

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
  protected readonly config = inject(GameConfigService);
  readonly playing = signal(false);
  readonly reverseLookAhead = signal(this.config.maxLookAhead - this.config.lookAhead());
  protected readonly appHasFocus = signal(document.hasFocus());
  protected readonly instructions = signal(INSTRUCTIONS.start)
  readonly showSpeed = false
  protected readonly iframeSrc?: string
  protected readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');

  title = 'Sheep Game';

  constructor() {
    if (window.location.search.includes('fog=0')) {
      this.config.config.fogDisabled = true
      this.config.config.maxActionLatency = 1000
    }

    if (window.location.search.includes('iframe=1')) {
      this.iframeSrc = `${window.location.protocol}//${window.location.host}`
    }

    ['blur', 'focus'].forEach(effect => {
      window.addEventListener(effect, this)
    })

    effect(() => {
      this.config.lookAhead.set(this.config.maxLookAhead - this.reverseLookAhead())
    });

    effect(() => {
      this.instructions.set(this.playing() ? INSTRUCTIONS.playing : INSTRUCTIONS.start)
    })
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
    }
  }
}
