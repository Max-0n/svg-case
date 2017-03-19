<!DOCTYPE html>
<html lang="ru-RU">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Cloud capital</title>
		<meta name="author" content="Максим Рожков">
		<link href="list.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="max0n.js"></script>
		<script>
		window.onload = function () {
			var R = 170;
			angleVal = 0,
			drawPath = new Array(),
			spanArr = new Array(),
			textArr = new Array(),
			rand = getRandomInt(90, 360),
			valArray=[<?php
				$valArray[] = ['Russian Federation', 1700, '#4dde5e', 'https://artweb.io/', 'Moscow'];
				$valArray[] = ['Russian Federation', 1400, '', 'https://artweb.io/', 'Sochi'];
				$valArray[] = ['Russian Federation', 700, '', 'https://artweb.io/', 'Bank 1'];
				$valArray[] = ['Russian Federation', 900, '', 'https://artweb.io/', 'Bank 2'];
				$valArray[] = ['Russian Federation', 970, '#79ec87', 'https://artweb.io/', 'Bank 3'];
				$valArray[] = ['German', 850, '#fc8f30', 'https://artweb.io/', 'Berlin'];
				$valArray[] = ['German', 540, '', 'https://artweb.io/', 'Bank 1'];
				$valArray[] = ['German', 1200, '', 'https://artweb.io/', 'Bank 2'];
				$valArray[] = ['German', 1100, '', 'https://artweb.io/', 'Bank 3'];
				$valArray[] = ['German', 1450, '#fcd053', 'https://artweb.io/', 'Bank 4'];
				$valArray[] = ['China', 1450, '#75c6de', 'https://artweb.io/', 'Pekin'];
				$valArray[] = ['China', 1280, '', 'https://artweb.io/', 'Bank 1'];
				$valArray[] = ['China', 950, '', 'https://artweb.io/', 'Bank 2'];
				$valArray[] = ['China', 1100, '', 'https://artweb.io/', 'Bank 3'];
				$valArray[] = ['China', 1000, '#95e9fd', 'https://artweb.io/', 'Bank 4'];


				for ($i=0;$i<count($valArray);$i++) {
					//если цвет отсутствует
					if(!$valArray[$i][2]) {
						$fromRGB = $valArray[$i-1][2];
						$toRGB = '';
						$step = 0;
						//ищем следующий известный RGB
						while(strlen($toRGB)<6){
							$step++;
							if($valArray[$i+$step][2]) {
								$toRGB=$valArray[$i+$step][2];
								$step++;
							}
						}
						//шаг для каждого цвета
						$sR= ((base_convert(substr($toRGB, 1, 2), 16, 10)-base_convert(substr($fromRGB, 1, 2), 16, 10))/$step);
						$sG= ((base_convert(substr($toRGB, 3, 2), 16, 10)-base_convert(substr($fromRGB, 3, 2), 16, 10))/$step);
						$sB= ((base_convert(substr($toRGB, 5, 2), 16, 10)-base_convert(substr($fromRGB, 5, 2), 16, 10))/$step);
						//генерация недостающего цвета
						$valArray[$i][2] = '#';
						$valArray[$i][2] .= base_convert((round(base_convert(substr($fromRGB, 1, 2), 16, 10)+$sR)), 10, 16);
						$valArray[$i][2] .= base_convert((round(base_convert(substr($fromRGB, 3, 2), 16, 10)+$sG)), 10, 16);
						$valArray[$i][2] .= base_convert((round(base_convert(substr($fromRGB, 5, 2), 16, 10)+$sB)), 10, 16);
					}
					//генерируем массив для JS
					echo('["'.$valArray[$i][0].'", '.$valArray[$i][1].', "'.$valArray[$i][2].'", "'.$valArray[$i][3].'", "'.$valArray[$i][4].'"]');
					if($i!=$count-1) echo(",\n");
				}?>];
			for(c=0,capital=0;c<valArray.length;c++){	//Вычисляем капитал:
				capital += valArray[c][1];
			}
			capital=Math.round(capital*100)/100;		//Округление до сотых

			//Функция постоения дуг.
    		function makeArc(value, rad, makeAngle){
				var alpha = 3.6 * (value/(capital/100)),
				angle = (360)/capital*(makeAngle),
				a = (rand-angle-alpha) * Math.PI/180,
				b = (rand-angle) * Math.PI/180,
				sx = 400 + rad * Math.cos(b),
				sy = 250 - rad * Math.sin(b),
				x = 400 + rad * Math.cos(a),
				y = 250 - rad * Math.sin(a),
				path = "M "+sx+","+sy+" A "+rad+","+rad+" 0 "+(+(alpha> 180))+" 1 "+x+","+y;
				return path;
    		}
			//Находим холст для SVG
			var svg = document.getElementById("svg");

			for(p=0;p<valArray.length;p++){
				// создаём дуги
				drawPath[p]=document.createElementNS("http://www.w3.org/2000/svg", "path");
				drawPath[p].setAttribute("stroke-width", "10px");
				drawPath[p].setAttribute("stroke", valArray[p][2]);
				drawPath[p].setAttribute("fill", "none");
				drawPath[p].setAttribute("d", makeArc(0,90,0));
				svg.appendChild(drawPath[p]);

				(function(p,angleVal){
					//анимированно замкнуть кольцо
					animate({
						duration: 1900,
						delta: makeEaseInOut(quad),
						step: function(delta) {
							drawPath[p].setAttribute("d", makeArc(delta*valArray[p][1],(delta*(R-90))+90,delta*angleVal));
						}
					});
					//анимированно увеличить ширину элементов
					animate({
						el: drawPath[p],
						duration: 1900,
						delta: makeEaseInOut(quad),
						step: function(delta) {
							drawPath[p].setAttribute("stroke-width", (delta*100)+"px");
						}
					});
					//при наведении...
					drawPath[p].onmouseover = function(){
						svg.removeChild(textArr[0]);
						spanArr[2].textContent = valArray[p][4];
						spanArr[3].textContent = valArray[p][0];
						spanArr[4].textContent = '$'+valArray[p][1];
						svg.appendChild(textArr[1]);
						animate({
							el: drawPath[p],
							duration: 2000,
							delta: makeEaseOut(elastic),
							step: function(delta) {
								drawPath[p].setAttribute("stroke-width", (delta*(140-100)+100)+"px");
								drawPath[p].setAttribute("opacity", (delta*(0.4-1)+1));
							}
						});
					};
					//при отводе...
					drawPath[p].onmouseout = function(){
						svg.removeChild(textArr[1]);
						spanArr[0].textContent = 'Capital';
						spanArr[1].textContent = '$'+capital;
						svg.appendChild(textArr[0]);
						animate({
							el: drawPath[p],
							duration: 2000,
							delta: makeEaseOut(elastic),
							step: function(delta) {
								drawPath[p].setAttribute("stroke-width", (delta*(100-140)+140)+"px");
								drawPath[p].setAttribute("opacity", (delta*(1-0.4)+0.4));
							}
						});
					};
					//при клике...
					drawPath[p].onclick = function(){
						window.open(valArray[p][3], "_blank");
					};
				})(p,angleVal);
				//Переменная отступа от начала координат
				angleVal = angleVal+valArray[p][1];
			}

			//Блоки с текстом
			for(span=0;span<5;span++){
				if(span<2){
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
					if(span==0){
						textArr[span].setAttribute("font-size", "40");
						textArr[span].setAttribute("font-weight", "bold");
						textArr[span].setAttribute("y", "190");
						spanArr[0].textContent = 'Capital';
					}
					if(span==1){
						textArr[span].setAttribute("font-size", "22");
						textArr[span].setAttribute("font-weight", "none");
						textArr[span].setAttribute("y", "200");
						spanArr[1].textContent = '$'+capital;
					}
					textArr[0].appendChild(spanArr[span]);
					svg.appendChild(textArr[span]);
				}
				//3 строки при наведении мышкой...
				if(span>=2){
					spanArr[span] = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
					spanArr[span].setAttribute("x", "400");
					spanArr[span].setAttribute("dy", "30");
					textArr[1].appendChild(spanArr[span]);
				}
			}
		}
		</script>
	</head>
	<body>
		<svg id="capitalo" width="800" height="200">
		<a xlink:href="/" xlink:title="Облачный капитал" fill="#fff">
		<?php include "logo.php";?>
		</a>
		</svg>
		<div id="wrapper">
			<div id="main">
				<h1>Облачный портфель</h1>
				<svg id="svg" width="800" height="500" fill="#0088cc" style="background: #f2f7f8;"></svg><br><br>
			</div>
		</div>
	</body>
</html>
