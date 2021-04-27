let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth*2;
canvas.height = window.innerHeight*2;
canvas.style = "transform: scale(0.5)";

let cursor = {
	x: -1000,
	y: -1000
}

let options = {
	firstColor: "white",
	secondColor: "black"
}

let particles = {
	list: [],
	update: function() {
		particles.list.forEach(function(el, index, array) {
			el.update();
		});
		particles.draw();
		setTimeout(particles.update, 20);
	},
	create: function(obj={}) {
		let newObj = Object.create(particleDelegationObject);
		newObj.speedX = obj.speedX ?? Math.random()*2-1;
		newObj.speedY = obj.speedY ?? Math.random()*2-1;
		newObj.color = obj.color ?? options.firstColor;
		newObj.radius = obj.radius ?? 2;
		newObj.x = obj.x ?? Math.random()*canvas.width;
		newObj.y = obj.y ?? Math.random()*canvas.height;
		particles.list.push(newObj);
	},
	draw: function() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		particles.list.forEach(function(el, index, array) {
			let distanceFromCursor = Math.sqrt((el.x - cursor.x)*(el.x - cursor.x) + (el.y - cursor.y)*(el.y - cursor.y));
			let graynessForCursor = -1*distanceFromCursor*(128/(Math.min(canvas.width, canvas.height)/7))+128;
			let colorForCursor = `rgba(${graynessForCursor/2}, ${graynessForCursor*2}, ${graynessForCursor*2}, 255)`;
			if (distanceFromCursor < Math.min(canvas.width, canvas.height)/7) {
				canvasAdditionalFunctions.line({x1: el.x, y1: el.y, x2: cursor.x, y2: cursor.y, color: colorForCursor});
			}
			particles.list.forEach(function (el2, index2, array2) {
				let distance = Math.sqrt((el.x - el2.x)*(el.x - el2.x) + (el.y - el2.y)*(el.y - el2.y));
				let grayness = -1*distance*(128/(Math.min(canvas.width, canvas.height)/7))+128;
				let color = `rgba(${grayness/2}, ${grayness*2}, ${grayness*2}, 255)`;
				if (distance < Math.min(canvas.width, canvas.height)/7) {
					canvasAdditionalFunctions.line({x1: el.x, y1: el.y, x2: el2.x, y2: el2.y, color: color});
				}
			});
		});
	}
}

let canvasAdditionalFunctions = {
	circle: function(obj={}, context) {
		context = (context ?? ctx);
		context.beginPath();
		context.arc(
			obj.x ?? canvas.width/2,
			obj.y ?? canvas.height/2,
			obj.r ?? 10,
			0,
			2*Math.PI);
		context.fillStyle = obj.color ?? options.firstColor;
		context.fill();
		context.closePath();
	},
	line: function(obj={}, context) {
		context = (context ?? ctx);
		context.beginPath();
		context.moveTo(obj.x1, obj.y1);
		context.lineTo(obj.x2, obj.y2);
		context.lineWidth = 1;	
		context.strokeStyle = obj.color ?? options.firstColor;
		context.stroke();
		context.closePath();
	}
}

let particleDelegationObject = {
	update: function() {
		this.x+=this.speedX;
		this.y+=this.speedY;
		if (this.x < 0 + this.radius) {this.x = 0 + this.radius; this.speedX *= -1;}
		if (this.y < 0 + this.radius) {this.y = 0 + this.radius; this.speedY *= -1;}
		if (this.x > canvas.width - this.radius) {this.x = canvas.width - this.radius; this.speedX *= -1;}
		if (this.y > canvas.height - this.radius) {this.y = canvas.height - this.radius; this.speedY *= -1;}
	}
}

document.addEventListener("mousemove", function(e) {
	cursor.x = e.clientX*2;
	cursor.y = e.clientY*2;
});

let dynamicallyTypedText = {
	span: document.querySelector(".typingeffectspan"),
	phrases: ["really understand JavaScript?", "is passionate about coding?", "can learn quickly?", "know EcmaScript2015?", "want to develop?", "know how to learn?"],
	actualPhraseIndex: 0,
	phase: "waiting",
	speed: 80,
	update: function() {
		if (dynamicallyTypedText.phase == "waiting") {
			document.querySelector(".line").classList.add("lineborder");
			dynamicallyTypedText.phase = "removing";
			setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed);
			return;
		}
		if (dynamicallyTypedText.phase == "removing") {
			dynamicallyTypedText.span.textContent = dynamicallyTypedText.span.textContent.slice(0, dynamicallyTypedText.span.textContent.length - 1);
			if (dynamicallyTypedText.span.textContent.length == 0) {
				dynamicallyTypedText.actualPhraseIndex = (dynamicallyTypedText.actualPhraseIndex + 1) % dynamicallyTypedText.phrases.length;
				dynamicallyTypedText.phase = "typing";
				setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed*2);
				return;
			}
			setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed);
			return;
		}
		if (dynamicallyTypedText.phase == "typing") {
			dynamicallyTypedText.span.textContent += dynamicallyTypedText.phrases[dynamicallyTypedText.actualPhraseIndex].charAt(dynamicallyTypedText.span.textContent.length);
			if (dynamicallyTypedText.span.textContent.length == dynamicallyTypedText.phrases[dynamicallyTypedText.actualPhraseIndex].length) {
				dynamicallyTypedText.phase = "waiting";
				setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed*50);
				return;
			}
			setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed);
		}
	},
	cursorLineUpdate: function() {
		if (dynamicallyTypedText.phase == "waiting") document.querySelector(".line").classList.toggle("lineborder");
		setTimeout(dynamicallyTypedText.cursorLineUpdate, dynamicallyTypedText.speed*5);
	}
};

document.querySelector(".menu").addEventListener("click", function(e){
	let buttonClicked = false;
	if (e.target.classList.contains("homebuttonspan")) buttonClicked = "slogan";
	if (e.target.classList.contains("projectsbuttonspan")) buttonClicked = "projects";
	if (e.target.classList.contains("aboutmebuttonspan")) buttonClicked = "aboutme";
	if (e.target.classList.contains("contactbuttonspan")) buttonClicked = "contact";
	if (buttonClicked) {
		["slogan", "projects", "aboutme", "contact"].forEach(function(el, index, array){
			document.querySelector(`.${el}container`).classList.remove("shown");
			document.querySelector(`.${el}container`).classList.add("hidden");
		});
		document.querySelector(`.${buttonClicked}container`).classList.remove("hidden");
		document.querySelector(`.${buttonClicked}container`).classList.add("shown");
	}
});

document.querySelector(".contactspan").addEventListener("click", function(e){
	["slogan", "projects", "aboutme"].forEach(function(el, index, array){
		document.querySelector(`.${el}container`).classList.remove("shown");
		document.querySelector(`.${el}container`).classList.add("hidden");
	});
	document.querySelector(`.contactcontainer`).classList.remove("hidden");
	document.querySelector(`.contactcontainer`).classList.add("shown");
});

for (let i=0; i<window.innerHeight*window.innerWidth/10000; i++) {particles.create();}
particles.update();
setTimeout(dynamicallyTypedText.update, dynamicallyTypedText.speed*25);
dynamicallyTypedText.cursorLineUpdate();