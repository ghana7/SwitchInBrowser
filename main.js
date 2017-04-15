var buttonDict = {bottomB:0,rightB:1,leftB:2,topB:3,leftBumper:4,rightBumper:5,minus:8,plus:9,joyPush:10,home:13,sideBumper:14,sideTrigger:15};

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(gameLoop, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(radius, color, x, y, xvel, yvel) {
    this.radius = radius;
    this.x = x;
    this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.color = color;
	this.cooldown = 0;
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
		}
		if(this.x > canvas.width - this.radius) {
			this.x = canvas.width - this.radius;
			this.xvel *= -0.8;
		}
		this.xvel *= .95;
		this.yvel += 2;
        
        ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
    }
	this.checkCollision = function(otherComponent) {
		if((this.x - otherComponent.x)*(this.x - otherComponent.x) + (this.y - otherComponent.y)*(this.y - otherComponent.y) < (this.radius + otherComponent.radius) * (this.radius + otherComponent.radius)) {
			var myVelocity = Math.sqrt(otherComponent.xvel * otherComponent.xvel + otherComponent.yvel * otherComponent.yvel);
			var otherVelocity = Math.sqrt(this.xvel * this.xvel + this.yvel * this.yvel);
			var THETA = Math.atan2((this.y - otherComponent.y), (this.x - otherComponent.x));
			//alert(THETA);
			this.xvel = myVelocity * Math.cos(THETA);
			this.yvel = myVelocity * Math.sin(THETA);
			
			otherComponent.xvel = otherVelocity * -Math.cos(THETA);
			otherComponent.yvel = otherVelocity * -Math.sin(THETA);
		}
	}
}

var players;
function startGame() {
    players = [new component(50,"red",200,500,0,0),new component(50,"blue",700,500,0,0)];
    myGameArea.start();
}

function fixAxis(value) {
	return Math.round((value * 7 + 7) / 2);
}

function gameLoop() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  for (var i = 0; i < 2; i++) {
	/*
	console.log(gamepads[i]);
	for(var j = 0; j < gamepads[i].buttons.length; j++) {
		console.log(gamepads[i].buttons[j].value);
	}
	console.log(gamepads[i].axes);
	*/
	console.log(gamepads[i].axes)
	console.log(fixAxis(gamepads[i].axes[9]));
	
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
	if(gamepads[i].buttons[1].value === 1 && players[i].cooldown === 0) {
		players[i].cooldown = 5;
		if(players[i].color === "red") {
			players[i].xvel = 0;
			players[i].yvel = 0;
			alert("fuck assassins");
		}
		if(players[i].color === "blue") {
			players[i].xvel *= 1.5;
			players[i].yvel *= 1.5;
		}
	}
	
	
  }
  myGameArea.clear();
  
  for(var i = 0; i < players.length; i++) {
	  players[i].update();
  }
  players[0].checkCollision(players[1]); //change eventually to handle more players
  //players[1].checkCollision(players[0]);
}