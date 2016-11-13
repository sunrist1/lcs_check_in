$(function(){
	// 加载页面时获取已抽奖次数
	request({
			url:'/mobile/api/appService',
			data:{
				code:"drawTimes",
				data:{}
			},
			errorHandler:true,
			success:function(data){
				console.log(data)
			}
		})

/*	
*  转盘背景切换
*/	
	// 生成闪烁点
	for(var i=0;i<6;i++){
		var el_1 = document.createElement('span');
		var el_2 = document.createElement('span');		
		var el_3 = document.createElement('span');
		var el_4 = document.createElement('span');
		el_1.setAttribute('class','star_item yellow_star')
		el_2.setAttribute('class','star_item cherry_star')
		el_3.setAttribute('class','star_item yellow_star')
		el_4.setAttribute('class','star_item cherry_star')

		if(0==i%2){
			el_1.style.left=15*i+10+"%"
			el_1.style.top='0.05rem';

			el_2.style.top=15*i+10+"%"
			el_2.style.left='0.05rem';

			el_3.style.right=15*i+10+"%"
			el_3.style.bottom='0.05rem';

			el_4.style.bottom=15*i+10+"%"
			el_4.style.right='0.05rem';
		}else{
			el_2.style.left=15*i+10+"%"
			el_2.style.top='0.05rem';

			el_1.style.top=15*i+10+"%"
			el_1.style.left='0.05rem';

			el_3.style.bottom=15*i+10+"%"
			el_3.style.right='0.05rem';

			el_4.style.right=15*i+10+"%"
			el_4.style.bottom='0.05rem';
		}

		$(".raffle_content").append(el_1)
		$(".raffle_content").append(el_2)
		$(".raffle_content").append(el_3)
		$(".raffle_content").append(el_4)
	}
	// 闪烁动画
	var panInterval = setInterval(function(){

		var yellow = $(".yellow_star"),
				cherry = $(".cherry_star");

		yellow.removeClass('yellow_star')
		cherry.removeClass('cherry_star')

		cherry.addClass('yellow_star')
		yellow.addClass('cherry_star')
	},500)

	/*
	*  获取奖品
	*/
	var reqData = {
		"code":"getGoodList",
		"data":{
			"type":4,
			"pageIndex":1,
			"pageSize":20
		}
	}
	request({
		url:'/mobile/api/appService',
		data:reqData,
		errorHandler:true,
		success:function(data){
			console.log(data)
		}
	})


	/*
	*	立即抽奖的事件
	* 绑定事件和转盘动画效果
	*/
	var lottery = {
		index:0,  // 当前转动到哪个位置
		count:0,  // 总共有多少个位置
		timer:0,  // seTimerout的ID，用clearTimeout清楚
		speed:200,  // 出事转动速度
		times:0,  // 转动的次数
		cycle:50, // 至少转动的次数
		prize:-1, // 中奖的位置
		init:function(id){
			if($("#"+id).find(".award_item").length>0){
				$lottery = $("#"+id);
				$units = $lottery.find(".award_item");
				this.obj = $lottery;
				this.count = $units.length;
				$lottery.find(".award_item_"+this.index).removeClass('gray_cover');
			}
		},
		roll:function(){
			var index = this.index;
			var count = this.count;
			var lottery = this.obj;

			$(lottery).find(".award_item_"+index).addClass('gray_cover')
			index+=1;

			if(index>count-1){
				index=0
			}
			$(lottery).find(".award_item_"+index).removeClass("gray_cover")
			this.index=index;
			return false
		},
		stop:function(index){
			this.prize=index;
			return false;
		}
	}
	
	// 转动方法
	function roll(){
		lottery.times += 1;
		lottery.roll();

		if(lottery.times>lottery.cycle && lottery.prize==lottery.index){
			clearTimeout(lottery.timer)

			var prizeNum = lottery.prize;
			setTimeout(function(){
				showPrize(prizeNum)
			},450)
			

			lottery.prize=-1;
			lottery.times = 0;
			click = false;
		}else{
			if(lottery.times<lottery.cycle){
				lottery.speed -= 10
			}else if(lottery.times ==lottery.cycle){
				// 此处是随机生成中奖位置，之后要修改成后台获取中奖信息
				var des = Math.random()*(lottery.count)|0;
				// console.log(des)
				lottery.prize = des
			}else{
				// 减速
				if(lottery.times>lottery.cycle+10&&((lottery.prize==0&&lottery.index==7)||lottery.prize==lottery.index+1)){
					lottery.speed+=110;
				}else{
					lottery.speed+=20
				}
			}
			// 限速40
			if(lottery.speed<40){
				lottery.speed=40
			}

			// 闭包做转盘
			lottery.timer = setTimeout(roll,lottery.speed)
		}

		if(click){
			$("#raffle_btn").attr('disabled','true')
			$("#raffle_btn").addClass('gray_cover')
		}else{
			$("#raffle_btn").removeAttr('disabled')
			$("#raffle_btn").removeClass('gray_cover')

			// showPrize();
		}


		return false
	}

	var click = false

	lottery.init('raffle_pan')
	$("#raffle_btn").on("click",function(){
		// 抽奖
		var reqData ={
			code:"draw",
			data:{}
		}
		request({
			url:'/mobile/api/appService',
			data:reqData,
			errorHandler:true,
			success:function(data){
				console.log(data)
			}
		})

		if(click){
			return false
		}else{
			lottery.speed=100;
			roll();
			click=true
			return false
		}
	})

	// 展示中奖信息
	function showPrize(num){
		showCover();
		htmlScroll();
		var prizeName = $(".award_item_"+num).data('name');
		var prizeText = "您获得了";
		if('随机积分'==prizeName){
			var jifen = Math.floor(Math.random()*100)
			prizeText += jifen+"积分"
		}else{
			prizeText+=prizeName
		}
		$("#prize_get_shows .prize_text").text(prizeText);
		$("#prize_get_shows").fadeIn();
	}

})