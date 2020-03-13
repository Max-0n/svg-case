require('./style.scss');
import { getRandomInt, animate, makeEaseInOut, makeEaseOut, elastic, quad } from './animate';

console.log('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

window.onload = function () {
  let R: number = 170,
  angleVal: number = 0,
  spanArr: SVGTextElement[] = new Array(),
  textArr: SVGTextElement[] = new Array(),
  rand: number = getRandomInt(90, 360),
  capital: number,
  valArray: Array<[string, number, string, string, string]> = [
    ['Russian Federation', 1700, '#4dde5e', 'https://github.com/Max-0n/svg-case', 'Moscow'],
    ['Russian Federation', 1400, '', 'https://github.com/Max-0n/svg-case', 'Sochi'],
    ['Russian Federation', 700, '', 'https://github.com/Max-0n/svg-case', 'Bank 1'],
    ['Russian Federation', 900, '', 'https://github.com/Max-0n/svg-case', 'Bank 2'],
    ['Russian Federation', 970, '#79ec87', 'https://github.com/Max-0n/svg-case', 'Bank 3'],
    ['German', 850, '#fc8f30', 'https://github.com/Max-0n/svg-case', 'Berlin'],
    ['German', 540, '', 'https://github.com/Max-0n/svg-case', 'Bank 1'],
    ['German', 1200, '', 'https://github.com/Max-0n/svg-case', 'Bank 2'],
    ['German', 1100, '', 'https://github.com/Max-0n/svg-case', 'Bank 3'],
    ['German', 1450, '#fcd053', 'https://github.com/Max-0n/svg-case', 'Bank 4'],
    ['China', 1450, '#75c6de', 'https://github.com/Max-0n/svg-case', 'Pekin'],
    ['China', 1280, '', 'https://github.com/Max-0n/svg-case', 'Bank 1'],
    ['China', 950, '', 'https://github.com/Max-0n/svg-case', 'Bank 2'],
    ['China', 1100, '', 'https://github.com/Max-0n/svg-case', 'Bank 3'],
    ['China', 1000, '#95e9fd', 'https://github.com/Max-0n/svg-case', 'Bank 4']
  ];
  const svg: HTMLElement = document.getElementById("svg");

  // Заполняем недостающие промежуточные цвета
  valArray = valArray.map(
    (
      element: [string, number, string, string, string],
      index: number,
      array: Array<[string, number, string, string, string]>
    ) => {

    //если цвет отсутствует
    if (!element[2]) {
      let fromRGB: string = array[index-1][2],
      toRGB: string = '',
      step: number = 0;

      //ищем следующий известный RGB
      while (toRGB.length < 6) {
        step++;
        if (array[index+step][2]) {
          toRGB = array[index+step][2];
          step++;
        }
      }

      //шаг для каждого цвета
      let toR: number = parseInt(toRGB.substr(1, 2), 16);
      let toG: number = parseInt(toRGB.substr(3, 2), 16);
      let toB: number = parseInt(toRGB.substr(5, 2), 16);

      let fromR: number = parseInt(fromRGB.substr(1, 2), 16);
      let fromG: number = parseInt(fromRGB.substr(3, 2), 16);
      let fromB: number = parseInt(fromRGB.substr(5, 2), 16);

      let sR: number = ((toR - fromR) / step);
      let sG: number = ((toG - fromG) / step);
      let sB: number = ((toB - fromB) / step);

      //генерация недостающего цвета
      element[2] = '#';
      element[2] += Math.round(fromR + sR).toString(16);
      element[2] += Math.round(fromG + sG).toString(16);
      element[2] += Math.round(fromB + sB).toString(16);
    }

    return element;
  });

  // Вычисляем капитал + Округление до сотых
  capital = valArray.reduce((accumulator, currentValue) => accumulator + currentValue[1], 0);
  capital = Math.round(capital*100)/100;

  //Функция постоения дуг.
  const makeArc = (value: number, rad: number, makeAngle: number): string => {
    const alpha: number = 3.6 * (value/(capital/100)),
    angle: number = (360)/capital*(makeAngle),
    a: number = (rand-angle-alpha) * Math.PI/180,
    b: number = (rand-angle) * Math.PI/180,
    sx: number = 400 + rad * Math.cos(b),
    sy: number = 250 - rad * Math.sin(b),
    x: number = 400 + rad * Math.cos(a),
    y: number = 250 - rad * Math.sin(a),
    path: string = "M "+sx+","+sy+" A "+rad+","+rad+" 0 "+(+(alpha> 180))+" 1 "+x+","+y;
    return path;
  }

  valArray.forEach((element: [string, number, string, string, string]) => {
    // Фиксируем угол сдвига элемента
    const angle = angleVal;

    // создаём дугу
    const path: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-width", "10px");
    path.setAttribute("stroke", element[2]);
    path.setAttribute("fill", "none");
    path.setAttribute("d", makeArc(0,90,0));
    if (element[3]) {
      path.setAttribute('style', 'cursor: pointer');
      // при клике...
      path.onclick = (): void => {
        window.open(element[3], "_blank");
      };
    }
    svg.appendChild(path);

    // анимированно замкнуть кольцо
    animate({
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        path.setAttribute("d", makeArc(delta * element[1], (delta*(R-90))+90, delta*angle));
      }
    });

    // анимированно увеличить ширину элементов
    animate({
      el: element,
      duration: 1900,
      delta: makeEaseInOut(quad),
      step: (delta: number): void => {
        path.setAttribute("stroke-width", (delta*100)+"px");
      }
    });

    // при наведении...
    path.onmouseover = (): void => {
      svg.removeChild(textArr[0]);
      spanArr[2].textContent = element[4];
      spanArr[3].textContent = element[0];
      spanArr[4].textContent = '$'+element[1].toLocaleString('en');
      svg.appendChild(textArr[1]);

      animate({
        el: path,
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          path.setAttribute("stroke-width", (delta*(140-100)+100)+"px");
          path.setAttribute("opacity", String(delta*(0.4-1)+1));
        }
      });
    };

    // при отводе...
    path.onmouseout = (): void => {
      svg.removeChild(textArr[1]);
      spanArr[0].textContent = 'Capital';
      spanArr[1].textContent = '$'+capital.toLocaleString('en');
      svg.appendChild(textArr[0]);
      animate({
        el: path,
        duration: 2000,
        delta: makeEaseOut(elastic, 0),
        step: (delta: number): void => {
          path.setAttribute("stroke-width", (delta*(100-140)+140)+"px");
          path.setAttribute("opacity", String(delta*(1-0.4)+0.4));
        }
      });
    };

    //Переменная отступа от начала координат
    angleVal += element[1];
  });

  //Блоки с текстом
  for (let span: number = 0; span < 5; span++) {
    if (span<2) {
      // создаём текстовые блоки (в которых будут строки «tspan»)
      textArr[span] = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textArr[span].setAttribute("text-anchor", "middle");
      textArr[span].setAttribute("font-family", "Helvetica");
      textArr[span].setAttribute("opacity", "1");
      textArr[span].setAttribute("stroke-width", "0");
      textArr[span].setAttribute("text-rendering", "geometricPrecision");

      //2 строки при отводе мышкой...
      spanArr[span] = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      spanArr[span].setAttribute("x", "400");
      spanArr[span].setAttribute("dy", "50");

      if (span == 0) {
        textArr[span].setAttribute("font-size", "40");
        textArr[span].setAttribute("font-weight", "bold");
        textArr[span].setAttribute("y", "190");
        spanArr[0].textContent = 'Capital';
      }

      if (span == 1) {
        textArr[span].setAttribute("font-size", "22");
        textArr[span].setAttribute("font-weight", "none");
        textArr[span].setAttribute("y", "200");
        spanArr[1].textContent = '$'+capital.toLocaleString('en');
      }
      textArr[0].appendChild(spanArr[span]);
      svg.appendChild(textArr[span]);
    }

    //3 строки при наведении мышкой...
    if (span >= 2) {
      spanArr[span] = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      spanArr[span].setAttribute("x", "400");
      spanArr[span].setAttribute("dy", "30");
      textArr[1].appendChild(spanArr[span]);
    }
  }
}
