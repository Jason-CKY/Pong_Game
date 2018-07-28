/// <reference path="../p5.global-mode.d.ts" />

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;
const BALL_DIAMETER = 15;
const MAX_BALL_SPEED = 20;
const INIT_BALL_SPEED = 5;
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
		fill(255);
		ellipse(this.x, this.y, this.diameter);
	}
	move(){
		this.edgeReflection();
		this.x += this.vx;
		this.y += this.vy;
	}
	edgeReflection(){
		//	bouncing the ball off the top and bottom edge
		if(this.y <= this.diameter/2 || CANVAS_HEIGHT - this.y 	<= this.diameter/2){
			this.vy*=-1;
		}
	}
	reflectBall(){
		this.vx *= -1;
		this.vy *= -1;
	}
	hitLeftEdge(){
		return dist(0, 0, this.x, 0) <= 0;
	}
	hitRightEdge(){
		return dist(CANVAS_WIDTH, 0, this.x, 0) <= 0;
	}
	resetBall(){
		this.x = CANVAS_WIDTH/2;
		this.y = CANVAS_HEIGHT/2;
		this.vx *= -1;
		this.vy = INIT_BALL_SPEED;
	}
}

class Paddle{
	constructor(x, y, width, height, vy=0){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vy = vy;
	}
	getX(){return this.x;}
	getY(){return this.y;}
	getVY(){return this.vy;}
	getWidth(){return this.width;}
	getHeight(){return this.height;}
	setX(x){this.x=x;}
	setY(y){this.y=y;}
	setVY(vy){this.vy=vy;}
	setWidth(width){this.width=width;}
	setHeight(height){this.height=height;}

	display(){
		fill(255);
		rect(this.x, this.y, this.width, this.height);
	}

	followMouse(yMouse){
		this.y = yMouse - this.height/2;
	}

	selfMove(){
		this.y += this.vy;
		if( (this.y + this.height) >= CANVAS_HEIGHT || this.y<= 0){
			this.vy *= -1;
		}
	}
}

let ball, paddleLeft, paddleRight;
let score_Left = 0, score_Right = 0;
function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	ball = new Ball(100, 100, BALL_DIAMETER, INIT_BALL_SPEED, INIT_BALL_SPEED);
	paddleLeft = new Paddle(0, 0, 10, 150);
	paddleRight = new Paddle(CANVAS_WIDTH-10, 0, 10, 150);
	paddleRight.setVY(5);
}

function draw() {
	background(0);
	ball.display();
	paddleLeft.display();
	paddleRight.display();
	paddleRight.selfMove();
	ball.move();
	//	collision logic.
	collisionDetection();
	//	counting scores
	countScoreAndResetBall();
}

function mouseMoved(){
	paddleLeft.followMouse(mouseY);
}

//	collision logic with paddle
function collisionDetection(){
	let ball_Left = ball.getX() - ball.getDiameter()/2;
	let ball_Right = ball.getX() + ball.getDiameter()/2;
	let ball_Up = ball.getY() - ball.getDiameter()/2;
	let ball_Down = ball.getY() + ball.getDiameter()/2;
	let paddleLeft_CenterY = paddleLeft.getY() + paddleLeft.getHeight()/2;
	let paddleRight_CenterY = paddleRight.getY() + paddleRight.getHeight()/2;
	//	if hit left paddle
	if(	(ball_Left <= paddleLeft.getWidth() && ball_Left >= 0) && 
		(ball_Up <= paddleLeft.getY() + paddleLeft.getHeight()) &&
		(ball_Down >= paddleLeft.getY())
	){
		ball.setVX(ball.getVX() * -1);
		//  set vy to be the distance from center of paddle to the y pos of ball
        //  if ball hit center of paddle, vy = 0
		let deltaY = ball.getY() - paddleLeft_CenterY;
		ball.setVY(map(deltaY, -paddleLeft.getHeight()/2, paddleLeft.getHeight()/2, -MAX_BALL_SPEED, MAX_BALL_SPEED));
	}
	//	if hit right paddle
	else if((ball_Right >= paddleRight.getX()) && 
			(ball_Up <= paddleRight.getY() + paddleRight.getHeight()) &&
			(ball_Down >= paddleRight.getY())
	){
		ball.setVX(ball.getVX() * -1);
		//  set vy to be the distance from center of paddle to the y pos of ball
        //  if ball hit center of paddle, vy = 0
		let deltaY = ball.getY() - paddleRight_CenterY;
		ball.setVY(map(deltaY, -paddleRight.getHeight()/2, paddleRight.getHeight()/2, -MAX_BALL_SPEED, MAX_BALL_SPEED));
	}

}

//	counting score
function countScoreAndResetBall(){
	if(ball.hitLeftEdge()){
		score_Left ++;
		ball.resetBall();
	}
	else if(ball.hitRightEdge()){
		score_Right ++;
		ball.resetBall();
	}
}