var max0n = new Object();
max0n.launcher = function() { //запуск видимых блоков с встроенными функциями (анимацией)
    if(max0n.launcherArray.length>0){
    	var del = 0; //счётчик удаления
    	for(var i=0; i<max0n.launcherArray.length; i++){ //перебор всех блоков
    		(function(i){//замыкание
		    	var elemArrow = document.getElementById(max0n.launcherArray[i][0]); //Присвоение блока анимации
		    	if(document.body.clientHeight-elemArrow.getBoundingClientRect().top>elemArrow.offsetHeight*0.75){ //если блок виден, то...
		    		del++; //увеличить счётчик удаления
					max0n.launcherArray[i][1](); //выполнить функцию в блоке
				}
			})(i);
    	}
    	max0n.launcherArray.splice(0,del); //удаление проигранной анимации из очереди
	}
}
max0n.cashFlow = function (svgId,cashArr,r,w,h){
	var svg = document.getElementById(svgId);
	var circleArr = new Array();
	var groupArr = new Array();
	var txArr = new Array();
	var totalArr = new Array();
	var baseGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
	//baseGroup.setAttribute("opacity", 0);
	var R = 105;
	var rad = r || 1;
	var widt = w || 8;
	var heig = h || 5;
	var totalCash = 0;

	totalArr[0] = document.createElementNS("http://www.w3.org/2000/svg", "g");
	totalArr[1] = new Array();
	totalArr[1][0] = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	totalArr[1][1] = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
	totalArr[1][1].setAttribute("id", svgId+"_mask1");
	totalArr[1][2] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	totalArr[1][2].setAttribute("r", 0);
	totalArr[1][2].setAttribute("cx", svg.offsetWidth/2);
	totalArr[1][2].setAttribute("cy", svg.offsetHeight/2);
	totalArr[1][3] = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
	totalArr[1][3].setAttribute("id", svgId+"_mask2");
	totalArr[1][4] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	totalArr[1][4].setAttribute("r", 0);
	totalArr[1][4].setAttribute("cx", svg.offsetWidth/2);
	totalArr[1][4].setAttribute("cy", svg.offsetHeight/2);

	totalArr[2] = new Array();
	totalArr[2][0] = document.createElementNS("http://www.w3.org/2000/svg", "g");
	totalArr[2][0].setAttribute("clip-path", "url(#"+svgId+"_mask1)");
	totalArr[2][1] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	totalArr[2][1].setAttribute("r", 200);
	totalArr[2][1].setAttribute("cx", svg.offsetWidth/2);
	totalArr[2][1].setAttribute("cy", svg.offsetHeight/2);
	totalArr[2][1].setAttribute("fill", "#fff");
	totalArr[2][2] = document.createElementNS("http://www.w3.org/2000/svg", "text");
	totalArr[2][2].setAttribute("x", svg.offsetWidth/2);
	totalArr[2][2].setAttribute("y", 17+svg.offsetHeight/2);
	totalArr[2][2].setAttribute("fill", "#66bad6");
	totalArr[2][2].setAttribute("text-anchor", "middle");
	totalArr[2][2].setAttribute("font-family", "Helvetica");
	totalArr[2][2].setAttribute("font-size", 50);

	totalArr[3] = new Array();
	totalArr[3][0] = document.createElementNS("http://www.w3.org/2000/svg", "g");
	totalArr[3][0].setAttribute("clip-path", "url(#"+svgId+"_mask2)");
	totalArr[3][1] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	totalArr[3][1].setAttribute("r", 200);
	totalArr[3][1].setAttribute("cx", svg.offsetWidth/2);
	totalArr[3][1].setAttribute("cy", svg.offsetHeight/2);
	totalArr[3][1].setAttribute("fill", "#66bad6");
	totalArr[3][2] = document.createElementNS("http://www.w3.org/2000/svg", "text");
	totalArr[3][2].setAttribute("x", svg.offsetWidth/2);
	totalArr[3][2].setAttribute("y", 17+svg.offsetHeight/2);
	totalArr[3][2].setAttribute("fill", "#fff");
	totalArr[3][2].setAttribute("text-anchor", "middle");
	totalArr[3][2].setAttribute("font-family", "Helvetica");
	totalArr[3][2].setAttribute("font-size", 50);
	totalArr[3][2].textContent = "Profit";

	for(var i=0;i<cashArr.length;i++){
		totalCash += cashArr[i];
		groupArr[i] = document.createElementNS("http://www.w3.org/2000/svg", "g"); //создание групп
		circleArr[i] = document.createElementNS("http://www.w3.org/2000/svg", "circle"); //создание кругов
		txArr[i] = document.createElementNS("http://www.w3.org/2000/svg", "text");


		txArr[i].setAttribute("text-anchor", "middle");
		txArr[i].setAttribute("font-family", "Helvetica");
		txArr[i].setAttribute("font-size", (15+i/rad)*0.7 );
		txArr[i].setAttribute("fill", "#fff");
		txArr[i].setAttribute("text-rendering", "geometricPrecision");

		if(i%2){
			txArr[i].setAttribute("x", svg.offsetWidth/2+(R+(i-1)*widt)*Math.cos((180+(i-1)*15)*Math.PI/180)) ;
			txArr[i].setAttribute("y", svg.offsetHeight/2+(R+(i-1)*heig)*Math.sin((180+(i-1)*15)*Math.PI/180)+(10+i/rad)/3.5) ;
			circleArr[i].setAttribute("cx", svg.offsetWidth/2+(R+(i-1)*widt)*Math.cos((180+(i-1)*15)*Math.PI/180)) ;
			circleArr[i].setAttribute("cy", svg.offsetHeight/2+(R+(i-1)*heig)*Math.sin((180+(i-1)*15)*Math.PI/180)) ;
		}else{
			txArr[i].setAttribute("x", svg.offsetWidth/2+(R+i*widt)*Math.cos(i*15*Math.PI/180)) ;
			txArr[i].setAttribute("y", svg.offsetHeight/2+(R+i*heig)*Math.sin(i*15*Math.PI/180)+(10+i/rad)/3.5) ;
			circleArr[i].setAttribute("cx", svg.offsetWidth/2+(R+i*widt)*Math.cos(i*15*Math.PI/180)) ;
			circleArr[i].setAttribute("cy", svg.offsetHeight/2+(R+i*heig)*Math.sin(i*15*Math.PI/180)) ;
		}
		circleArr[i].setAttribute("fill", "#66bad6");
		circleArr[i].setAttribute("r", 15+i/rad); //увеличивающийся радиус
		txArr[i].textContent = cashArr[i];

		groupArr[i].appendChild(circleArr[i]); //вставляем круг в группу
		groupArr[i].appendChild(txArr[i]);
		baseGroup.appendChild(groupArr[i]);//размещение группы в Базовой группе

		(function(i){
			groupArr[i].onmouseover = function(){
				animate({
					el : groupArr[i],
					duration: 200,
					delta: makeEaseOut(quad),
					from: Math.round(circleArr[i].getAttribute('r')),
					to: (Math.round(15+i)*100)/70,
					step: function(delta,from,to) {
						circleArr[i].setAttribute('r',Math.round(delta*(to-from)+from));
					}
				});
			}
			groupArr[i].onmouseout = function(){
				animate({
					el : groupArr[i],
					duration: 200,
					delta: makeEaseOut(quad),
					//from: 5,
					from: Math.round(circleArr[i].getAttribute('r')),
					to: (Math.round(15+i)*100)/100,
					step: function(delta,from,to) {
						circleArr[i].setAttribute('r',Math.round(delta*(to-from)+from));
					}
				});
			}
		})(i);
	}
	svg.appendChild(baseGroup);

	totalArr[1][1].appendChild(totalArr[1][2]); //circle1 in clipPath1
	totalArr[1][3].appendChild(totalArr[1][4]); //circle2 in clipPath2
	totalArr[1][0].appendChild(totalArr[1][1]); //clipPath1 in defs
	totalArr[1][0].appendChild(totalArr[1][3]); //clipPath2 in defs
	totalArr[2][0].appendChild(totalArr[2][1]); //circle3 in g1
	totalArr[2][2].textContent = "$"+totalCash;
	totalArr[2][0].appendChild(totalArr[2][2]); //text1 in g1
	totalArr[3][0].appendChild(totalArr[3][1]); //circle4 in g2
	totalArr[3][0].appendChild(totalArr[3][2]); //text2 in g2
	totalArr[0].appendChild(totalArr[1][0]);
	totalArr[0].appendChild(totalArr[3][0]);
	totalArr[0].appendChild(totalArr[2][0]);

	svg.appendChild(totalArr[0]);

	animate({
		el : totalArr[0],
		duration: 500,
		delta: makeEaseOut(back, 4),
		from: totalArr[1][4].getAttribute('r'),
		step: function(delta, from) {
			totalArr[1][4].setAttribute('r',delta*(90-(Math.round(from*100)/100))+(Math.round(from*100)/100));
			if(delta<1) baseGroup.setAttribute("opacity", delta);
			else baseGroup.setAttribute("opacity", 1);

		}
	});
	totalArr[0].onmouseover = function(){
		animate({
			el : totalArr[0],
			duration: 700,
			delta: makeEaseOut(back, 1.5),
			from: totalArr[1][2].getAttribute('r'),
			to: totalArr[1][4].getAttribute('r'),
			step: function(delta,from,to) {
				totalArr[1][2].setAttribute('r',delta*(90-(Math.round(from)*100)/100)+(Math.round(from)*100)/100);
				totalArr[1][4].setAttribute('r',delta*(110-(Math.round(to)*100)/100)+(Math.round(to)*100)/100);
			}
		});
	};
	totalArr[0].onmouseout = function(){
		animate({
			el : totalArr[0],
			duration: 700,
			delta: makeEaseInOut(circ),
			from: totalArr[1][2].getAttribute('r'),
			to: totalArr[1][4].getAttribute('r'),
			step: function(delta, from, to) {
				totalArr[1][2].setAttribute('r',delta*(0-(Math.round(from)*100)/100)+(Math.round(from)*100)/100);
				totalArr[1][4].setAttribute('r',delta*(90-(Math.round(to)*100)/100)+(Math.round(to)*100)/100);
			}
		});
	};
}
// ----------- core of animation ------------- //
function animate(opts) {
  var el = opts.el || false;
  var start = new Date;
  var delta = opts.delta || linear;
  var from = opts.from || 0;
  var to =  opts.to || 0;
  //opts.complete = function(){alert(this);};
	if(el){ clearInterval(opts.el.timer);
    opts.el.timer = setInterval(function() {
    var progress = (new Date - start) / opts.duration;

    if (progress > 1) progress = 1;

    opts.step( delta(progress),from,to );

    if (progress == 1) {
      clearInterval(opts.el.timer);
      opts.complete && opts.complete();
    }
  }, opts.delay || 20);}
  else {
  var timer = setInterval(function() {
    var progress = (new Date - start) / opts.duration;

    if (progress > 1) progress = 1;

    opts.step( delta(progress),from,to );

    if (progress == 1) {
      clearInterval(timer);
      opts.complete && opts.complete();
    }
  }, opts.delay || 15);}
}

// ---------------- Delta for animation ---------------- //
function quad(progress) {
  return Math.pow(progress, 2)
}
function makeEaseInOut(delta) {
  return function(progress) {
    if (progress < .5)
      return delta(2*progress) / 2
    else
      return (2 - delta(2*(1-progress))) / 2
  }
}
// ------------------ Get random int ------------------ //
function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
