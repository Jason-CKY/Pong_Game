/// <reference path="../p5.global-mode.d.ts" />

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;
const PADDLE_HEIGHT = 150;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 10;
const BALL_DIAMETER = 15;
const MAX_BALL_SPEED = 20;
const INIT_BALL_SPEED = 5;
const WIN_SCORE = 5;

//	keyCodes constants
const SINGLE_PLAYER = 49;
const TWO_PLAYER = 50;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const W_KEY = 87;
const S_KEY = 83;

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

	moveUp(speed){
		this.y -= speed;
	}
	moveDown(speed){
		this.y += speed;
	}

	bounded(){
		let paddleCenterY = this.y + this.height/2;
		if(paddleCenterY <= 0 ){
			this.y = -this.height/2;
		}
		else if(paddleCenterY >= CANVAS_HEIGHT){
			this.y = CANVAS_HEIGHT - this.height/2;
		}
	}
	chaseBall(ball){
		let paddleCenterY = this.y + this.height/2;
		// adjust the allowance of error of computer paddle to be 20% of PADDLE_HEIGHT
		let paddleAllowance = 0.2*PADDLE_HEIGHT;
		// Make the center of the paddle chase the ball co-ordinates
		if(paddleCenterY < ball.getY() - paddleAllowance){
			this.y += this.vy;
		}
		else if(paddleCenterY > ball.getY() + paddleAllowance){
			this.y -= this.vy;
		}
	}
}

let ball, paddleLeft, paddleRight;
let score_Left = 0, score_Right = 0;
let gameHasStarted = false;
let singlePlayer = false;
let twoPlayer = false;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	ball = new Ball(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, BALL_DIAMETER, INIT_BALL_SPEED, INIT_BALL_SPEED);
	paddleLeft = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	paddleRight = new Paddle(CANVAS_WIDTH-10, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	paddleRight.setVY(PADDLE_SPEED);
}

function draw() {
	background(0);
	if(!gameHasStarted){
		drawTitleScreen();
	}
	else{
		//	test for win condition
		if(isGameWon()){
			drawWinScreen();
		}
		drawScore();
		drawNet();
		paddleLeft.display();
		paddleRight.display();
		if(!isGameWon()){
			ball.display();
			if(singlePlayer){
				paddleRight.chaseBall(ball);
			}
			else if(twoPlayer){
				twoPlayerMode();
			}
			ball.move();
		}
		//	collision logic.
		collisionDetection();
		//	counting scores
		countScoreAndResetBall();
	}
}

//	event listeners
function mouseMoved(){
	if(!isGameWon() && singlePlayer){
		paddleLeft.followMouse(mouseY);
	}
}

function mouseClicked(){
	if(isGameWon()){
		score_Left = 0;
		score_Right = 0;
		ball.resetBall();
	}
	// prevent default
	return false;
}

function keyPressed(){
	if(!gameHasStarted){
		if(keyCode == SINGLE_PLAYER){
			gameHasStarted = true;
			singlePlayer = true;
		}
		else if(keyCode == TWO_PLAYER){
			gameHasStarted = true;
			twoPlayer = true;
		}
	}
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
		score_Right ++;
		ball.resetBall();
	}
	else if(ball.hitRightEdge()){
		score_Left ++;
		ball.resetBall();
	}
}

//	map the paddle movements to the arrow keys and WASD for 2 player
function twoPlayerMode(){
	if(keyIsDown(W_KEY)){
		paddleLeft.moveUp(PADDLE_SPEED);
	}
	if(keyIsDown(S_KEY)){
		paddleLeft.moveDown(PADDLE_SPEED);
	}
	if(keyIsDown(UP_ARROW)){
		paddleRight.moveUp(PADDLE_SPEED);
	}
	if(keyIsDown(DOWN_ARROW)){
		paddleRight.moveDown(PADDLE_SPEED);
	}
	paddleLeft.bounded();
	paddleRight.bounded();
}

//	drawing graphics
function drawScore(){
	fill(255);
	textFont("Georgia");
	textSize(20);
	text(score_Left, width/4, height/5);
	text(score_Right, width*3/4, height/5);
}

function drawTitleScreen(){
	fill(255);
	textFont("Georgia");
	textSize(70);
	textAlign(CENTER);
	text("Pong Game", width/2, height/4);
	textSize(15);
	text("Created by Cheng Kuan Yong Jason", width/2, height/3);
	text("Enter '1' for single player \nEnter '2' for 2-player", width/2, height/2);
}

function drawWinScreen(){
	background(0);
	fill(255);
	textFont("Georgia");
	textSize(70);
	textAlign(CENTER);
	let message;
	if(score_Left > score_Right){
		message = "Left player won!";
	}
	else{
		message = "Right player won!";
	}
	text(message, width/2, height/2);
	textSize(15);
	text("\n\n\nClick to continue", width/2, height/2);
}

function drawNet(){
	fill(255);
	for(let i=0; i<CANVAS_HEIGHT; i+=50){
		rect(CANVAS_WIDTH/2, i, 10, 40);
	}
}

//	checking win condition
function isGameWon(){
	return score_Left >= WIN_SCORE || score_Right >= WIN_SCORE;
}