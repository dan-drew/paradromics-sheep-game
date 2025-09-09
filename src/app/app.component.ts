import {Component, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
import {SliderComponent} from "../slider/slider.component";
import {GameComponent} from "../game/game.component";
import {GameConfigService} from "../game/game-config.service";
import {PercentPipe, TitleCasePipe} from "@angular/common";
import {timer} from "rxjs";

@Component({
  selector: 'app-root',
  imports: [
    SliderComponent,
    GameComponent,
    PercentPipe,
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'column'
  }
})
export class AppComponent {
  protected readonly config = inject(GameConfigService);
  readonly playing = signal(false);
  readonly reverseLookAhead = signal(0);
  protected readonly appHasFocus = signal(document.hasFocus());
  readonly showSpeed = false

  title = 'Sheep Game';

  constructor() {
    if (window.location.search.includes('fog=0')) {
      this.config.config.fogDisabled = true
      this.config.config.maxActionLatency = 1000
    }

    ['blur', 'focus'].forEach(effect => {
      window.addEventListener(effect, this)
    })

    effect(() => {
      this.config.lookAhead.set(this.config.maxLookAhead - this.reverseLookAhead())
    });
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
