$(function(){
	// window.location.href="/views/checkin/raffle.html"

	$("#raffle_link").on('click',function(){
		location.href="/views/checkin/raffle.html"
	})

	// 显示活动规则
	$("#ruleImg").on('click',function(){
		htmlScroll();
		showCover();

		$("#rule_box").fadeIn();
	})

	// 测试 显示收货地址
	$(".prize_bag").on('click',function(){
		htmlScroll();
		showCover();

		$(".receive_info_box").fadeIn();
	})

	// 向下滚动按钮
	$("#scrolldown_btn").on('click',function(){
		$("body").animate({
			scrollTop:$(".top_half").height()+'px'
		},500)
	})

	// 奖品tab切换
	$(".achieved_list").hide();
	$(".select_item").on("click",function(){
		$(".select_item").removeClass('active')
		$(this).addClass('active')

		var tabItem = $(this).data('tab')

		if("duihuan"==tabItem){
			$(".prize_list").show();
			$(".achieved_list").hide()
		}else{
			$(".prize_list").hide();
			$(".achieved_list").show()
		}
	})
	
	// 显示未签到提示
	// noCheckInContinuous();
	// 调整签到按钮的位置
	changeCoinsPos();

	getCoins()
	getLottoryList()

	// 获取连续签到状态;
	getCheckInStatus();

	// 编辑收货信息，提交
	$("#receiver_edit_btn").on('click',function(){
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

		data.lotteryID = $("#lottotyId").val();
		data.count = 1;

		console.log(data)

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
					// 刷新已经抽中奖品列表
					getLottoryList()
				}
			}
		})
	})

})

// ============示例，明天可签到提示===========
/*$(".day-2").on('click',function(){
	layer.tips('连续签到即可获得', $('.day-2'), {
	  tips: [1, '#ff6801'],
	  time: 1000
	});
})*/

// 显示未签到提示
var noCheckInContinuous = function(){
	$("#continuous_notice_box").fadeIn()
	htmlScroll();
	showCover();
}

// 点击签到，金币添加的动画效果
function coinsIncrese(el){
	var from = el.offset();
	var des = $('#coin_increse_des').offset();

	var coin_num = el.data('coins')
	if(undefined==coin_num||""==coin_num){
		return
	}
	var int_num = 0;

	var inter = setInterval(function(){
		int_num++;
		if(int_num>coin_num){
			inter = null;
			return
		}
		coinAnimate(from,des)
		$('.coin_num').text($('.coin_num').text()*1+1)
	},50)
		
	$('.fade_coin').remove()
	el.off('click')
	if(el.hasClass('box')){
		el.find("img").attr('src','/public/mobile/images/checkin/broken_egg_320.png')
	}else{
		el.find("img").attr('src','/public/mobile/images/checkin/checked_icon.png')
	}
	el.find("p").text('已签到')
}
// 金币动画
function coinAnimate(from,des){
	var coinEl = $("#coin_increse_des").clone();

	coinEl.css({
		width:'0.28rem',
		height:'auto'
	})
	coinEl.addClass('fade_coin')

	$('.top_half').append(coinEl)

	coinEl.css({
		position:"absolute",
		top:from.top+10+"px",
		left:from.left+10+"px"
	})

	var ran = (Math.random()-0.5)*50

	coinEl.animate({
		top:from.top-20+"px",
		left:from.left+ran+10+"px"
	},500)

	coinEl.animate({
		top:des.top+"px",
		left:des.left+"px"
	},500)
}

/*
* 调整签到金币位置
*/
function changeCoinsPos(){
	var layout_space = $('#check_bg_img').width()*0.056,
		  layout_width = $('#check_bg_img').width()*0.18;

	$('.day_item').width(layout_width)

	var styleTop = "0px",
			styleBottom = "0px";
	$('.day-0').css({
		"top":styleTop,
		"left":layout_space*1+"px",
		"transform":"translateY(-50%)"
	})
	for(var i=1;i<4;i++){
		$('.day-'+i).css({
			"top":styleTop,
			"left":layout_space*(i+1)+layout_width*i+"px",
			"transform":"translateY(-30%)"
		})
	}
	$('.day-4').css({
		"bottom":styleBottom,
		"left":layout_space*4+layout_width*3+"px",
		"transform":"translateY(55%)"
	})
	$('.day-5').css({
		"bottom":styleBottom,
		"left":layout_space*3+layout_width*2+"px",
		"transform":"translateY(55%)"
	})
	$('.day-6').css({
		"bottom":styleBottom,
		"left":layout_space*2+layout_width*1+"px",
		"transform":"translateY(55%)"
	})
	$('.box').css({
		// "width":$('#check_bg_img').width()*0.22,
		"bottom":styleBottom,
		"left":layout_space*1+"px",
		"transform":"translateY(55%)"
	})
}

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

			$(".myCoins .coin_num").text(maxPoints)
		}
	})
}

// 获取已抽中的实物奖品，并对未编辑收货地址的bind事件
function getLottoryList(){
	$(".achieved_list").empty()
	request({
		url:'/mobile/api/appService',
		data:{
			code:"getLotteryList",
			data:{
				goodType:2
			}
		},
		errorHandler:true,
		success:function(data){
			data.data.list.forEach(function(item){
				var htmlStr = "";
				if(0==item.status){
					htmlStr = '<div class="achieved_item" onclick="showEdit('+item.id+')">'
				}else if(1==item.status){
					htmlStr = '<div class="achieved_item">'
				}
				
				htmlStr += '<img class="prize_img" src="'+item.goodImg+'" alt="">'+
					'<div class="prize_name">'+item.goodName;

				if(0==item.status){
					htmlStr += '<span class="edit_btn">点击领取</span>'
				}else if(1==item.status){
					htmlStr += '<span class="sending">配送中</span>'
				}

				htmlStr +='</div></div>'

				$(".achieved_list").append(htmlStr)
			})
		}
	})
}

function showEdit(lottoryId){
	$('#lottotyId').val(lottoryId)
	var userInfo = JSON.parse(localStorage.userInfo);
	$("#receiver_name").val(userInfo.realName)
	$("#receiver_phone").val(userInfo.phone)

	htmlScroll();
	showCover();

	$(".receive_info_box").fadeIn();
}

// 获取签到状态
function getCheckInStatus(){
	request({
		url:'/mobile/api/appService',
		data:{
	    "code":"getCheckInStatus",
	    "data":{   
	    }
		},
		errorHandler:true,
		success:function(data){
			console.log(data)
			var serialCheck = (data.data.serialCheckInCount % 7)*1,
					hasChecked = data.data.todayIsCheckIn;

			var target = ".day-"+(serialCheck*1+1);

			var circle = 0;
			if(data.data.serialCheckInCount!=7 && !hasChecked){
				circle = serialCheck
			}else if(0==serialCheck && hasChecked){
				circle = 7;
			}
			console.log(circle)
			for(var i=1;i<=serialCheck;i++){
				var tg = ".day-"+i;
				if(i<=6){
					$(tg).find('img').attr('src','/public/mobile/images/checkin/checked_icon.png')
					$(tg).find('p').text('已签到')
				}else{
					$(tg).find('img').attr('src','/public/mobile/images/checkin/broken_egg_320.png')
					$(tg).find('p').text('已签到')
				}
			}

			if(hasChecked){
				$(".check_in_btn").addClass('haveChecked')
			}else{
				$(target).on('click',function(){
					goCheckIn()
					$(this).find('img').addClass('spin_class')
					coinsIncrese($(this))
					$(".check_in_btn").off('click')
					$(".check_in_btn").addClass('haveChecked')
					$(".check_in_btn").text('今天已签到')
				})

				$('.check_in_btn').on('click',function(){
					goCheckIn()
					$(target).find('img').addClass('spin_class')
					coinsIncrese($(target))
					$(target).off('click')
					$(".check_in_btn").addClass('haveChecked')
					$(this).off('click')
				})
			}

			// 为未能签到的按钮添加提示事件
			for(var i=1;i<7;i++){
				$('.day-'+(i*1+1)).on('click',function(){
					layer.msg('连续签到即可获得')
				})
			}
		}
	})
}

// 签到请求
function goCheckIn(){
	request({
		url:'/mobile/api/appService',
		data:{
			code:"checkIn",
			data:{}
		},
		errorHandler:true,
		success:function(data){
			console.log(data)
		}
	})
}