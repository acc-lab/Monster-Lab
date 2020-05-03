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

function mainloop(){
	if(Object.keys(store).length==1){
		context.clearRect(0,0,720,540);
		
		context.drawImage(store['cursor'], cursor_x-7, cursor_y-7, 15, 15);
	}	
}

setInterval(mainloop, 30);


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
