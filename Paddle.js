const PADDLE_HEIGHT = 150;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 10;

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

	bounded(height){
		let paddleCenterY = this.y + this.height/2;
		if(paddleCenterY <= 0 ){
			this.y = -this.height/2;
		}
		else if(paddleCenterY >= height){
			this.y = height - this.height/2;
		}
	}
	chaseBall(ball){
		let paddleCenterY = this.y + this.height/2;
		// adjust the allowance of error of computer paddle to be 20% of PADDLE_HEIGHT
		let paddleAllowance = 0.2*this.height;
		// Make the center of the paddle chase the ball co-ordinates
		if(paddleCenterY < ball.getY() - paddleAllowance){
			this.y += this.vy;
		}
		else if(paddleCenterY > ball.getY() + paddleAllowance){
			this.y -= this.vy;
		}
	}
}