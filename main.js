var buttonDict = {bottomB:0,rightB:1,leftB:2,topB:3,leftBumper:4,rightBumper:5,minus:8,plus:9,joyPush:10,home:13,sideBumper:14,sideTrigger:15};
var colors = ["red","blue","yellow","green"];
var borders = ["FF9999","9999FF","99FF99","FFFF99"];


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1520;
        this.canvas.height = 725;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(gameLoop, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function particle(color, x, y, xvel, yvel, timer) {
	this.x = x;
    this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.color = color;
	this.timer = timer;
	this.update = function(){
        ctx = myGameArea.context;
		canvas = myGameArea.canvas;
		this.x += this.xvel;
		this.y += this.yvel;
		this.timer -= 0.02;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		
		
	}
}
function component(radius, color, x, y, xvel, yvel, health) {
    this.radius = radius;
    this.x = x;
    this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.color = color;
	this.cooldown = 5;
	this.shielded = false;

	this.health = health;
	
    this.update = function(){
        ctx = myGameArea.context;
		canvas = myGameArea.canvas;
		this.x += this.xvel;
		this.y += this.yvel;
		if(this.y < this.radius) {
			this.y = this.radius;
			this.yvel *= -0.8;
		}
		if(this.y > canvas.height - this.radius) {
			this.y = canvas.height - this.radius;
			this.yvel *= -0.8;
		}
		if(this.x < this.radius) {
			this.x = this.radius;
			this.xvel *= -0.8;
			this.health -= Math.round(Math.abs(this.xvel*2));
		}
		if(this.x > canvas.width - this.radius) {
			this.x = canvas.width - this.radius;
			this.xvel *= -0.8;
			this.health -= Math.round(Math.abs(this.xvel*2));
			
		}
		this.xvel *= .95;
		this.yvel += 2;
        
		
		
        ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle = "#FFF5C3";
		ctx.arc(this.x, this.y, this.radius * 0.9, 0, 2 * Math.PI, false);
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(this.x - 50, 690, 100, 15);
		ctx.fillStyle="#FF0000";
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(this.x - 50, 690, Math.max(this.health,0), 15);
		ctx.fillStyle="#00FF00";
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(this.x - 50, 715, 20 * (5 - this.cooldown), 5);
		ctx.fillStyle="#0000FF";
		ctx.fill();
		
		var crack1 = new Image()
		crack1.src = "Pictures\\crack_DMG1.png";
		var crack2 = new Image()
		crack2.src = "Pictures\\crack_DMG2.png";
		var crack3 = new Image()
		crack3.src = "Pictures\\crack_DMG3.png";
		
		switch(Math.floor(this.health / 33)) {
			case 3:
				
				break;
			case 2:
				ctx.drawImage(crack1,this.x - 50, this.y - 50);
				break;
			case 1:
				ctx.drawImage(crack2,this.x - 50, this.y - 50);
				break;
			case 0:
			case -1:
			case -2:
			case -3:
			case -4:
				ctx.drawImage(crack3,this.x - 50, this.y - 50);
				break;
			default:
				break;
		}
    }
	this.checkCollision = function(otherComponent) {
		if((this.x - otherComponent.x)*(this.x - otherComponent.x) + (this.y - otherComponent.y)*(this.y - otherComponent.y) < (this.radius + otherComponent.radius) * (this.radius + otherComponent.radius)) {
			var myVelocity = Math.sqrt(otherComponent.xvel * otherComponent.xvel + otherComponent.yvel * otherComponent.yvel);
			var otherVelocity = Math.sqrt(this.xvel * this.xvel + this.yvel * this.yvel);
			var THETA = Math.atan2((this.y - otherComponent.y), (this.x - otherComponent.x));
			//alert(THETA);
			
			if(!this.shielded) {
				this.xvel = myVelocity * Math.cos(THETA);
				this.yvel = myVelocity * Math.sin(THETA);
				
				for(var p = 0; p < myVelocity * 5; p++) {
					particles.push(new particle(this.color,this.x,this.y,Math.random() * 20 - 10,Math.random() * 20 - 10, 1));
				}
			} else {
				this.xvel = myVelocity * Math.cos(THETA) / 3;
				this.yvel = myVelocity * Math.sin(THETA) / 3;
				this.shielded = false;
				
				for(var p = 0; p < 100; p++) {
					particles.push(new particle("gray",this.x,this.y,Math.random() * 20 - 10,Math.random() * 20 - 10, 1));
				}
			}
			
			if(!otherComponent.shielded) {
				otherComponent.xvel = otherVelocity * -Math.cos(THETA);
				otherComponent.yvel = otherVelocity * -Math.sin(THETA);
				
				for(var p = 0; p < otherVelocity * 5; p++) {
					particles.push(new particle(otherComponent.color,otherComponent.x,otherComponent.y,Math.random() * 20 - 10,Math.random() * 20 - 10, 1));
				}
			} else {
				otherComponent.xvel = otherVelocity * -Math.cos(THETA) / 3;
				otherComponent.yvel = otherVelocity * -Math.sin(THETA) / 3;
				otherComponent.shielded = false;
				
				for(var p = 0; p < 100; p++) {
					particles.push(new particle("gray",otherComponent.x,otherComponent.y,Math.random() * 20 - 10,Math.random() * 20 - 10, 1));
				}
			}
		}
		
	}
}


var players;
var particles;


var playerSelectInterval;

function startPlayerSelect() {
	var divsToHide = document.getElementsByClassName("charselect"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "visible"; // or
        divsToHide[i].style.display = "inline-block"; // depending on what you're doing
    }
	myGameArea.canvas.style.display = "none";
	myGameArea.canvas.style.visibility = "hidden";
	playerSelectInterval = setInterval(playerSelect,20);
}
var player1char = 0;
var player2char = 0;
var p1down = 0;
var p2down = 0;
var end = 0;
function playerSelect() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	console.log(gamepads);
	var player1boxes = document.getElementById("player1").children;
	var player2boxes = document.getElementById("player2").children;
	console.log(player1boxes);
	console.log(player2boxes);
	for (var i = 0; i < 2; i++) {
		if(gamepads[i].buttons[5].value === 1) {
			if(i === 0) {
				if(p1down < 0) {
					player1char = (player1char + 1) % 4;
					p1down = 7;
				}
				
			} else { 
				if(p2down < 0) {
					player2char = (player2char + 1) % 4;
					p2down = 7;
				}
			}
		}
		if(gamepads[i].buttons[4].value === 1) {
			if(i === 0) {
				if(p1down < 0) {
					player1char = (player1char + 3) % 4;
					p1down = 7;
				}
			} else {
				if(p2down < 0) {
					player2char = (player2char + 3) % 4;
					p2down = 7;
				}
			}
		}
		p1down--;
		p2down--;
		
	}
	for(var j = 0; j < 4; j++) {
		player1boxes[j].style.borderColor = colors[j];
		player2boxes[j].style.borderColor = colors[j];
	}
	player1boxes[player1char].style.borderColor = "black";
	player2boxes[player2char].style.borderColor = "black";
	
	if(gamepads[0].buttons[15].value === 1 && gamepads[1].buttons[1].value === 1) {
		clearInterval(playerSelectInterval);
		startGame("black",colors[player2char]);
	} else if(gamepads[0].buttons[1].value === 1 && gamepads[1].buttons[15].value === 1) {
		clearInterval(playerSelectInterval);
		startGame(colors[player1char],"black");
	} else if(gamepads[0].buttons[1].value === 1 && gamepads[1].buttons[1].value === 1) {
		clearInterval(playerSelectInterval);
		startGame(colors[player1char],colors[player2char]);
	}
}
function startGame(color1, color2) {
	var divsToHide = document.getElementsByClassName("charselect"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "hidden"; // or
        divsToHide[i].style.display = "none"; // depending on what you're doing
    }
	myGameArea.canvas.style.visibility = "visible";
	myGameArea.canvas.style.display = "inline-block";
    players = [new component(50,color1,250,500,0,0,100),new component(50,color2,1000,500,0,0,100)];
	particles = [];
    myGameArea.start();
}

function fixAxis(value) {
	return Math.round((value * 7 + 7) / 2);
}

function gameLoop() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
	console.log(gamepads);
  for (var i = 0; i < 2; i++) {
	/*
	console.log(gamepads[i]);
	for(var j = 0; j < gamepads[i].buttons.length; j++) {
		console.log(gamepads[i].buttons[j].value);
	}
	console.log(gamepads[i].axes);
	console.log(gamepads[i].axes)
	console.log(fixAxis(gamepads[i].axes[9]));
	*/
	
	if(fixAxis(gamepads[i].axes[9]) === 3 || fixAxis(gamepads[i].axes[9]) === 4 || fixAxis(gamepads[i].axes[9]) === 5) {
		players[i].yvel += 0.1;
	}
	if((gamepads[i].buttons[0].value === 1) && (players[i].y === myGameArea.canvas.height - players[i].radius)) {
		players[i].yvel -= 15;
	}
	if(fixAxis(gamepads[i].axes[9]) === 1 || fixAxis(gamepads[i].axes[9]) === 2 || fixAxis(gamepads[i].axes[9]) === 3) {
		players[i].xvel += 0.5;
	}
	if(fixAxis(gamepads[i].axes[9]) === 5 || fixAxis(gamepads[i].axes[9]) === 6 || fixAxis(gamepads[i].axes[9]) === 7) {
		players[i].xvel -= 0.5;
	}
	players[i].cooldown -= 0.02;
	if(players[i].cooldown < 0) {
		players[i].cooldown = 0;
	}
	if(gamepads[i].buttons[1].value === 1 && players[i].cooldown === 0) {
		players[i].cooldown = 5;
		if(players[i].color === "red") {
			players[i].xvel *= -0.1;
			players[i].yvel *= -0.1;
			for(var p = 0; p < 25; p++) {
				particles.push(new particle("yellow",players[i].x,players[i].y,players[i].xvel + Math.random() * 10 - 5, players[i].yvel + Math.random() * 10 - 5, 3));
			}
		}
		if(players[i].color === "blue") {
			players[i].xvel *= 1.5;
			players[i].yvel *= 1.5;
			for(var p = 0; p < 25; p++) {
				particles.push(new particle("cyan",players[i].x,players[i].y,players[i].xvel + Math.random() * 10 - 5, players[i].yvel + Math.random() * 10 - 5, 3));
			}
		}
		if(players[i].color === "green") {
			players[i].shielded = true;
		}
		if(players[i].color === "yellow") {
			var old = players[i].x;
			var oldY = players[i].x;
			players[i].x += players[i].xvel*20;
			players[i].y += players[i].yvel*5;
			for(var p = 0; p < 100; p++) {
				var rand = Math.random();
				particles.push(new particle("white",rand * old + (1 - rand) * players[i].x, rand * oldY + (1 - rand) * players[i].y, Math.random() * 4 - 2,Math.random() * 4 - 2, 1));
			}
		}
		if(players[i].color === "black") {
			players[i].health += 10;
			for(var p = 0; p < 75; p++) {
				particles.push(new particle("#00FF00",players[i].x,players[i].y,players[i].xvel + Math.random() * 10 - 5, players[i].yvel + Math.random() * 30 - 15, .5));
			}
		}
	}
	
	
  }
  myGameArea.clear();
 
  for(var i = 0; i < players.length; i++) {
	  players[i].update();
  }
  for(var p = 0; p < particles.length; p++) {
	  particles[p].update();
	  if(particles[p].timer < 0) {
		  particles.splice(p,1);
	  }
  }
  players[0].checkCollision(players[1]); //change eventually to handle more players

  
  if(players[0].health <= 0) {
	  for(var i = 0; i < players.length; i++) {
	     players[i].update();
	  }
	  alert("Player 2 wins!");
	  clearInterval(myGameArea.interval);
	  end = 0;
	  startPlayerSelect();
  }
  if(players[1].health <= 0) {
	  for(var i = 0; i < players.length; i++) {
		players[i].update();
	  }
	  alert("Player 1 wins!");
	  clearInterval(myGameArea.interval);
	  end = 0;
	  startPlayerSelect();
  }
}