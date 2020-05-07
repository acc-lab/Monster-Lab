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
loadImage('gun');

class Player{
	constructor(){
		this.tick=0;
		this.cst='idle';
		this.x=50;
		this.y=50;

		this.speed=5;

		this.face=1;
	}
	
	move(deg){
		this.tick+=1;
		if(this.tick==2)this.cst='walk1';
		if(this.tick==4)this.cst='walk2';
		if(this.tick==6)this.cst='walk1';
		if(this.tick==8){this.cst='idle'; this.tick=0;}
		
		this.x+=this.speed*Math.cos(deg*(Math.PI/180));
		this.y-=this.speed*Math.sin(deg*(Math.PI/180));
	}
	
	update(){
		if(isPressed('w') || isPressed('up')){
			if(isPressed('a') || isPressed('left')){
				this.move(135);
			}else if(isPressed('d') || isPressed('right')){
				this.move(45);
			}else{
				this.move(90);
			}
		}else if(isPressed('s') || isPressed('down')){
			if(isPressed('a') || isPressed('left')){
				this.move(225);
			}else if(isPressed('d') || isPressed('right')){
				this.move(315);
			}else{
				this.move(270);
			}
		}else if(isPressed('a') || isPressed('left')){
			this.move(180);
		}else if(isPressed('d') || isPressed('right')){
			this.move(0);
		}else{
			this.cst="idle";
			this.tick=0;
		}
	}
		
	draw(){
		let face=((((Math.atan2(cursor_y-this.y, cursor_x-this.x))*(180/Math.PI)+90)%360+360)%360<=180)?1:-1;
		
		if(face==1){
			context.drawImage(store[this.cst], Math.floor(this.x)-14, Math.floor(this.y)-17, store[this.cst].width, store[this.cst].height);
		}else{
			context.save();
			context.translate(Math.floor(this.x)*2, 0);
			context.scale(-1,1);
			context.drawImage(store[this.cst], Math.floor(this.x)-14, Math.floor(this.y)-17);
			context.restore();
		}
	}
}

var player = new Player();

function mainloop(){
	if(Object.keys(store).length==5){
		context.clearRect(0,0,720,540);
		
		player.update();
		player.draw();
		
		x = player.x+0;
		y = player.y+0;
		
		direction = (((Math.atan2(cursor_y-y, cursor_x-x))*(180/Math.PI))%360+360)%360;
		
		context.save();
		
		/*
		context.beginPath();
		context.moveTo(100,100);
		context.lineTo(110,110);
		context.lineWidth=1;
		context.strokeStyle="grey";
		context.stroke();
		*/
		
		if(direction<90 || direction>270){
			context.translate(x,y);
			context.rotate(direction*(Math.PI/180));
			context.drawImage(store['gun'], 15, 0, 19, 10);
			context.translate(0,0);
		}else{
			context.translate(x,y);
			context.rotate((180+direction)*(Math.PI/180));
			
			context.scale(-1, 1);
			context.drawImage(store['gun'], 15, 0, 19, 10);
			
			context.translate(0,0);
		}
		
		context.restore();
		
		context.drawImage(store['cursor'], cursor_x-7, cursor_y-7, 15, 15);
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
	cursor_x = (event.clientX - canvas.offsetLeft+198)/0.55;
	cursor_y = (event.clientY - canvas.offsetTop)/0.55;
}

canvas.addEventListener('mousedown',function(){
	cursor_click=true;
})
