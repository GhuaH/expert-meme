//1.全局变量
var total = 0;
var current = 0;
var elLoading;
var game;

//2.个性方法

/**
 * 游戏初始化
 */
function init() {
	//	console.log("init");
	elLoading = document.getElementById("loading");

	//加载图片
	loadImg();

	window.addEventListener("selectstart", fnDefault);
	window.addEventListener("contextmenu", fnDefault);
} //init

function fnDefault() {
	var e = window.event;
	e.preventDefault();
	e.stopPropagation();
}

/**
 * 加载图片
 */
function loadImg() {
	var addr = ["bg_game.png", "bg_start.png", "bullet.png", "enemy1.png", "enemy1_2.gif", "enemy2.png", "enemy2_2.gif", "enemy3.png", "enemy3_2.gif", "plane.gif", "plane_1.gif"];
	total = addr.length;

	for(var i = 0; i < total; i++) {
		//var img = document.createElement("img");
		var img = new Image();
		img.src = "./image/" + addr[i];
		img.addEventListener("load", count);
		img.addEventListener("error", count);
	}
}

/**
 * 图片计数
 */
function count() {
	current++;
	var p = Math.round(100 * current / total);
	console.log(current, total, p);
	elLoading.innerText = p + "%";

	//加载完成100%
	if(total == current) {
		toPage1();
	}
}

function toPage1() {
	document.getElementById("p0").style.display = "none";
	document.getElementById("p1").style.display = "block";

	var btn = document.getElementById("btnStart");
	btn.addEventListener("click", toPage2);
}

function toPage2() {
	document.getElementById("p1").style.display = "none";
	document.getElementById("p2").style.display = "block";

	game = new Game();
	game.init();
	game.start();
}

//游戏对象
function Game() {
	//初始化
	this.init = function() {
		this.state = 1; //1结束 2运行 3暂停 
		this.score = 0;

		this.elPage = document.getElementById("p2");
		this.elPop = document.getElementById("pop");
		this.elShow = document.getElementById("show");
		this.elBox = document.getElementById("box");

		//精灵对象
		this.stage = new Stage();
		this.stage.init();

		this.plane = new Plane();
		this.plane.init();
	}

	//启动
	this.start = function() {
		this.state = 2;
		this.score = 0;
		this.run();
	}

	//停止方法
	this.stop = function() {
		this.state = 1;

		this.elShow.innerText = this.score;
		this.elPop.style.display = "block";

	}

	this.reset = function() {
		this.elBox.innerHTML = "";
		this.init();

		this.elPop.style.display = "none";
		this.start();
	}

	//运行
	this.run = function() {
		switch(this.state) {
			case 1:
				break;
			case 2:
				this.update();
				this.paint();
				window.setTimeout(this.run.bind(this), 20);
				break;
			case 3:
				break;
			default:
				break;
		}
	}

	this.update = function() {
		this.stage.update();
		this.plane.update();
	}

	this.paint = function() {
		this.stage.paint();
		this.plane.paint();
	}
}

/**
 * 关卡
 */
function Stage() {
	this.init = function() {
		this.y = 0;
		this.speed = 1;
		this.el = document.getElementById("p2");
		this.elPoint = document.getElementById("point");

		//小兵集合
		this.tick = 0;
		this.enemies = [];
	}

	this.update = function() {
		this.tick++;

		//背景移动
		this.y -= this.speed;

		//修改小兵
		for(var i = this.enemies.length - 1; i >= 0; i--) {
			this.enemies[i].update();
		}

		//制造小兵
		if(this.tick % 50 == 0) {
			this.enemies.push(new Enemy(1));
		}

		if(this.tick % 250 == 0) {
			this.enemies.push(new Enemy(2));
		}

		if(this.tick % 500 == 0) {
			this.enemies.push(new Enemy(3));
		}

	}

	this.paint = function() {
		//画背景
		this.el.style.backgroundPositionY = this.y + "px";

		//画小兵
		for(var i = this.enemies.length - 1; i >= 0; i--) {
			this.enemies[i].paint();
		}

		//画分数
		this.elPoint.innerText = game.score;
	}

	this.remove = function(enemy) {
		for(var i = this.enemies.length - 1; i >= 0; i--) {
			if(this.enemies[i] == enemy) {
				//删除数组
				this.enemies.splice(i, 1);

				//删除DOM
				enemy.el.parentNode.removeChild(enemy.el);
				return;
			}
		}
	}
}

/**
 * 敌机
 * @param {number} type 敌机类型
 */
function Enemy(type) {
	function rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	this.init = function() {
		this.type = type;

		this.el = document.createElement("img");
		this.el.src = "./image/enemy" + type + ".png";
		document.getElementById("box").appendChild(this.el);

		this.width = this.el.width;
		this.height = this.el.height;
		this.speed = 2;
		this.life = Math.pow(3, (type - 1));

		this.x = rand(0, 320 - this.width);
		this.y = -this.height;

		this.time = 20 * this.type;

		this.el.style.left = this.x + "px";
	}

	this.update = function() {
		this.y += this.speed;

		if(this.y > 568) {
			game.stage.remove(this);
		}

		//开始倒计时
		if(this.life <= 0) {
			this.time--;
		}

		if(this.time < 0) {
			game.stage.remove(this);
		}
	}

	this.paint = function() {
		this.el.style.top = this.y + "px";
	}

	this.attack = function() {
		this.life--;

		if(this.life >= 0) {
			game.score += this.type * 10;
		}

		if(this.life == 0) {
			this.el.src = "./image/enemy" + this.type + "_2.gif";
		}

	}

	this.init();
}

/**
 * 飞机
 */
function Plane() {
	this.init = function() {
		this.page = document.getElementById("box");
		this.elTouch = document.getElementById("touch");
		this.el = document.createElement("img");
		this.el.src = "./image/plane.gif";
		this.el.style.zIndex = "10";
		this.page.appendChild(this.el);

		this.width = 66;
		this.height = 80;

		//速度
		this.speed = 8;
		//弧度pi=3.14
		this.rad = 0;
		//距离
		this.distance = 0;

		this.x = 320 / 2 - this.width / 2;
		this.y = 568 - this.height;

		//目标坐标
		this.mx = this.x;
		this.my = this.y;

		this.tick = 0;
		this.bullets = [];

		this.elTouch.addEventListener("mousemove", this.move.bind(this));
	}

	this.move = function() {
		var evt = window.event;

		//目标坐标--鼠标坐标
		var x = evt.offsetX;
		var y = evt.offsetY;

		//修正目标坐标
		if(x < this.width / 2) {
			x = this.width / 2;
		} else if(x > 320 - this.width / 2) {
			x = 320 - this.width / 2;
		}

		if(y < this.height / 2) {
			y = this.height / 2;
		} else if(y > 568 - this.height / 2) {
			y = 568 - this.height / 2;
		}

		//目标坐标--鼠标坐标
		this.mx = x;
		this.my = y;

		//飞机中间坐标
		var cx = this.x + this.width / 2;
		var cy = this.y + this.height / 2;

		//计算角度
		//计算距离
		var dx = x - cx;
		var dy = y - cy;
		this.rad = Math.atan2(dy, dx);
	}

	this.update = function() {
		this.tick++;

		//飞机中间坐标
		var cx = this.x + this.width / 2;
		var cy = this.y + this.height / 2;

		//计算距离
		var dx = this.mx - cx;
		var dy = this.my - cy;
		this.distance = Math.sqrt(dx * dx + dy * dy);
		//console.log("mx:%f my:%f ang:%f dis:%f",this.mx,this.my,this.rad,this.distance);

		//飞机飞行
		if(this.distance > this.speed) {
			var dx = this.speed * Math.cos(this.rad);
			var dy = this.speed * Math.sin(this.rad);

			this.x = this.x + dx;
			this.y = this.y + dy;
		}

		//修正
		if(this.x < 0) {
			this.x = 0;
		} else if(this.x > 320 - this.width) {
			this.x = 320 - this.width
		}

		if(this.y < 0) {
			this.y = 0;
		} else if(this.y > 568 - this.height) {
			this.y = 568 - this.height;
		}

		//修改子弹
		for(var i = this.bullets.length - 1; i >= 0; i--) {
			this.bullets[i].update();
		}

		//碰撞检查
		var cx = this.x + this.width / 2;
		var cy = this.y + this.height / 2;

		var enemies = game.stage.enemies;
		for(var i = 0; i < enemies.length; i++) {
			var em = enemies[i];

			if(cx > em.x && cx < em.x + em.width && cy > em.y && cy < em.y + em.height) {
				em.attack();

				this.el.src = "./image/plane_1.gif";
				game.stop();
				return;
			}
		}

		//发射子弹
		if(this.tick % 10 == 0) {
			var bullet = new Bullet(this.x + this.width / 2, this.y);
			this.bullets.push(bullet);
		}
	}

	this.paint = function() {
		this.el.style.left = this.x + "px";
		this.el.style.top = this.y + "px";

		for(var i = this.bullets.length - 1; i >= 0; i--) {
			this.bullets[i].paint();
		}
	}

	this.remove = function(bullet) {
		for(var i = this.bullets.length - 1; i >= 0; i--) {
			if(this.bullets[i] == bullet) {
				//删除数组
				this.bullets.splice(i, 1);

				//删除DOM
				bullet.el.parentNode.removeChild(bullet.el);
				return;
			}
		}
	}
} //Plane

function Bullet(x, y) {
	this.init = function() {
		this.el = document.createElement("img");
		this.el.src = "./image/bullet.png";
		document.getElementById("box").appendChild(this.el);

		this.width = 6;
		this.height = 14;
		this.speed = 16;

		this.x = x - this.width / 2;
		this.y = y;
	}

	this.update = function() {
		//子弹往上飞
		this.y -= this.speed;

		//子弹碰撞检查
		var cx = this.x + this.width / 2;
		var cy = this.y + this.height / 2;

		var enemies = game.stage.enemies;
		for(var i = 0; i < enemies.length; i++) {
			var em = enemies[i];

			if(cx > em.x && cx < em.x + em.width && cy > em.y && cy < em.y + em.height) {
				game.plane.remove(this);
				em.attack();

				return;
			}
		}

		//子弹出边界
		if(this.y < -this.height) {
			game.plane.remove(this);
		}
	}

	this.paint = function() {
		this.el.style.left = this.x + "px";
		this.el.style.top = this.y + "px";
	}

	this.init();
} //Bullet

//3.入口方法
window.addEventListener("DOMContentLoaded", init);