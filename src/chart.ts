import { getRandomInt, animate, makeEaseInOut, makeEaseOut, elastic, quad } from './animate';

export default function (htmlElement: HTMLElement) {
  const spanArr: SVGTextElement[] = new Array();
  const textArr: SVGTextElement[] = new Array();
  const rand: number = getRandomInt(90, 360);
  const svg: HTMLElement = htmlElement;
  if (!svg.getAttribute('viewBox')) { throw new Error('Not found "viewBox" property of svgElement'); }
  const svgWidth: number = +svg.getAttribute('viewBox').split(' ')[2];
  const svgHeight: number = +svg.getAttribute('viewBox').split(' ')[3]                                        ;
  const R: number = 170;
  let angleVal: number = 0;
  let capital: number;
  let valArray: [string, number, string, string, string][] = [
    ['Stock', 10, '#4dde5e', '', 'Moscow'],
    ['Stock', 10, '', '', 'Sochi'],
    ['Stock', 10, '', '', 'Bank 1'],
    ['Stock', 10, '', '', 'Bank 2'],
    ['Stock', 10, '#79ec87', '', 'Bank 3'],
    ['Stock2', 10, '#fc8f30', '', 'Berlin'],
    ['Stock2', 10, '', '', 'Bank 1'],
    ['Stock2', 10, '', '', 'Bank 2'],
    ['Stock2', 10, '', '', 'Bank 3'],
    ['Stock2', 10, '#fcd053', '', 'Bank 4'],
    ['Stock4', 10, '#75c6de', '', 'Pekin'],
    ['Stock4', 10, '', '', 'Bank 1'],
    ['Stock4', 10, '', '', 'Bank 2'],
    ['Stock4', 10, '', '', 'Bank 3'],
    ['Stock4', 10, '#95e9fd', '', 'Bank 4']
  ];

  // Заполняем недостающие промежуточные цвета
  valArray = valArray.map(
    (
      element: [string, number, string, string, string],
      index: number,
      array: [string, number, string, string, string][]
    ) => {

    // если цвет отсутствует
    if (!element[2]) {
      const fromRGB: string = array[index - 1][2];
      let toRGB: string = '';
      let step: number = 0;

      // ищем следующий известный RGB
      while (toRGB.length < 6) {
        step++;
        if (array[index + step][2]) {
          toRGB = array[index + step][2];
          step++;
        }
      }

      // шаг для каждого цвета
      const toR: number = parseInt(toRGB.substr(1, 2), 16);
      const toG: number = parseInt(toRGB.substr(3, 2), 16);
      const toB: number = parseInt(toRGB.substr(5, 2), 16);

      const fromR: number = parseInt(fromRGB.substr(1, 2), 16);
      const fromG: number = parseInt(fromRGB.substr(3, 2), 16);
      const fromB: number = parseInt(fromRGB.substr(5, 2), 16);

      const sR: number = ((toR - fromR) / step);
      const sG: number = ((toG - fromG) / step);
      const sB: number = ((toB - fromB) / step);

      // генерация недостающего цвета
      element[2] = '#';
      element[2] += Math.round(fromR + sR).toString(16);
      element[2] += Math.round(fromG + sG).toString(16);
      element[2] += Math.round(fromB + sB).toString(16);
    }

    return element;
  });

  // Вычисляем капитал + Округление до сотых
  capital = valArray.reduce((accumulator, currentValue) => accumulator + currentValue[1], 0);
  capital = Math.round(capital * 100) / 100;

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

  valArray.forEach((element: [string, number, string, string, string]) => {
    // Фиксируем угол сдвига элемента
    const angle = angleVal;

    // создаём дугу
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-width', '10px');
    path.setAttribute('stroke', element[2]);
    path.setAttribute('fill', 'none');
    path.setAttribute('d', makeArc(0, 90, 0));
    if (element[3]) {
      path.setAttribute('style', 'cursor: pointer');
      // при клике...
      path.onclick = (): void => {
        window.open(element[3], '_blank');
      };
    }
    svg.appendChild(path);

    // анимированно замкнуть кольцо
    animate({
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        path.setAttribute('d', makeArc(delta * element[1], (delta * (R - 90)) + 90, delta * angle));
      }
    });

    // анимированно увеличить ширину элементов
    animate({
      el: element,
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        path.setAttribute('stroke-width', (delta * 100) + 'px');
      }
    });

    // при наведении...
    path.onmouseover = (): void => {
      svg.removeChild(textArr[0]);
      spanArr[2].textContent = element[4];
      spanArr[3].textContent = element[0];
      spanArr[4].textContent = '$' + element[1].toLocaleString('en');
      svg.appendChild(textArr[1]);

      animate({
        el: path,
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          path.setAttribute('stroke-width', (delta * (140 - 100) + 100) + 'px');
          path.setAttribute('opacity', String(delta * (0.4 - 1) + 1));
        }
      });
    };

    // при отводе...
    path.onmouseout = (): void => {
      svg.removeChild(textArr[1]);
      spanArr[0].textContent = 'Capital';
      spanArr[1].textContent = '$' + capital.toLocaleString('en');
      svg.appendChild(textArr[0]);
      animate({
        el: path,
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          path.setAttribute('stroke-width', (delta * (100 - 140) + 140) + 'px');
          path.setAttribute('opacity', String(delta * (1 - 0.4) + 0.4));
        }
      });
    };

    // Переменная отступа от начала координат
    angleVal += element[1];
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
