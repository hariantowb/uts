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