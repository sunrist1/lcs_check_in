$(function(){
	$(".shop_item").on('click',function(){
		$(".shop_item").removeClass('active')
		$(this).addClass('active');

		$(".goods_list").empty()

		var type = $(this).data('type')
		getShopData(type)
		// $('.goods_item').hide()
		// $('.'+type).show();
	})

	getShopData('shop_buy_card')

	// 隐藏不需显示的商品
	$(".cash_ticket").hide()
	$('.gold_bar').hide()
})

// 拼装列表html   列表太简单了，费事用模板库了
function listItem(type,data){
	if("cash_ticket"===type){
		data.forEach(function(item){
			var htmlStr = '<a href="/views/integral_shop/integral_good_detail.html?type='+type+'&dataId='+item.id+'" class="goods_item cash_ticket">'+
				'<div class="ticket_img">'+
					'<img src="'+item.imgUrl+'" alt="">'+
					'<span class="ticket_num">'+item.name+'</span>'+
				'</div>'+
				'<p class="name">'+item.name+'</p>'+
				'<p class="coin_cost">'+item.needCoinCount+'金币</p>'+
			'</a>';

			$(".goods_list").append(htmlStr)
		})
	}else{
		data.forEach(function(item){
			var htmlStr = '<a href="/views/integral_shop/integral_good_detail.html?type='+type+'&dataId='+item.id+'" class="goods_item shop_buy_card">'+
				'<img src="'+item.imgUrl+'" alt="">'+
				'<p class="name">'+item.name+'</p>'+
				'<p class="coin_cost">'+item.needCoinCount+'金币</p>'+
			'</a>'

			$(".goods_list").append(htmlStr)
		})
	}
}


/*
商品请求参数type对应
购物卡：1,
现金券：2,
投资金条：3,
抽奖商品：4,
其他：0
*/
// 请求商品列表
function getShopData(type){
	var typeNum = 1;
	if("shop_buy_card"==type){
		typeNum = 1
	}else if("cash_ticket"==type){
		typeNum = 2
	}else if("gold_bar" == type){
		typeNum = 3
	}else{
		typeNum = 0
	}

	// 获取商品列表
	var reqData = {
		"code":"getGoodList",
		"data":{
			"type":typeNum,
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
			listItem(type,data.data.list)
		}
	})
}