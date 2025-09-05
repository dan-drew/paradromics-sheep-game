import {Component, inject} from '@angular/core';
import {SliderComponent} from "../slider/slider.component";
import {GameComponent} from "../game/game.component";
import {GameConfigService} from "../game/game-config.service";

@Component({
  selector: 'app-root',
  imports: [
    SliderComponent,
    GameComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'column'
  }
})
export class AppComponent {
  protected readonly config = inject(GameConfigService);

  title = 'Sheep Game';

  constructor() {
    if (window.location.search.includes('fog=0')) {
      this.config.config.fogDisabled = true
      this.config.config.maxActionLatency = 1000
    }
  }
}
