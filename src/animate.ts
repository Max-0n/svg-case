export interface AnimateElement {
  duration: number,
  delta: any,
  from?: number,
  to?: number,
  step: any
}

// ----------- core of animation ------------- //
export function animate(opts: AnimateElement): void {
  const start = Date.now();
  const from = opts.from || 0;
  const to =  opts.to || 100;
  loop();

  function loop() {
    const delta = opts.delta || linear;
    let progress = (Date.now() - start) / opts.duration;
    if (progress > 1) {
      progress = 1;
      return;
    }
    opts.step(delta(progress), from, to);
    requestAnimationFrame(loop);
  }
}

// ---------------- Delta for animation ---------------- //
function linear(progress: number): number {
  return progress;
}

export function elastic(progress: number): number {
  return Math.pow(2, (progress - 1) * 15) * Math.cos(Math.PI * 20 * 1.5 / 3 * progress);
}

export function quad(progress: number): number {
  return Math.pow(progress, 2);
}

export function makeEaseInOut(delta: any): object {
  return function(progress: number): number {
    if (progress < .5) { return delta(progress * 2) / 2; }
    return (2 - delta((1 - progress) * 2)) / 2;
  };
}

export function makeEaseOut(delta: any, x: number): object {
  return function(progress: number): number {
    return 1 - delta(1 - progress, x);
  };
}

// ------------------ Get random int ------------------ //
export function getRandomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
