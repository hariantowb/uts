/*
	hello.js
	Create textarea for visualization
	Mid Exam of FI4278 Computation of Granular Systems
	
	Harianto Wibowo | hariantowb@gmail.com
	
	Include: <script src="hello.js"></script> in a HTML file
	Execute: Refresh web browser viewing the HTML file
*/

//Define global variable for visual element
var taIn;

//Execute main function
main();

//Define main function
function main(){
	//Set layout of visual element
	setElementLayout();
	
}

//Set layout of element
function setElementLayout(){
	//Create textarea
	taIn = document.createElement("textarea");
	taIn.style.width = "400px";
	taIn.style.height = "50px";
	taIn.style.float = "left";
	taIn.value = "Hello, Harianto Wibowo yang ber-NIM 10215029!"
	
	//Arrange element
	document.body.append(taIn);
}
