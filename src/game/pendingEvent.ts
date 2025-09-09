import {Observable, Subscription, timer} from "rxjs";

export class PendingEvent {
  readonly id: string
  readonly event: Event
  readonly timer: Observable<any>
  private subscription?: Subscription

  constructor(event: Event, delay: number, callback: (event: Event) => void) {
    this.id = crypto.randomUUID()
    this.event = event
    this.timer = timer(delay)
    this.subscription = this.timer.subscribe(() => {
      delete this.subscription
      callback(event)
    })
  }

  cancel() {
    this.subscription?.unsubscribe()
    delete this.subscription
  }
}

export class PendingEvents {
  private pendingEvents: {[key: string]: PendingEvent} = {}

  add(pending: PendingEvent) {
    this.pendingEvents[pending.id] = pending
    pending.timer.subscribe(() => {
      this.remove(pending)
    })
  }

  remove(pending: PendingEvent) {
    delete this.pendingEvents[pending.id]
  }

  cancelAll() {
    Object.entries(this.pendingEvents).forEach(([id, pendingEvent]) => {
      this.remove(pendingEvent)
      pendingEvent.cancel()
    })
  }
}