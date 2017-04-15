var interval;

var buttonDict = {bottomB:0,rightB:1,leftB:2,topB:3,leftBumper:4,rightBumper:5,minus:8,plus:9,joyPush:10,home:13,sideBumper:14,sideTrigger:15};

if (!('ongamepadconnected' in window)) {
	
  // No gamepad events available, poll instead.
  interval = setInterval(pollGamepads, 500);
}

function pollGamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  for (var i = 0; i < gamepads.length; i++) {
    console.log(gamepads[i]);
	for(var j = 0; j < gamepads[i].buttons.length; j++) {
		console.log(gamepads[i].buttons[j].value);
	}
	console.log(gamepads[i].axes);
  }
}