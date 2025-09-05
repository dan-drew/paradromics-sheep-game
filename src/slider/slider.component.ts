import {Component, HostListener, input, model, computed} from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  readonly maxValue = input(10)
  readonly value = model(0)
  readonly step = input(1)

  protected readonly percentComplete = computed(() => { return `${this.value() / this.maxValue() * 100}%`; })

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent) {
    event.stopImmediatePropagation();

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left
    const percent = x / rect.width;

    this.value.set(Math.round((this.maxValue() / this.step()) * percent) * this.step());
  }
}
