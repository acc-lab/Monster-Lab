var canvas = document.getElementById('screen');

canvas.width=720;
canvas.height=540;

var context = canvas.getContext("2d");

var store={};

function loadImage(filename, cofilename='.png'){
	let img = new Image();
	img.src=filename+cofilename;
	img.onload=function(){
		store[filename]=img;
	}
}

loadImage('cursor');
loadImage('idle');
loadImage('walk1');
loadImage('walk2');

var tick=0;
var cst='idle';
var x=50;
var y=50;

var speed=5;

var face=1;

function move(deg){
	tick+=1;
	if(tick==2)cst='walk1';
	if(tick==4)cst='walk2';
	if(tick==6)cst='walk1';
	if(tick==8){cst='idle'; tick=0;}
	
	x+=speed*Math.cos(deg*(Math.PI/180));
	y-=speed*Math.sin(deg*(Math.PI/180));
}

function mainloop(){
	if(Object.keys(store).length==4){
		context.clearRect(0,0,720,540);
	
		
		context.drawImage(store['cursor'], cursor_x-7, cursor_y-7, 14, 14);
		
		if(face==1){
			context.drawImage(store[cst], Math.floor(x), Math.floor(y), store[cst].width, store[cst].height);
		}else{
			context.save();
			context.translate(Math.floor(x)*2+25, 0);
			context.scale(-1,1);
			context.drawImage(store[cst], Math.floor(x), Math.floor(y));
			context.restore();
		}
		
		if(isPressed('w') || isPressed('up')){
			if(isPressed('a') || isPressed('left')){
				move(135);
			}else if(isPressed('d') || isPressed('right')){
				move(45);
			}else{
				move(90);
			}
		}else if(isPressed('s') || isPressed('down')){
			if(isPressed('a') || isPressed('left')){
				move(225);
			}else if(isPressed('d') || isPressed('right')){
				move(315);
			}else{
				move(270);
			}
		}else if(isPressed('a') || isPressed('left')){
			move(180);
		}else if(isPressed('d') || isPressed('right')){
			move(0);
		}else{
			cst="idle";
			tick=0;
		}
		
		face=((((Math.atan2(cursor_y-y, cursor_x-x))*(180/Math.PI)+90)%360+360)%360<=180)?1:-1;
	}	
}

setInterval(mainloop, 30);

var keys={37:false, 38:false, 39:false, 40:false, 87:false, 65:false, 68:false, 83:false}

window.onkeyup = function(e) { keys[e.keyCode] = false;}
window.onkeydown = function(e) {keys[e.keyCode] = true;}

//check if a specific button is pressed
function isPressed(e){
    //the parameter excepted to be a string: "up" "down" "left" "right" "z"
    return keys[
        {"up":38,
        "down":40,
        "left":37,
        "right":39,
        "w":87,
        "a":65,
        "s":83,
        "d":68,
        }[e]
    ]
}

var cursor_x;
var cursor_y;
var cursor_click=false;

document.onmousemove=function(e) {
	cursor_x = event.clientX - canvas.offsetLeft + 360;
	cursor_y = event.clientY - canvas.offsetTop;
}

canvas.addEventListener('mousedown',function(){
	cursor_click=true;
})
