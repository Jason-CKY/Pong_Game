/// <reference path="../p5.global-mode.d.ts" />

const WIN_SCORE = 5;
//	keyCodes constants
const SINGLE_PLAYER = 49;
const TWO_PLAYER = 50;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const W_KEY = 87;
const S_KEY = 83;
const ESC = 27;


let ball, paddleLeft, paddleRight;
let score_Left = 0, score_Right = 0;
let gameHasStarted = false;
let singlePlayer = false;
let twoPlayer = false;

//	dom elements
let singlePlayer_Button, twoPlayer_Button;

function setup() {
	createCanvas(windowWidth, windowHeight);
	singlePlayer_Button = createButton("Single player (or press \"1\")");
	singlePlayer_Button.mousePressed(setSinglePlayer);
	twoPlayer_Button = createButton("2 player mode (or press \"2\")");
	twoPlayer_Button.mousePressed(setTwoPlayer);

	ball = new Ball(width/2, height/2, BALL_DIAMETER, INIT_BALL_SPEED, INIT_BALL_SPEED);
	paddleLeft = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	paddleRight = new Paddle(width-10, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
	paddleRight.setVY(PADDLE_SPEED);
}

function draw() {
	background(0);
	if(!gameHasStarted){
		drawTitleScreen();
	}
	else{
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
		//	test for win condition
		if(isGameWon()){
			drawWinScreen();
		}
	}
}

function showDOM(){
	singlePlayer_Button.show();
	twoPlayer_Button.show();
}

function hideDOM(){
	singlePlayer_Button.hide();
	twoPlayer_Button.hide();
}

//	button listeners
function setSinglePlayer(){
	gameHasStarted = true;
	singlePlayer = true;
	hideDOM();
}

function setTwoPlayer(){
	gameHasStarted = true;
	twoPlayer = true;
	hideDOM();
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
			hideDOM();
		}
		else if(keyCode == TWO_PLAYER){
			gameHasStarted = true;
			twoPlayer = true;
			hideDOM();
		}
	}
	if(gameHasStarted){
		if(keyCode == ESC){
			gameHasStarted = false;
			singlePlayer = false;
			twoPlayer = false;
			showDOM();
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
	else if(ball.hitRightEdge(windowWidth)){
		score_Left ++;
		ball.resetBall();
	}
	console.log(score_Left);
	console.log(score_Right);
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
	paddleLeft.bounded(height);
	paddleRight.bounded(height);
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
	//text("Enter '1' for single player \nEnter '2' for 2-player", width/2, height/2);	

	singlePlayer_Button.position(width/2 - singlePlayer_Button.width/2, height/2);
	twoPlayer_Button.position(width/2 - twoPlayer_Button.width/2, height/2 + singlePlayer_Button.height);

	
}

function drawWinScreen(){
	//background(0);
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
	text("\n\n\nClick to restart", width/2, height/2);
}

function drawNet(){
	fill(255);
	for(let i=0; i<height; i+=50){
		rect(width/2, i, 5, 40);
	}
}

//	checking win condition
function isGameWon(){
	return score_Left >= WIN_SCORE || score_Right >= WIN_SCORE;
}