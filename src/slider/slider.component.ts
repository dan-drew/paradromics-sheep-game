import {Component, HostListener, input, model, computed} from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  host: {
    class: 'hover-shadow',
    '[class.disabled]': 'disabled()'
  }
})
export class SliderComponent {
  readonly maxValue = input(10)
  readonly value = model(0)
  readonly step = input(1)
  readonly disabled = input(false)

  protected readonly percentComplete = computed(() => { return `${this.value() / this.maxValue() * 100}%`; })

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent) {
    event.preventDefault()
    event.stopImmediatePropagation();

    if (this.disabled()) {
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))

    this.value.set(Math.round((this.maxValue() / this.step()) * percent) * this.step());
  }
}
