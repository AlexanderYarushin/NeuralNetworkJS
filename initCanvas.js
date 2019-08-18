var c,w,h,canvas;
function initializtionCanvas(){
	document.getElementById('ca').width = window.innerWidth;
	document.getElementById('ca').height = window.innerHeight;
	canvas = document.getElementById('ca');
	w = canvas.width;
	h = canvas.height;
	c = canvas.getContext('2d');
}


function arc(x,y,r,color){
	c.beginPath();
	c.strokeStyle = color;
	c.arc(x,y,r,0,Math.PI * 2, false);
	c.lineWidth = 1;
	c.fillStyle = 'white';
	c.fill();
	c.stroke();
	c.closePath();
}

function line(x1,y1,x2,y2,color,width){
	c.beginPath();
	c.strokeStyle = color;
	c.lineWidth = width;
	c.moveTo(x1,y1);
	c.lineTo(x2,y2);
	c.stroke();
	c.closePath();
}	


function text(str,x,y,color,font,align){
	c.beginPath();
	c.font = font;
	c.fillStyle = color;
	c.textAlign = align;
	c.textBaseline = "middle";
	c.fillText(str,x,y);
	c.closePath();

}