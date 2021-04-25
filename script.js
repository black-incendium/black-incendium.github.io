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
			particles.list.forEach(function (el2, index2, array2) {
				let distance = Math.sqrt((el.x - el2.x)*(el.x - el2.x) + (el.y - el2.y)*(el.y - el2.y))
				let grayness = -1*distance*(128/(Math.min(canvas.width, canvas.height)/7))+128;
				let color = `rgba(${grayness}, ${grayness}, ${grayness}, 255)`;
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
		context.lineWidth = 2;	
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

for (let i=0; i<150; i++) {particles.create();}
particles.update();
