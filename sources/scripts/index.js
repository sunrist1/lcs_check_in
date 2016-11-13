$(function(){
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
})
// ============示例，点解签到动画===========
$(".day-1").on('click',function(){
	$(this).find('img').addClass('spin_class')
	coinsIncrese($(this))
})

// ============示例，明天可签到提示===========
$(".day-2").on('click',function(){
	layer.tips('连续签到即可获得', $('.day-2'), {
	  tips: [1, '#ff6801'],
	  time: 1000
	});
})
// ============示例，连续签到7日动画(金蛋的动画)===========
$('.box').on('click',function(){
	// $(this).find('img').addClass('spin_class')
	coinsIncrese($(this))
})

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


