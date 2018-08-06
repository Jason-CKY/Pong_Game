const INIT_BALL_SPEED = 7;
const BALL_DIAMETER = 15;
const MAX_BALL_SPEED = 20;
class Ball{
	constructor(x, y, diameter, vx, vy){
		this.x = x;
		this.y = y;
		this.diameter = diameter;
		this.vx = vx;
		this.vy = vy;
	}

	setVX(vx){this.vx = vx;}
	setVY(vy){this.vy = vy;}
	setSpeed(vx, vy){
		this.vx = vx;
		this.vy = vy;
	}

	setDiameter(diameter){this.diameter = diameter;}

	getX(){return this.x;}
	getY(){return this.y;}
	getDiameter(){return this.diameter;}
	getRadius(){return this.r;}
	getVX(){return this.vx;}
	getVY(){return this.vy;}

	display(){
		fill(255, 0, 0);
		ellipse(this.x, this.y, this.diameter);
	}
	move(){
		this.edgeReflection();
		this.x += this.vx;
		this.y += this.vy;
	}
	edgeReflection(){
		//	bouncing the ball off the top and bottom edge
		if(this.y <= this.diameter/2 || height - this.y 	<= this.diameter/2){
			this.vy*=-1;
		}
	}
	reflectBall(){
		this.vx *= -1;
		this.vy *= -1;
	}
	hitLeftEdge(){
		return this.x - 0 <= 0;
	}
	hitRightEdge(rightEdge){
		return rightEdge - this.x <= 0;
	}
	resetBall(){
		this.x = width/2;
		this.y = height/2;
		this.vx *= -1;
		this.vy = INIT_BALL_SPEED;
	}
}