window.onload = function(){

	var begin = document.getElementById("begin");
	var score = document.getElementById("score");
	var against = document.getElementById("against");
	var game = document.getElementById("game");
	var emotion = document.getElementById("emotion");

	begin.onclick = function(){
		this.value = "游戏进行中.....";
		score.innerHTML = "0";
		against.innerHTML = "0";
		this.disable = true;
		createEmotion(50);
		setTimeout(function(){
			reset();
			begin.disable = false;
			begin.value = "开始游戏";
		}, 60000);

	}

	

	function reset(){
		emotion.src = "";
		emotion.style.display = "none";
		emotion.onclick = null;
		alert("游戏结束，你共得" + score.innerHTML + "分");

	}

	function createEmotion(speed){

		if(speed < 0)
			speed = 1;

		emotion.speed = speed;
		console.log(emotion.speed);
		
		emotion.style.display = "block";
		// 选择随机表情
		emotion.src = "img/" + Math.ceil(Math.random()*10) + ".png";
		// 设置随机位置
		var width = parseInt(document.defaultView.getComputedStyle(game, null).width);
		var left = Math.floor(Math.random()*width);
		emotion.style.left = left + "px";
		emotion.style.top = "0px";

		// 获取游戏区域高度
		var height = parseInt(document.defaultView.getComputedStyle(game, null).height);
		// 产生动画
		emotion.timer = setInterval(function(){
			// alert(emotion);
			fall(emotion, height);
			// console.log(emotion.style.top);
			
		}, emotion.speed);

		// 设置鼠标点击事件
		emotion.onclick = function(){
			// console.log("click");
			clearInterval(emotion.timer);
			emotion.src = "img/qq.png";
			score.innerHTML = parseInt(score.innerHTML) + 1;
			
			// 避免同时点击触发多个定时器
			this.onclick = null;

			var emoH = parseInt(document.defaultView.getComputedStyle(emotion, null).height);
			var top = emotion.offsetTop;
			if(top + emoH != height){
				setTimeout(function(){
					createEmotion(Math.ceil(emotion.speed/1.3));
				}, 500);
			}else{
				against.innerHTML = parseInt(against.innerHTML) - 1;
				this.speed = Math.ceil(this.speed/1.3);
			}
			// shakeEmotion(emotion, 0, emotion.offsetTop);
		}



	}

	function fall(emotion, height){

		var emoH = parseInt(document.defaultView.getComputedStyle(emotion, null).height);
		var top = emotion.offsetTop;

		// 当到达底部时
		if((emoH + top) == height){
			// 清除计时器
			clearInterval(emotion.timer);

			against.innerHTML = parseInt(against.innerHTML) + 1;

			// 游戏区域震动
			shake(0);

			return;
		}
		else{
			// 设置每次下降高度1,从而形成动画效果
			emotion.style.top = (top + 1) + "px";
			// console.log(emotion.style.top);

			
		}

	}

	function shake(num){
		if(num == 8){
			// console.log("8");
			game.parentNode.style.top = "0px";
			// 清除小表情
			emotion.style.display = "none";
			// 继续产生小表情
			createEmotion(Math.ceil(emotion.speed*1.3));
			return;
		}else{
			game.parentNode.style.top = num%2==0?"-5px":"5px";
			num++;
			setTimeout(function(){
				shake(num);
			}, 50);
		}
	}
}