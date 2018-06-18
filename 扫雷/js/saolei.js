//点击开始-->

var startBtn = $('.start-btn');
var gameContainer = $('.game-container');
var cover = $('.cover');
// var alertMsg = $('.alert-msg');
var alertLose = $('.alert-lose');
var alertWin = $('.alert-win');
var leiShu = $('.leishu');
var time = $('.time');
var reset = $('.reset');
var leiC ;
var timer1;
var winTime;
var loseTime;

bindEvent();
function bindEvent(){



	startBtn.on('click',init)
	


	//reset
	reset.on('click',toReset)
	


	//取消鼠标默认事件
	gameContainer.contextmenu(function(){
		return false;
	})

	//鼠标点击事件
	gameContainer.mousedown(function(sha){
		var event = sha.target;
		if(sha.which==1){
			leftClick(event);
		}else if(sha.which==3){
			rightClick(event);
		}
	})

	//点击关闭弹窗
	
	
}




//初始设置
function init(){
		//容器显示
		startBtn.css({display:'none'});
		gameContainer.css({display:'block'});
		leiShu.css({display:'block'});
		time.css({display:'block'});
		reset.css({display:'block'});

		//创建雷区
		//布局
		for(var x=0;x<10;x++){
			for(var y=0;y<10;y++){
				gameContainer.append("<div class='box' id='" + x + "-" + y +"'></div>")
			}
		}

		//取随机数
		function random(min,max){
			return Math.floor(Math.random()*(max-min)+min)
		}

		//随机加雷
		leiC = 0;
		for(var i=0;leiC<10;i++){
			var p,q;
			p = random(0,10);
			q = random(0,10);
			if($("#" + p + "-" + q) && !$("#" + p + "-" + q).hasClass('isLei')){
				$("#" + p + "-" + q).addClass('isLei');
				leiC++;
			}
		}

		//开始计时
		var firstTime = 0;
		timer1 = setInterval(function(){
			firstTime++;
			time.children('span').html(firstTime);
		},1000)

		//剩余雷数
		leiShu.children('span').html(leiC);
}


//重置游戏
function toReset(){
	//清除数据
	gameContainer.html('')
	clearInterval(timer1);
	time.children('span').html('0');
	alertWin.css({display:'none'});
	alertLose.css({display:'none'});
	clearInterval(winTime);
	clearInterval(loseTime);
	cover.css({display:'none'});

	//创建雷区
	//布局
	for(var x=0;x<10;x++){
		for(var y=0;y<10;y++){

			gameContainer.append("<div class='box' id='" + x + "-" + y +"'></div>")
		}
	}

	//取随机数
	function random(min,max){
		return Math.floor(Math.random()*(max-min)+min)
	}

	//随机加雷
	leiC = 0;
	for(var i=0;leiC<10;i++){
		var p,q;
		p = random(0,10);
		q = random(0,10);
		if($("#" + p + "-" + q) && !$("#" + p + "-" + q).hasClass('isLei')){
			$("#" + p + "-" + q).addClass('isLei');
			leiC++;
		}
	}

	//剩余雷数
	leiShu.children('span').html(leiC);

	//开始计时
	var firstTime = 0;
	timer1 = setInterval(function(){
		firstTime++;
		time.children('span').html(firstTime);
		},1000)
}


//左键点击
function leftClick(dom){
	
	if(dom && !$(dom).hasClass('flag')){
		//如果点击的是雷
		if(dom && $(dom).hasClass('isLei')){
			cover.css({display:'block'})
			$(dom).css({
				background:'url("./img/lei.png")',
				backgroundSize:'100% 100%'
			});
			clearInterval(timer1)
			setTimeout(function(){
				$('.isLei').css({
					background:'url("./img/lei.png")',
					backgroundSize:'100% 100%'
				}).fadeIn();
				loseTime = setTimeout(function(){
					// alertMsg.html('Game over<span class="close"></span>');
					alertLose.css({display:'block'})
				},700);
			},400)
		//如果点击的不是雷
		}else{   
			var num = 0;
			var disId = $(dom).attr('id').split('-');
			var disY = parseInt(disId[0]);
			var disX = parseInt(disId[1]);
			for(var i=disY-1;i<disY+2;i++){
				for(var j=disX-1;j<disX+2;j++){
					if($("#" + i +"-" + j).hasClass('isLei')){
						num++;
					}
				}
			}
			$(dom).html(num);
			$(dom).addClass('open');
			if(num==0){
				for(var i=disY-1;i<disY+2;i++){
					for(var j=disX-1;j<disX+2;j++){
						aroundBox = $("#" + i + "-" +j);
						if(aroundBox && aroundBox.length != 0){
							if(!aroundBox.hasClass('check')){
								aroundBox.addClass('check')
									leftClick(aroundBox);
							}
						}
					}
				}
			}
			
		}
	}

	if($('.open').length == 90){
		cover.css({display:'block'})
		clearInterval(timer1);
		var winTime = setTimeout(function(){
			alertWin.css({display:'block'});
			// alertMsg.text('So easy');
				// alertMsg.html('So easy<span class="close"></span>');
		},500)
		
	}
}


//右键点击
function rightClick(dom){
	if(dom && !$(dom).hasClass('open')){
		$(dom).toggleClass('flag');
		if(dom && $(dom).hasClass('flag')){
			leiC--;
		}else{
			leiC++;
		}
		leiShu.children('span').html(leiC);
	}
}


//关闭弹窗
$('.close').on('click',toClose);
function toClose(){
	cover.css({border:'1px solid red'})
	alertWin.css({display:'none'});
	alertLose.css({display:'none'});
}