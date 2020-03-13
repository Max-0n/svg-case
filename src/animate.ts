// ----------- core of animation ------------- //
export function animate(opts: any): void {
  const el = opts.el || false;
  const start = +new Date();
  const delta = opts.delta || linear;
  const from = opts.from || 0;
  const to =  opts.to || 0;
  //opts.complete = function(){alert(this);};
  if (el) {
    clearInterval(opts.el.timer);
    opts.el.timer = setInterval(() => {
      let progress = (+new Date - start) / opts.duration;

      if (progress > 1) progress = 1;

      opts.step( delta(progress),from,to );

      if (progress == 1) {
        clearInterval(opts.el.timer);
        opts.complete && opts.complete();
      }
    }, opts.delay || 20);
  } else {
    const timer = setInterval(() => {
      let progress = (+new Date - start) / opts.duration;

      if (progress > 1) progress = 1;

      opts.step(delta(progress), from, to);

      if (progress == 1) {
        clearInterval(timer);
        opts.complete && opts.complete();
      }
    }, opts.delay || 15);
  }
}

// ---------------- Delta for animation ---------------- //
function linear(progress: number): number {
  return progress;
}

export function elastic(progress: number): number {
  return Math.pow(2, 15 * (progress-1)) * Math.cos(20*Math.PI*1.5/3*progress)
}

export function quad(progress: number): number {
  return Math.pow(progress, 2)
}

export function makeEaseInOut(delta: any): object {
  return function(progress: number): number {
    if (progress < .5) return delta(2*progress) / 2;
    return (2 - delta(2*(1-progress))) / 2
  }
}

export function makeEaseOut(delta: any, x: number): object {
  return function(progress: number): number {
    return 1 - delta(1 - progress, x)
  }
}

// ------------------ Get random int ------------------ //
export function getRandomInt (min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
