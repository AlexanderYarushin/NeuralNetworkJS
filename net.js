var Net = function(input,hidden,output,speed){
	this.input = input;
	this.hidden = hidden;
	this.output = output;
	this.input.coords = [];
	this.hidden.coords = [];
	this.output.coords = [];
	this.speed = speed;

	this.output.error = [];
	this.hidden.error = [];

	this.input.w = [];
	this.hidden.w = [[]];

	this.gE = 0;

	var tw = [];

	for(var i = 0; i < this.input.data.length; ++i){
		for(var j = 0; j < this.hidden.data[0].length; ++j){
			tw.push(Math.random()+0.0001);
		}
		this.input.w.push(tw);	
		tw = [];
	}
	
	for(var i = 0; i < this.hidden.data[0].length; ++i){
		for(var j = 0; j < this.output.data.length; ++j){
			tw.push(Math.random()+0.0001);
		}
		this.hidden.w[0].push(tw);	
		tw = [];
	}
	console.log(this);
	this.draw = function(){
		this.calc();
		c.clearRect(0,0,w,h);
		for(var i = 0; i < this.input.w.length; ++i){
			for(var j = 0; j < this.input.w[i].length; ++j){
				if(this.input.w[i][j] != 0){
					line(this.input.coords[i].x,this.input.coords[i].y,this.hidden.coords[0][j].x,this.hidden.coords[0][j].y,'black',0.5);
				}
			}
		}

		for(var i = 0; i < this.hidden.w.length-1; ++i){//Слой
			for(var j = 0; j < this.hidden.w[i].length; ++j){//Нейрон
				for(var k = 0; k < this.hidden.w[i][j].length; ++k){//К кому соединен
					if(this.hidden.w[i][j][k] != 0){
						line(this.hidden.coords[i][j].x,this.hidden.coords[i][j].y,this.hidden.coords[i+1][k].x,this.hidden.coords[i+1][k].y,'black',0.5);
					}
				}
			}
		}

		for(var i = 0; i < this.hidden.w[this.hidden.w.length-1].length; ++i){//Нейрон
			for(var j = 0; j < this.hidden.w[this.hidden.w.length-1][i].length; ++j){//К кому соединен
				if(this.hidden.w[this.hidden.w.length-1][i][j] != 0){
					line(this.hidden.coords[this.hidden.w.length-1][i].x,this.hidden.coords[this.hidden.w.length-1][i].y,this.output.coords[j].x,this.output.coords[j].y,'black',0.5);
				}
			}
		}
		for(var i = 0; i < this.input.coords.length; ++i){
			arc(this.input.coords[i].x,this.input.coords[i].y,10,'black');
			text("i"+(i+1),this.input.coords[i].x,this.input.coords[i].y,'black','10px Tahoma','center');
		}

		for(var i = 0; i < this.hidden.coords.length; ++i){
			for(var j = 0; j < this.hidden.coords[i].length; ++j){
				arc(this.hidden.coords[i][j].x,this.hidden.coords[i][j].y,10,'black');
				text("h"+(j+1),this.hidden.coords[i][j].x,this.hidden.coords[i][j].y,'black','10px Tahoma','center');
			}
		}

		for(var i = 0; i < this.output.coords.length; ++i){
			arc(this.output.coords[i].x,this.output.coords[i].y,10,'black');
			text("o"+(i+1),this.output.coords[i].x,this.output.coords[i].y,'black','10px Tahoma','center');
		}
		

		this.gE = 0;
	}

	this.calc = function(){
		var startX = 0,
		kx = 1,
		sx = 0;
		for(var i = 0; i < this.input.data.length; ++i){
			this.input.coords.push({x:kx * (startX + 50),y:(h/this.input.data.length * i) + (h/this.input.data.length/2)});
		}

		for(var i = 0; i < this.hidden.data.length; ++i){
			var m = [];
			for(var j = 0; j < this.hidden.data[i].length; ++j){
				m.push({x:kx * (startX + sx + 250),y:(h/this.hidden.data[i].length * j) + (h/this.hidden.data[i].length/2)});
			}
			sx += 200;
			this.hidden.coords.push(m);
		}
		for(var i = 0; i < this.output.data.length; ++i){
			this.output.coords.push({x:kx * (startX + sx + 250),y:(h/this.output.data.length * i) + (h/this.output.data.length/2)});
		}

		//Рисование таблицы

		var str = '<tr>';
		/*
		for(var i = 0; i < this.hidden.data[0].length+1; ++i){
			if(i == 0) str += "<th></th>"; else str += "<th>h"+(i)+"</th>";
		}
		str += '</tr>';
		
		
		for(var i = 0; i < this.input.w.length; ++i){
			str += '<tr>';
			for(var j = 0; j < this.input.w[0].length+1; ++j){
				if(j == 0) str += "<th>i"+(i+1)+"</th>"; else str += "<th class = 'd d"+i+j+"'>"+this.input.w[i][j-1].toFixed(4)+"</th>"; 
			}
			str += '</tr>';
		}

		for(var i = 0; i < this.hidden.w[0][0].length; ++i){
			str += '<tr>';
			for(var j = 0; j < this.hidden.w[0].length+1; ++j){
				if(j == 0) str += "<th>o"+(i+1)+"</th>"; else str += "<th class = 'd dh"+i+j+"'>"+this.hidden.w[0][j-1][i].toFixed(4)+"</th>"; 
			}
			str += '</tr>';
		}*/
		str += '</tr>';
		str += '<tr><th class = "d error">Ошибка: '+this.gE.toFixed(4)+'</th></tr>';
		$('table').append(str);	
	}

	var countLearn = 0;

	this.forward = function(d,back){
		for(var i = 0; i < d.input.length; ++i){
			this.input.data[i] = d.input[i];
		}

		//===========Скрытый слой===========
		for(var i = 0; i < this.hidden.data.length; ++i){//Слой
			for(var j = 0; j < this.hidden.data[i].length; ++j){//Нейрон
				this.hidden.data[i][j] = 0;
			}
		}
		
		for(var i = 0; i < this.hidden.data[0].length; ++i){ //Изменяем нейрон скрытого слоя
			for(var j = 0; j < this.input.data.length; ++j){ //Изменяем нейрон скрытого слоя
				this.hidden.data[0][i] += this.input.data[j] * this.input.w[j][i];
			}
		}
		
		for(var i = 0; i < this.hidden.data[0].length; ++i){
			this.hidden.data[0][i] = this.activation(this.hidden.data[0][i]);
			
		}

		
		//===========Выходной слой===========

		for(var i = 0; i < this.output.data.length; ++i){//Слой
			this.output.data[i] = 0;
		}
		

		for(var i = 0; i < this.output.data.length; ++i){ //Изменяем нейрон выходного слоя
			for(var j = 0; j < this.hidden.data[this.hidden.data.length-1].length; ++j){ //Изменяем нейрон скрытого слоя
				this.output.data[i] += this.hidden.data[this.hidden.data.length-1][j] * this.hidden.w[this.hidden.w.length-1][j][i];
			}
		}

		for(var i = 0; i < this.output.data.length; ++i){
			this.output.data[i] = this.activation(this.output.data[i]);
		}

		
		if(back){
			for(var i = 0; i < this.output.data.length; ++i){

				this.output.error[i] = d.output[i] - this.output.data[i];	

				this.gE += Math.pow(this.output.error[i],2);
			}


			this.backward();
		}else{
			c.clearRect(this.output.coords[0].x+20,this.output.coords[0].y-50,100,1000);
			for(var i = 0; i < this.output.coords.length; ++i){
				text(this.output.data[i].toFixed(3),this.output.coords[i].x + 50, this.output.coords[i].y,'black','18px Tahoma','center');
			}
		}
		countLearn++;
	}


	this.backward = function(a){
		
		for(var i = 0; i < this.hidden.data[0].length; ++i){		
			this.hidden.error[i] = 0;
			
		}
		
		
		for(var i = 0; i < this.hidden.w[0].length; ++i){
			for(var j = 0; j < this.hidden.w[0][i].length; ++j){
				this.hidden.error[i] += this.output.error[j] * this.hidden.w[0][i][j];
			}	
			this.hidden.error[i] *= this.hidden.data[0][i] * (1 - this.hidden.data[0][i]);	
		}

		

		for(var i = 0; i < this.hidden.w[0].length; ++i){
			for(var j = 0; j < this.hidden.w[0][i].length; ++j){
				this.hidden.w[0][i][j] +=  this.speed * this.output.error[j]  * this.hidden.data[0][i];
			}
		}


		for(var i = 0; i < this.input.w.length; ++i){
			for(var j = 0; j < this.input.w[i].length; ++j){
				this.input.w[i][j] +=  this.speed * this.hidden.error[j]  * this.input.data[i];
			}
		}

		//console.log(this);
	}	


	this.update = function(){

		$('.error').html('Ошибка: '+this.gE.toFixed(10));

		/*for(var i = 0; i < this.input.w.length; ++i){
			for(var j = 0; j < this.input.w[i].length; ++j){
				$('.d'+i+(j+1)).html(this.input.w[i][j].toFixed(4));
			}
		}

		for(var i = 0; i < this.hidden.w[0].length; ++i){
			for(var j = 0; j < this.hidden.w[0][i].length; ++j){
				$('.dh'+j+(i+1)).html(this.hidden.w[0][i][j].toFixed(4));
			}
		}*/

		if(this.gE <= 0.001) go = false;
		this.gE = 0;
	}

	this.activation = function(x){
		return 1 / (1 + Math.pow(Math.E,-x));
		
	}
}