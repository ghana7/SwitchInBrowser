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

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var players;
function startGame() {
    players = [new component(100,100,"red",100,100),new component(100,100,"blue",100,100)];
    myGameArea.start();
}


function gameLoop() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  for (var i = 0; i < gamepads.length; i++) {
    /*
	console.log(gamepads[i]);
	for(var j = 0; j < gamepads[i].buttons.length; j++) {
		console.log(gamepads[i].buttons[j].value);
	}
	console.log(gamepads[i].axes);
	*/
	if(gamepads[i].buttons[0].value === 1) {
		players[i].y++;
	}
	if(gamepads[i].buttons[1].value === 1) {
		players[i].x++;
	}
	if(gamepads[i].buttons[2].value === 1) {
		players[i].x--;
	}
	if(gamepads[i].buttons[3].value === 1) {
		players[i].y--;
	}
	
  }
  myGameArea.clear();
  
  for(var i = 0; i < players.length; i++) {
	  players[i].update();
  }
}