/*
	yukawa.js
	Simulation of yukawa potential on 2 spherical masses
	Mid Exam of FI4278 Computation of Granular Systems
	
	Harianto Wibowo | hariantowb@gmail.com
	
	Include: <script src="butiran.js"></script> in a HTML file
			 <script src="hello.js"></script> in a HTML file
	Execute: Refresh web browser viewing the HTML file
*/

// Define global variables for parameters
var gsqr, alfa;

// Define global variables for simulation
var tstep, tbeg, tend, tdata, tproc, proc, t, Ndata, idata;

// Define global variables for coordinates
var xmin, ymin, xmax, ymax, XMIN, YMIN, XMAX, YMAX;

// Define global variables for grains
var diag, numg, geng, r, v, m, D;
var x1, y1, v1x, v1y;
var x2, y2, v2x, v2y;
var m1, m2;
var d1, d2;

// Define global variables for visual elements
var taIn, caOut, taOut0, taOut1;
var btClear, btLoad, btRead, btStart, btInfo;

// Execute main function
main();

// Define main function
function main() {
	// Set layout of visual elements
	setElementsLayout();
	
	// Initialize physical parameters
	initParams();
}

// Perform simulation
function simulate() {
	// Stop simulation
	if(t >= tend) {
		btStart.innerHTML = "Start";
		btStart.disabled = true;
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops, t = end\n\n");
		clearInterval(proc);
	}
	
	// Verbose result each tdata period
	if(idata == Ndata) {
		var digit = -Math.floor(Math.log10(tdata));
		var tt = t.toExponential(digit);
		
		x1 = r[0].y.toFixed(digit + 2);
		y1 = r[0].z.toFixed(digit + 2);
		v1x = v[0].y.toFixed(digit + 2);
		v1y = v[0].z.toFixed(digit + 2);
		
		x2 = r[1].y.toFixed(digit + 2);
		y2 = r[1].z.toFixed(digit + 2);
		v2x = v[1].y.toFixed(digit + 2);
		v2y = v[1].z.toFixed(digit + 2);
		
		// Display header for first run
		if(t == tbeg) {
			tout(taOut0, "#t\tx1\ty1\tv1x\tv1y\tx2\ty2\tv2x\tv2y\n");
		}
		
		tout(taOut0,
			tt + "\t" +
			x1 + "\t" +
			y1 + "\t" +
			v1x + "\t" +
			v1y + "\t" +
			x2 + "\t" +
			y2 + "\t" +
			v2x + "\t" +
			v2y+ "\n"
		);
		
		if(t >= tend) {
			tout(taOut0, "\n");
		}
		
		clearCanvas();
		drawSystem();
		
		idata = 0;
	}
	
	// Prepare variable for storing total force
	var F = [];
	for(var i = 0; i < numg; i++) {
		F.push(new Vect3());
	}
	
	//Calculate force due to yukawa potential
	for(var i = 0; i < numg; i++){
		var Fy = new Vect3();
		for(var j = 0; j < numg; j++){
			if(j !=i){
				var rij = Vect3.sub(r[i], r[j]);
				var nij = rij.unit();
				var lij = rij.len();
				var expv = -1 * alfa * m[i] * lij;
				var fact = alfa * m[i] + (1 / lij);
				var fy = -1 * gsqr * fact * Math.exp(expv) / lij;
				Fy = Vect3.mul(fy, nij);
			}
		}
		F[i] = Vect3.add(F[i], Fy);
	} 
		
	// Calculate acceleration, velocity, and position
	for(var i = 0; i < numg; i++) {
		var a = Vect3.div(F[i], m[i]);
		v[i] = Vect3.add(v[i], Vect3.mul(tstep, a));
		r[i] = Vect3.add(r[i], Vect3.mul(tstep, v[i]));
	}
	
	// Increase time
	idata++;
	t += tstep;
}

// Set layout of all elements
function setElementsLayout() {
	// Create input textarea
	taIn = document.createElement("textarea");
	taIn.style.width = "158px";
	taIn.style.height = "390px";
	taIn.style.overflowY = "scroll"
	taIn.style.float = "left";
	
	// Create output canvas
	caOut = document.createElement("canvas");
	caOut.width = "1110";
	caOut.height = "394";
	caOut.style.width = caOut.width + "px";
	caOut.style.height = caOut.height + "px";
	caOut.style.float = "left";
	caOut.style.border = "#aaa 1px solid";
	//caOut.style.paddingRight = "2px";
	var cx = caOut.getContext("2d");
	cx.fillStyle = "#fff";
	cx.fillRect(0, 0, caOut.width, caOut.height);
	XMIN = 0;
	YMIN = caOut.height;
	XMAX = caOut.width;
	YMAX = 0;
	
	// Create ouput textarea 0
	taOut0 = document.createElement("textarea");
	taOut0.style.width = "836px";
	taOut0.style.height = "225px"
	taOut0.style.overflowY = "scroll";
	taOut0.style.float = "left";
	
	// Create ouput textarea 1
	taOut1 = document.createElement("textarea");
	taOut1.style.width = "500px";
	taOut1.style.height = "225px";
	taOut1.style.overflowY = "scroll";
	taOut1.style.float = "left";
	
	// Create buttons
	btClear = document.createElement("button");
	btClear.innerHTML = "Clear";
	btClear.style.width = "70px";
	btClear.addEventListener("click", buttonClick);

	btLoad = document.createElement("button");
	btLoad.innerHTML = "Load";
	btLoad.style.width = "70px";
	btLoad.addEventListener("click", buttonClick);
	
	btRead = document.createElement("button");
	btRead.innerHTML = "Read";
	btRead.style.width = "70px";
	btRead.disabled = true;
	btRead.addEventListener("click", buttonClick);

	btStart = document.createElement("button");
	btStart.innerHTML = "Start";
	btStart.style.width = "70px";
	btStart.disabled = true;
	btStart.addEventListener("click", buttonClick);

	btInfo = document.createElement("button");
	btInfo.innerHTML = "Info";
	btInfo.style.width = "70px";
	btInfo.addEventListener("click", buttonClick);
	
	// Create up division
	var div0 = document.createElement("div");
	div0.style.border = "#aaa 1px solid";
	div0.style.width = 80
		+ parseInt(taIn.style.width)
		+ parseInt(caOut.style.width) + "px";
	div0.style.height = 6
		+ parseInt(taIn.style.height) + "px";
	div0.style.background = "#eee";
	
	// Create button division
	var div1 = document.createElement("div");
	div1.style.width = "70px";
	div1.style.height = (105 + 290) + "px";
	div1.style.float = "left";
	div1.style.border = "#aaa 1px solid";
	
	// Create down division
	var div2 = document.createElement("div");
	div2.style.border = "#aaa 1px solid";
	div2.style.width = 12
		+ parseInt(taOut0.style.width)
		+ parseInt(taOut1.style.width) + "px";
	div2.style.height = 6
		+ parseInt(taOut0.style.height) + "px";
	div2.style.background = "#eee";
	
	// Set layout of visual components
	document.body.append(div0);
		div0.append(taIn);
		div0.append(div1);
			div1.append(btClear);
			div1.append(btLoad);
			div1.append(btRead);
			div1.append(btStart);
			div1.append(btInfo);
		div0.append(caOut);
	document.body.append(div2);	
		div2.append(taOut0);
		div2.append(taOut1);
}

// Do something when buttons clicked
function buttonClick() {
	// Get target and verbose to taOut1
	var target = event.target;
	var cap = target.innerHTML;
	tout(taOut1, cap + "\n");
	
	// Perform according to the clicked button
	if(cap == "Load") {
		loadParameters(taIn);
		btRead.disabled = false;
		tout(taOut1, "Parameters are loaded\n\n");
	} else if(cap == "Clear") {
		clearAll();
		btRead.disabled = true;
		btStart.disabled = true;
		tout(taOut1, "All are cleared except this element\n\n");
	} else if(cap == "Read") {
		readParameters(taIn);
		initParams();
		clearCanvas();
		drawSystem();
		btStart.disabled = false;
		tout(taOut1, "Parameters are read\n");
		tout(taOut1, "Slightly random grains position "
			+ "are generated\n\n");
	} else if(cap == "Start") {
		target.innerHTML = "Stop";
		btRead.disabled = true;
		taIn.disabled = true;
		tout(taOut1, "Simulation starts\n\n");
		proc = setInterval(simulate, tproc);
	} else if(cap == "Stop") {
		target.innerHTML = "Start";
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops\n\n");
		clearInterval(proc);
	} else if(cap == "Info") {
		tout(taOut1, "yukawa.js -- 20190323\n"
			+ "Simulation of Yukawa Potential\n "
			+ "on 2 Spherical Masses\n"
			+ "Harianto Wibowo| "
			+ "hariantowb@gmail"
			+ "\n\n"
		);
	}
}

// Draw all parts of the system
function drawSystem() {
	var cx = caOut.getContext("2d");
	for(var i = 0; i < numg; i++) {
		var xx = r[i].y;
		var yy = r[i].z;
		var R1 = transform(xx, yy);
		var R2 = transform(xx + 0.5 * D[i], yy)
		
		cx.beginPath();
		cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
		cx.fillStyle = "#a8f";
		cx.closePath();
		cx.fill();
		
		cx.beginPath();
		cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
		cx.strokeStyle = "#000";
		cx.stroke();
	}
	
	// Transform real coordinates to canvas coordinates
	function transform(xx, yy) {
		var XX = (xx - xmin) / (xmax - xmin) * (XMAX - XMIN)
			+ XMIN;
		var YY = (yy - ymin) / (ymax - ymin) * (YMAX - YMIN)
			+ YMIN;
		return {X: XX, Y: YY};
	}
}

// Clear all
function clearAll() {
	taIn.value = "";
	taOut0.value = "";
	clearCanvas();
}

function clearCanvas() {
	var cx = caOut.getContext("2d");
	cx.fillStyle = "#fff";
	cx.fillRect(0, 0, caOut.width, caOut.height);	
}

// Load parameters to textarea
function loadParameters() {
	var lines = "";
	
	
	lines += "# Simulation\n";
	lines += "TSTEP 0.001\n";   // Time step        s
	lines += "TBEG 0\n";        // Initial time     s
	lines += "TEND 100\n";      // Final time       s
	lines += "TDATA 0.01\n";    // Data period      s
	lines += "TPROC 1\n";       // Event period     ms
	
	lines += "\n";
	lines += "# Grains\n";
	lines += "X1 -0.01\n"; 
	lines += "Y1 0\n";
	lines += "X2 0.03\n";
	lines += "Y2 -0.05\n";
	lines += "V1X 0\n";
	lines += "V1Y 0\n";
	lines += "V2X -1\n";
	lines += "V2Y 0\n";
	lines += "M1 10000\n";
	lines += "M2 10\n";
	lines += "D1 0.01\n";
	lines += "D2 0.01\n";
	lines += "NUMG 2\n";	    // Number of grains -
	
	lines += "\n";
	lines += "# Parameters\n"; 
	lines += "GSQR 1\n";   		// g square constant 
	lines += "ALFA 1\n";        // alfa constant                 
	
	lines += "\n";
	lines += "# Coordinates\n"; 
	lines += "XMIN -0.2\n";   // xmin             m
	lines += "YMIN -0.1\n";        // ymin             m
	lines += "XMAX 0.2\n";    // xmax             m
	lines += "YMAX 0.1\n";    // ymax             m
	
	var ta = arguments[0];
	ta.value = lines;
	ta.scrollTop = ta.scrollHeight;
}

// Read parameters
function readParameters() {
	var lines = arguments[0].value;
	
	// Get parameters information
	gsqr = getValue(lines, "GSQR");
	alfa = getValue(lines, "ALFA");
	
	// Get simulation information
	tstep = getValue(lines, "TSTEP");
	tbeg = getValue(lines, "TBEG");
	tend = getValue(lines, "TEND");
	tdata = getValue(lines, "TDATA");
	tproc = getValue(lines, "TPROC");

	// Get coordinates information
	xmin = getValue(lines, "XMIN");
	ymin = getValue(lines, "YMIN");
	xmax = getValue(lines, "XMAX");
	ymax = getValue(lines, "YMAX");

	// Get grains information
	x1 = getValue(lines, "X1");
	y1 = getValue(lines, "Y1");
	x2 = getValue(lines, "X2");
	y2 = getValue(lines, "Y2");
	v1x = getValue(lines, "V1X");
	v1y = getValue(lines, "V1Y");
	v2x = getValue(lines, "V2X");
	v2y = getValue(lines, "V2Y");
	m1 = getValue(lines, "M1");
	m2 = getValue(lines, "M2");
	d1 = getValue(lines, "D1");
	d2 = getValue(lines, "D2");
	numg = getValue(lines, "NUMG");
	
}

// Get value from a line inside parameter textarea
function getValue(lines, key) {
	var value = undefined;
	var line = lines.split("\n");
	var N = line.length;
	for(var i = 0; i < N; i++) {
		var col = line[i].split(" ");
		if(col[0] == key) {
			value = parseFloat(col[1]);
		}
	}
	return value;
}

// Initialize all parameters
function initParams() {	
	// Define grains properties
	r = [new Vect3(0, x1, y1), new Vect3(0, x2, y2)];
	v = [new Vect3(0, v1x, v1y), new Vect3(0, v2x, v2y)];
	m = [m1, m2];
	D = [d1, d2];
	
	// Initialize simulation parameters
	t = tbeg;
	Ndata = Math.floor(tdata / tstep);
	idata = Ndata;
}

// Display text in an output textarea
function tout() {
	var taOut = arguments[0];
	var msg = arguments[1];
	taOut.value += msg;
	taOut.scrollTop = taOut.scrollHeight;
}