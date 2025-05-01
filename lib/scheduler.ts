export interface Batcher {
  schedule(fn: () => void): void;
}

export class TimerBatcher implements Batcher {
  private cb = () => {};
  private isScheduled: boolean = false;

  schedule(fn: () => void) {
    this.cb = fn;
    if (!this.isScheduled) {
      setTimeout(() => {
        this.cb();
        this.isScheduled = false;
      });
    }
  }
}

export class MicroTaskBatcher implements Batcher {
  private cb = () => {};
  private isScheduled: boolean = false;

  schedule(fn: () => void) {
    this.cb = fn;
    if (!this.isScheduled) {
      this.isScheduled = true;
      queueMicrotask(() => {
        this.cb();
        this.isScheduled = false;
      });
    }
  }
}
