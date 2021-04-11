import {
  AnimateElement,
  getRandomInt,
  animate,
  makeEaseInOut,
  makeEaseOut,
  elastic,
  quad
} from './animate';

interface Share {
  value: number;
  price: number;
  symbol: string;
  tag?: number;
  color?: string;
  link?: string;
  path?: SVGPathElement;
}

export default function (htmlElement: HTMLElement, payload: any) {
  const spanArr: SVGTextElement[] = new Array();
  const textArr: SVGTextElement[] = new Array();
  const rand: number = getRandomInt(90, 360);
  const svg: HTMLElement = htmlElement;
  if (!svg.getAttribute('viewBox')) { throw new Error('Not found "viewBox" property of svgElement'); }
  const svgWidth: number = +svg.getAttribute('viewBox').split(' ')[2];
  const svgHeight: number = +svg.getAttribute('viewBox').split(' ')[3];
  const R: number = 170;
  const STEP = 20;
  const COLORS: Array<number> = [190];
  let angleVal: number = 0;
  let stocks: any = payload;
  // Вычисляем капитал + Округление до сотых
  let capital: number = 0;

  if (Object.keys(stocks).length) {
    capital = (Object.values(stocks).reduce(
      (accumulator: number, share: Share) => accumulator + share.value * share.price, 0
    )) as number;
  }

  // capital = stocks.reduce((accumulator, share) => accumulator + share.value * share.price, 0);
  capital = Math.round(capital * 100) / 100;

  // Заполняем недостающие промежуточные цвета
  Object.values(stocks).forEach((share: Share, index: number, array: Share[]) => {
    const delta: number = index / array.length;
    // Get Random HSL color
    const color: number = COLORS[Math.floor(Math.random() * 100 % COLORS.length)];
    share.color = `hsl(${color}deg 67% ${35 + (STEP * delta)}%)`;
    return share;
  });

  // Функция постоения дуг.
  const makeArc = (value: number, rad: number, makeAngle: number): string => {
    const alpha: number = 3.6 * (value / (capital / 100));
    const angle: number = 360 / capital * (makeAngle);
    const a: number = (rand - angle - alpha) * Math.PI / 180;
    const b: number = (rand - angle) * Math.PI / 180;
    const sx: number = svgWidth / 2 + rad * Math.cos(b);
    const sy: number = svgHeight / 2 - rad * Math.sin(b);
    const x: number = svgWidth / 2 + rad * Math.cos(a);
    const y: number = svgHeight / 2 - rad * Math.sin(a);
    const path: string = 'M ' + sx + ',' + sy + ' A ' + rad + ',' + rad + ' 0 ' + (+(alpha > 180)) + ' 1 ' + x + ',' + y;
    return path;
  };

  Object.values(stocks).forEach((share: Share) => {
    // Фиксируем угол сдвига элемента
    const angle = angleVal;

    // создаём дугу
    share.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    share.path.setAttribute('stroke-width', '10px');
    share.path.setAttribute('stroke', share.color);
    share.path.setAttribute('fill', 'none');
    share.path.setAttribute('d', makeArc(0, 90, 0));
    if ('link' in share) {
      share.path.setAttribute('style', 'cursor: pointer');
      // при клике...
      share.path.onclick = (): void => {
        window.open(share.link, '_blank');
      };
    }
    svg.appendChild(share.path);

    // анимированно замкнуть кольцо
    animate(<AnimateElement>{
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        share.path.setAttribute('d', makeArc(delta * share.value * share.price, (delta * (R - 90)) + 90, delta * angle));
      }
    });

    // анимированно увеличить ширину элементов
    animate({
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        share.path.setAttribute('stroke-width', (delta * 100) + 'px');
      }
    } as AnimateElement);

    // при наведении...
    share.path.onmouseover = (): void => {
      svg.removeChild(textArr[0]);
      spanArr[2].textContent = share.symbol;
      spanArr[3].textContent = `${capital / 100 * share.price}`;
      spanArr[4].textContent = `$${(share.value * share.price).toLocaleString('en')} `;
      svg.appendChild(textArr[1]);

      animate(<AnimateElement>{
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          share.path.setAttribute('stroke-width', (delta * (140 - 100) + 100) + 'px');
          share.path.setAttribute('opacity', String(delta * (0.4 - 1) + 1));
        }
      });
    };

    // при отводе...
    share.path.onmouseout = (): void => {
      svg.removeChild(textArr[1]);
      spanArr[0].textContent = 'Capital';
      spanArr[1].textContent = '$' + capital.toLocaleString('en');
      svg.appendChild(textArr[0]);
      animate(<AnimateElement>{
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          share.path.setAttribute('stroke-width', (delta * (100 - 140) + 140) + 'px');
          share.path.setAttribute('opacity', String(delta * (1 - 0.4) + 0.4));
        }
      });
    };

    // Переменная отступа от начала координат
    angleVal += share.value * share.price;
  });

  // Блоки с текстом
  for (let span: number = 0; span < 5; span++) {
    if (span < 2) {
      // создаём текстовые блоки (в которых будут строки «tspan»)
      textArr[span] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textArr[span].setAttribute('text-anchor', 'middle');
      textArr[span].setAttribute('font-family', 'Helvetica');
      textArr[span].setAttribute('opacity', '1');
      textArr[span].setAttribute('stroke-width', '0');
      textArr[span].setAttribute('text-rendering', 'geometricPrecision');

      // 2 строки при отводе мышкой...
      spanArr[span] = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      spanArr[span].setAttribute('x', `${svgWidth / 2}`);
      spanArr[span].setAttribute('dy', '50');

      if (span === 0) {
        textArr[span].setAttribute('font-size', '40');
        textArr[span].setAttribute('font-weight', 'bold');
        textArr[span].setAttribute('y', '190');
        spanArr[0].textContent = 'Total';
      }

      if (span === 1) {
        textArr[span].setAttribute('font-size', '22');
        textArr[span].setAttribute('font-weight', 'none');
        textArr[span].setAttribute('y', '200');
        spanArr[1].textContent = '$' + capital.toLocaleString('en');
      }
      textArr[0].appendChild(spanArr[span]);
      svg.appendChild(textArr[span]);
    }

    // 3 строки при наведении мышкой...
    if (span >= 2) {
      spanArr[span] = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      spanArr[span].setAttribute('x', `${svgWidth / 2}`);
      spanArr[span].setAttribute('dy', '30');
      textArr[1].appendChild(spanArr[span]);
    }
  }
}
