export interface Bather {
  schedule(fn: () => void): void;
}

export class TimerBather implements Bather {
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

export class MicroTaskBather implements Bather {
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
