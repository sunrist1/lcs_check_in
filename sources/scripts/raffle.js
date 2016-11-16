$(function(){
// 暂时无得玩
	// layer.msg("抽奖功能将于2016年11月17日上线，敬请期待。")

	var PRIZE_ID = 0;  // 中奖物品的id
  var PRIZE_TYPE = 0;  //判断是否实物
  var LOTTORY_ID = 0;  // 中奖的lottory id
	// 加载页面时获取已抽奖次数
	allowRaffle()

	// 获取用户可用金币
	getCoins();

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
			var prizeList = data.data.list;

			for(var i=0,l=prizeList.length;i<l;i++){
				var img = document.createElement('img')
				img.setAttribute('src',prizeList[i].imgUrl)
				$('.award_item_'+i).append(img)
				$('.award_item_'+i).data('name',prizeList[i].name)
				$('.award_item_'+i).data('award',i)
				$('.award_item_'+i).addClass('award_id_'+prizeList[i].id)
			}
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
		prizeId:0,  // 中奖奖品id
		init:function(id){
			if($("#"+id).find(".award_item").length>0){
				$lottery = $("#"+id);
				$units = $lottery.find(".award_item");
				this.obj = $lottery;
				this.count = $units.length;
				// $lottery.find(".award_item_"+this.index).removeClass('gray_cover');
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
			getCoins()
			allowRaffle()
			return false;
		}
	}
	
	// 转动方法
	function roll(resultId){
		lottery.times += 1;
		lottery.prizeId = resultId;
		lottery.roll(resultId);

		if(lottery.times>lottery.cycle && lottery.prize==lottery.index){
			clearTimeout(lottery.timer)

			var prizeNum = lottery.prize;
			setTimeout(function(){
				showPrize(prizeNum,PRIZE_TYPE)
				getCoins();
				allowRaffle();
			},450)
			

			lottery.prize=-1;
			lottery.times = 0;
			click = false;
		}else{
			if(lottery.times<lottery.cycle){
				lottery.speed -= 10
			}else if(lottery.times ==lottery.cycle){
				// 此处是随机生成中奖位置，之后要修改成后台获取中奖信息
				// var des = Math.random()*(lottery.count)|0;
				var des = $('.award_id_'+PRIZE_ID).data('award')
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
		// layer.msg("抽奖功能将于2016年11月17日上线，敬请期待。")
		// 抽奖
		var reqData ={
			code:"lottery",
			data:{}
		}
		request({
			url:'/mobile/api/appService',
			data:reqData,
			errorHandler:true,
			success:function(data){
				// 请求成功后开始抽奖
				if(click){
					return false
				}else{
					lottery.speed=100;
					PRIZE_ID=data.data.goodID;
					LOTTORY_ID=data.data.id;
					PRIZE_TYPE=data.data.goodType;
					roll();
					click=true
					return false
				}
			}
		})
	})


	// 抽中实物商品，收货信息填写，并请求
	$("#exChangeBtn").on('click',function(){
		var data = {};
		// 兑换人名称
		if(""==$("#receiver_name").val()){
			layer.msg('请输入兑换人的姓名');
			return false;
		}else{
			data.receiverName = $("#receiver_name").val()
		}
		// 兑换人电话
		var phone = $("#receiver_phone").val()
		if(""==phone){
			layer.msg('请输入兑换人联系电话');
			return false;
		}else{
			if(!(/^1[34578]\d{9}$/.test(phone))){ 
        layer.msg("手机号码有误，请重填");  
        return false; 
	    } 
			data.receiverPhone = $("#receiver_phone").val()
		}
		// 兑换人地址
		if(""==$("#receiver_addr").val()){
			layer.msg('请输入兑换人收货地址');
			return false;
		}else{
			data.receiverAddress = $("#receiver_addr").val()
		}	

		data.lotteryID = LOTTORY_ID;
		data.count = 1;

		var reqData = {
			code:'exchangeGood',
			data:data
		}

		request({
			url:'/mobile/api/appService',
			data:reqData,
			errorHandler:true,
			success:function(data){
				
				if(1==data.status){
					layer.msg('提交成功。')
					$(".dialog_box").hide();
					htmlScroll();
					showCover()
				}
			}
		})
	})

})

// 获取最新的用户金币数
function getCoins(){
	var userId = 0;

	if(localStorage.userInfo){
		userId = JSON.parse(localStorage.userInfo).userID
	}

	var reqData = {
		code:"getMyPointsInfo",
		data:{
			partnerId:userId
		}
	}

	request({
		url:'/mobile/api/appService',
		data:reqData,
		errorHandler:true,
		success:function(data){
			var maxPoints = data.data.list[0].availablePoints;

			$("#userCoins").text(maxPoints)
		}
	})
}

// 可抽奖次数
function allowRaffle(){
	request({
		url:'/mobile/api/appService',
		data:{
			code:"syLotteryCount",
			data:{}
		},
		errorHandler:true,
		success:function(data){
			var raffleCount = data.data.syCount;
			$("#syCount").text(raffleCount);
		}
	})
}

// 展示中奖信息
function showPrize(num,type){
	showCover();
	htmlScroll();
	var prizeName = $(".award_item_"+num).data('name');
	var prizeText = "您获得了";
	prizeText+=prizeName
	if(1==type){
		$("#prize_get_shows .prize_text").text(prizeText);
		$("#prize_get_shows").fadeIn();
	}else if(2==type){
		var userInfo = JSON.parse(localStorage.userInfo);
		$("#receiver_name").val(userInfo.realName)
		$("#receiver_phone").val(userInfo.phone)
		$(".receive_info_box .prize_text").text(prizeName);
		$('.receive_info_box').fadeIn()
	}
}