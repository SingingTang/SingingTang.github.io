window.onload = function(){

	var begin = document.getElementById("begin");
	var score = document.getElementById("score");
	var against = document.getElementById("against");
	var game = document.getElementById("game");
	var phrase = document.getElementById("phrase");
	var phrase = document.getElementById("phrase");
	var phrases = ['行尸走肉', '金蝉脱壳', '百里挑一', '金玉满堂', '霸王别姬', '天上人间', '不吐不快', '海阔天空', '情非得已', '满腹经纶', '兵临城下']

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
		phrase.src = "";
		phrase.style.display = "none";
		phrase.onclick = null;
		alert("游戏结束，你共得" + score.innerHTML + "分");

	}

	function createPhrase(speed){

	}

	function createEmotion(speed){

		if(speed < 0)
			speed = 1;

		phrase.speed = speed;
		phrase.style.display = "inline-block";
		phrase.style.position = "absolute";
		phrase.style.background = "#000";
		phrase.style.color = "#fff";
		phrase.style.width = "80px";
		phrase.style.height = "30px";
		phrase.style.fontFamily = "Microsoft YaHei"
		
		// 选择随机表情
		phrase.innerHTML = phrases[parseInt( Math.random()*10 )]
		// 设置随机位置
		var width = parseInt(document.defaultView.getComputedStyle(game, null).width) - 80;
		var random = Math.random();
		console.log(random)
		var left = Math.floor(random*width);
		console.log(left);
		phrase.style.left = left + "px";
		phrase.style.top = "0px";

		// 获取游戏区域高度
		var height = parseInt(document.defaultView.getComputedStyle(game, null).height);
		// 产生动画
		phrase.timer = setInterval(function(){
			// alert(phrase);
			fall(phrase, height);
			// console.log(phrase.style.top);
			
		}, phrase.speed);

		// 设置鼠标点击事件
		phrase.onclick = function(){
			// console.log("click");
			clearInterval(phrase.timer);
			phrase.innerHTML = '点中了'
			score.innerHTML = parseInt(score.innerHTML) + 1;
			
			// 避免同时点击触发多个定时器
			this.onclick = null;

			var emoH = parseInt(document.defaultView.getComputedStyle(phrase, null).height);
			if(top + emoH != height){
				setTimeout(function(){
					createEmotion(Math.ceil(phrase.speed/1.3));
				}, 500);
			}else{
				against.innerHTML = parseInt(against.innerHTML) - 1;
				this.speed = Math.ceil(this.speed/1.3);
			}
			// shakeEmotion(phrase, 0, phrase.offsetTop);
		}



	}

	function fall(phrase, height){

		var emoH = parseInt(document.defaultView.getComputedStyle(phrase, null).height);
		var top = parseInt( phrase.style.top);

		// 当到达底部时
		if((emoH + top) == height){
			// 清除计时器
			clearInterval(phrase.timer);

			against.innerHTML = parseInt(against.innerHTML) + 1;

			// 游戏区域震动
			shake(0);

			return;
		}
		else{
			// 设置每次下降高度1,从而形成动画效果
			phrase.style.top = (top + 1) + "px";

			
		}

	}

	function shake(num){
		if(num == 8){
			// console.log("8");
			game.parentNode.style.top = "0px";
			// 清除小表情
			phrase.style.display = "none";
			// 继续产生小表情
			createEmotion(Math.ceil(phrase.speed*1.3));
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