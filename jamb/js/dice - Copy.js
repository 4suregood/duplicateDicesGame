	var cwidth = 700;
	var cheight = 300;
	var dicex = 50;
	var dicey = 50;
	var dicewidth = 100;
	var diceheight = 100;
	var dotrad = 6;
	var ctx;
	var dx;
	var dy;

function throwdice() {
	var throwArr = [];
	//throwArr[0] = 1+Math.floor(Math.random()*6);
	//dx = dicex;
	dy = dicey;
	//drawface(throwArr[0]);
	//second
	//dx = dicex + 120;
	//throwArr[1]=1 + Math.floor(Math.random()*6);
	//drawface(throwArr[1]);
	throwArr[0] = throwAndDrawDice(0);
	throwArr[1] = throwAndDrawDice(120);
	throwArr[2] = throwAndDrawDice(240);
	throwArr[3] = throwAndDrawDice(360);
	throwArr[4] = throwAndDrawDice(480);
	throwArr[5] = throwAndDrawDice(600);

	alert(throwArr);
	return throwArr;
}

function throwAndDrawDice(dist) {
	dx = dicex + dist;
	var ch = 1+Math.floor(Math.random()*6);
	drawface(ch);
	return ch;
}

function drawface(n) {
  ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = 5;
  ctx.clearRect(dx,dy,dicewidth,diceheight);
  ctx.strokeRect(dx,dy,dicewidth,diceheight)
  var dotx;
  var doty;
  ctx.fillStyle = "#009966";
	switch(n) {
		case 1:
		 draw1();
		 break;
		case 2:
		 draw2();
		 break;
		case 3:
		 draw2();
		 draw1();
		 break;
		case 4:
		 draw4();
		 break;
		case 5:
		 draw4();
		 draw1();
		 break;
		case 6:
		 draw4();
		 draw2mid();
		 break;

	}
}
function draw1() {
	var dotx;
	var doty;
	ctx.beginPath();
	dotx = dx + .5*dicewidth;
	doty = dy + .5*diceheight;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}
function draw2() {
	var dotx;
	var doty;
	ctx.beginPath();
	dotx = dx + 3*dotrad;
	doty = dy + 3*dotrad;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	dotx = dx+dicewidth-3*dotrad;
	doty = dy+diceheight-3*dotrad;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}
function draw4() {
	var dotx;
	var doty;
	ctx.beginPath();
	dotx = dx + 3*dotrad;
	doty = dy + 3*dotrad;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	dotx = dx+dicewidth-3*dotrad;
	doty = dy+diceheight-3*dotrad;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	dotx = dx + 3*dotrad;
	doty = dy + diceheight-3*dotrad;  //no change
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	dotx = dx+dicewidth-3*dotrad;
	doty = dy+ 3*dotrad;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}
function draw2mid() {
	var dotx;
	var doty;
	ctx.beginPath();
	dotx = dx + 3*dotrad;
	doty = dy + .5*diceheight;
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	dotx = dx+dicewidth-3*dotrad;
	doty = dy + .5*diceheight; //no change
	ctx.arc(dotx,doty,dotrad,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}