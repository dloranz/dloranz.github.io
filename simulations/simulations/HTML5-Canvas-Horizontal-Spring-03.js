// v03 ...
// I chose to have each drawing function be resonpsible to draw all 3 copies
// of that function's element.  So for example, for drawWall, I only call the 
// function once each frame, but the function know to draw 3 walls.  
// For the box and spring, this means I have to feed 3 x-pixel values, one 
// for each spring system.  This design choice is probably opposite of what
// I should have done (call each draw function once per spring system).
// But this design got me up and going pretty quickly.  

var springCanvas = document.getElementById("springCanvas");
var springContext = springCanvas.getContext("2d");
var htmlTimer;

var yPadding = 30;
var leftPadding = 10;
var rightPadding = 10;
var yTable = springCanvas.height - yPadding;
var yOffset = 125;
var tableWidth = 2;
var tableColor = "blue";
var wallWidth = 5;
var wallColor = "blue";

var equilibTickWidth = 4;
var equilibTickColor = "red";
var refTickWidth = 2;
var refTickColor = "black";

// This is how to get the center of
// the tabletop, which might NOT be centered
// centered in the Canvas element.
var xEquilib = (springCanvas.width - rightPadding + leftPadding)/2.0;

// Set half-length of table in meters.
// Generally, I convert from meters to screen pixels
// as soon as possible.  So only as few things as possible 
// are in meters.  So far only tableEndpoints and oscillation
// amplitude are in meters.
var tableEndpoints = 1.0;  // in meters
// For lengthPerPixel I divide by the pixel-length of the tabletop.
var lengthPerPixel = (2*tableEndpoints)/(springCanvas.width - rightPadding - leftPadding);

var boxWidth = 40;
var boxHeight = 40;
var boxLine = 2;
var boxColor = "orange";

var k = 1; // Spring constant in Newtons / meter.
var mass = 1; // Box mass in kilograms.
var omega = Math.sqrt(k/mass);
var amp1 = 0.75; // In meters! Make sure amplitude is less than tableEndpoints.
var amp2 = 0.5;
var amp3 = 0.25;

var isRunning = false;
var timeStep = 0;

drawWall();
drawRefTicks();
drawTable();
drawBox(amp1/lengthPerPixel + xEquilib,
        amp2/lengthPerPixel + xEquilib,
        amp3/lengthPerPixel + xEquilib);
drawXTLabels(0, 0, 0, 0);

runSim();

function runSim() {
	if (isRunning) {
		
		timeStep = timeStep + 1;
		var t = 0;
		var x1 = 0;
		var x2 = 0;
		var x3 = 0;
		
		springContext.clearRect(0, 0, springCanvas.width, springCanvas.height);
		drawWall();
		drawRefTicks();
		drawTable();
		
		t = timeStep * 1/30;
		x1 = amp1 * Math.cos(omega*t);
		x2 = amp2 * Math.cos(omega*t);
		x3 = amp3 * Math.cos(omega*t);

		drawBox(x1/lengthPerPixel + xEquilib,
		        x2/lengthPerPixel + xEquilib,
		        x3/lengthPerPixel + xEquilib);	
		drawXTLabels(x1, x2, x3, t);
		
		htmlTimer = window.setTimeout(runSim, 1000/30);  // Refresh 30 times per sec.
	}
}

function drawTable(){
	springContext.beginPath();
	springContext.lineWidth = tableWidth;
	springContext.strokeStyle = tableColor;
	
	//bottom table
	springContext.moveTo(leftPadding, yTable);
	springContext.lineTo(springCanvas.width - rightPadding, yTable);
	
	// middle table
	springContext.moveTo(leftPadding, yTable - yOffset);
	springContext.lineTo(springCanvas.width - rightPadding, yTable - yOffset);

	// upper table
	springContext.moveTo(leftPadding, yTable - 2*yOffset);
	springContext.lineTo(springCanvas.width - rightPadding, yTable - 2*yOffset);
	
	springContext.stroke();
}

function drawWall() {
	springContext.beginPath();
	springContext.lineWidth = wallWidth;
	springContext.strokeStyle = wallColor;
	
	// bottom wall
	springContext.moveTo(leftPadding+2, yTable);
	springContext.lineTo(leftPadding+2, yTable - 50);
	
	// middle wall
	springContext.moveTo(leftPadding+2, yTable - yOffset);
	springContext.lineTo(leftPadding+2, yTable - yOffset - 50);
	
	// upper wall
	springContext.moveTo(leftPadding+2, yTable - 2*yOffset);
	springContext.lineTo(leftPadding+2, yTable - 2*yOffset - 50);
	
	springContext.stroke();
}

function drawRefTicks() {
	springContext.beginPath();
	springContext.lineWidth = equilibTickWidth;
	springContext.strokeStyle = equilibTickColor;
	
	// lower equilib mark
	springContext.moveTo(xEquilib, yTable);
	springContext.lineTo(xEquilib, yTable + 15);
	
	// middle equilib mark
	springContext.moveTo(xEquilib, yTable - yOffset);
	springContext.lineTo(xEquilib, yTable - yOffset + 15);
	
	// upper equilib mark
	springContext.moveTo(xEquilib, yTable - 2*yOffset);
	springContext.lineTo(xEquilib, yTable - 2*yOffset + 15);
	
	springContext.stroke();
	
	var xMark = 0;
	springContext.beginPath();
	springContext.lineWidth = refTickWidth;
	springContext.strokeStyle = refTickColor;
	for (i = -3; i <= 3; i++) {
		if (i == 0) {
			continue;
		}
		xMark = (tableEndpoints * i/4)/lengthPerPixel + xEquilib;
		// lower tick marks
		springContext.moveTo(xMark, yTable);
		springContext.lineTo(xMark, yTable + 10);
		
		// middle tick marks
		springContext.moveTo(xMark, yTable - yOffset);
		springContext.lineTo(xMark, yTable - yOffset + 10);
		
		// upprt tick marks
		springContext.moveTo(xMark, yTable - 2*yOffset);
		springContext.lineTo(xMark, yTable - 2*yOffset + 10);
	}
	springContext.stroke();
}

// Give drawBox the box center in pixels.
function drawBox(x1Pixel, x2Pixel, x3Pixel) {
	
	springContext.beginPath();
	
	// the spring 
	// Adjust xAnchor value as needed to make 
	// the overlap on the "wall" look right.
	var yAnchor = yTable - boxHeight / 2.0;
	var xAnchor = leftPadding + 5;
	springContext.lineWidth = 2;
	springContext.strokeStyle = "red";
	
	// lower spring
	springContext.moveTo(xAnchor, yAnchor);
	springContext.lineTo(xAnchor + 0.05*(x1Pixel - xAnchor), yAnchor);
	springContext.lineTo(xAnchor + 0.1*(x1Pixel - xAnchor), yAnchor - 10);
	for (iSpring = 2; iSpring <=8; iSpring = iSpring + 2) {
		springContext.lineTo(xAnchor + (iSpring / 10)*(x1Pixel - xAnchor), 
		                     yAnchor + 10);
		springContext.lineTo(xAnchor + ((iSpring + 1)/10)*(x1Pixel - xAnchor),
		                     yAnchor - 10);
	}
	springContext.lineTo(xAnchor + 0.95*(x1Pixel - xAnchor), yAnchor);
	springContext.lineTo(xAnchor + 1.0*(x1Pixel - xAnchor), yAnchor);

	springContext.stroke();
	
	// middle spring
	springContext.moveTo(xAnchor, yAnchor - yOffset);
	springContext.lineTo(xAnchor + 0.05*(x2Pixel - xAnchor), yAnchor - yOffset);
	springContext.lineTo(xAnchor + 0.1*(x2Pixel - xAnchor), yAnchor - yOffset - 10);
	for (iSpring = 2; iSpring <=8; iSpring = iSpring + 2) {
		springContext.lineTo(xAnchor + (iSpring / 10)*(x2Pixel - xAnchor), 
		                     yAnchor - yOffset + 10);
		springContext.lineTo(xAnchor + ((iSpring + 1)/10)*(x2Pixel - xAnchor),
		                     yAnchor - yOffset - 10);
	}
	springContext.lineTo(xAnchor + 0.95*(x2Pixel - xAnchor), yAnchor - yOffset);
	springContext.lineTo(xAnchor + 1.0*(x2Pixel - xAnchor), yAnchor - yOffset);

	springContext.stroke();
	
	// upper spring
	springContext.moveTo(xAnchor, yAnchor - 2*yOffset);
	springContext.lineTo(xAnchor + 0.05*(x3Pixel - xAnchor), yAnchor - 2*yOffset);
	springContext.lineTo(xAnchor + 0.1*(x3Pixel - xAnchor), yAnchor - 2*yOffset - 10);
	for (iSpring = 2; iSpring <=8; iSpring = iSpring + 2) {
		springContext.lineTo(xAnchor + (iSpring / 10)*(x3Pixel - xAnchor), 
		                     yAnchor - 2*yOffset + 10);
		springContext.lineTo(xAnchor + ((iSpring + 1)/10)*(x3Pixel - xAnchor),
		                     yAnchor - 2*yOffset - 10);
	}
	springContext.lineTo(xAnchor + 0.95*(x3Pixel - xAnchor), yAnchor - 2*yOffset);
	springContext.lineTo(xAnchor + 1.0*(x3Pixel - xAnchor), yAnchor - 2*yOffset);

	springContext.stroke();
	
	// the box
	springContext.lineWidth = boxLine;
	springContext.strokeStyle = boxColor;
	springContext.fillStyle = boxColor;
	
	// lower box
	springContext.fillRect(x1Pixel - boxWidth / 2.0, 
	                       yTable - (boxHeight + 2), 
	                       boxWidth, 
	                       boxHeight);
	
	// middle box
	springContext.fillRect(x2Pixel - boxWidth / 2.0, 
	                       yTable - yOffset - (boxHeight + 2), 
	                       boxWidth, 
	                       boxHeight);

	// upper box
	springContext.fillRect(x3Pixel - boxWidth / 2.0, 
	                       yTable - 2*yOffset - (boxHeight + 2), 
	                       boxWidth, 
	                       boxHeight);

	
}

function drawXTLabels(x1Arg, x2Arg, x3Arg, tArg){
	var timeLabel = "t = ";
	var x1Label = "x = ";
	var x2Label = "x = ";
	var x3Label = "x = ";
	
	timeLabel = timeLabel + tArg.toFixed(2) + " s";
	x1Label = x1Label + x1Arg.toFixed(2) + " m";
	x2Label = x2Label + x2Arg.toFixed(2) + " m";
	x3Label = x3Label + x3Arg.toFixed(2) + " m";
	springContext.font = "16pt Calibri";
	springContext.fillStyle = "black";
	springContext.textAlign = "left";
	springContext.fillText(timeLabel, 20, 20);
	springContext.fillText(x3Label, 20, 45); // upper
	springContext.fillText(x2Label, 20, 180); // middle
	springContext.fillText(x1Label, 20, 300); // lower
}

function playPause() {
	isRunning = !isRunning;
	
	var button = document.getElementById("playPauseButton");
	
	if (isRunning) {
		button.value = "Pause";
		runSim();
	} else if (!isRunning) {
		button.value = "Run";
		window.clearTimeout(htmlTimer);
	}
}

function reset() {
	isRunning = false;
	window.clearTimeout(htmlTimer);
	timeStep = 0;
	
	var button = document.getElementById("playPauseButton");
	button.value = "Run";
	
	springContext.clearRect(0, 0, springCanvas.width, springCanvas.height);
	drawWall();
	drawRefTicks();
	drawTable();
	drawBox(amp1/lengthPerPixel + xEquilib,
	        amp2/lengthPerPixel + xEquilib,
	        amp3/lengthPerPixel + xEquilib);
	drawXTLabels(0, 0, 0, 0);
}

function stepBack() {
	isRunning = false;
	window.clearTimeout(htmlTimer);
	
	var button = document.getElementById("playPauseButton");
	button.value = "Run";
	
	if (timeStep > 0) {
		timeStep = timeStep - 1;
		
		var t = 0;
		var x1 = 0;
		var x2 = 0;
		var x3 = 0;
		
		springContext.clearRect(0, 0, springCanvas.width, springCanvas.height);
		drawWall();
		drawRefTicks();
		drawTable();
		
		t = timeStep * 1/30;
		x1 = amp1 * Math.cos(omega*t);
		x2 = amp2 * Math.cos(omega*t);
		x3 = amp3 * Math.cos(omega*t);

		drawBox(x1/lengthPerPixel + xEquilib,
		        x2/lengthPerPixel + xEquilib,
		        x3/lengthPerPixel + xEquilib);	
		drawXTLabels(x1, x2, x3, t);
	}
}

function stepForward() {
	isRunning = false;
	window.clearTimeout(htmlTimer);
	
	var button = document.getElementById("playPauseButton");
	button.value = "Run";
	
		timeStep = timeStep + 1;
		
		var t = 0;
		var x1 = 0;
		var x2 = 0;
		var x3 = 0;
		
		springContext.clearRect(0, 0, springCanvas.width, springCanvas.height);
		drawWall();
		drawRefTicks();
		drawTable();
		
		t = timeStep * 1/30;
		x1 = amp1 * Math.cos(omega*t);
		x2 = amp2 * Math.cos(omega*t);
		x3 = amp3 * Math.cos(omega*t);

		drawBox(x1/lengthPerPixel + xEquilib,
		        x2/lengthPerPixel + xEquilib,
		        x3/lengthPerPixel + xEquilib);	
		drawXTLabels(x1, x2, x3, t);
}
