$(function(){
	// 加载时，获取url参数渲染到页面上
	var goodInfo = {
		imgUrl:GetRequest().img,
		cost:GetRequest().cost,
		name:GetRequest().goodName,
		dataId:GetRequest().dataId,
		max:GetRequest().max
	}
	$(".good_name").text(goodInfo.name)
	$(".good_cost").text(goodInfo.cost+"金币")
	$(".img_model img").attr('src',goodInfo.imgUrl)
	$(".maxExChangeCount").val(goodInfo.max)

	// 兑换按钮点击，校验兑换人信息
	$("#exchange_btn").on('click',function(){
		var data = {};

		data.goodID = "";
		// 兑换数量
		var exchange_count = $("#exchange_count").val()*1
		if(""==exchange_count){
			layer.msg('请输入兑换的数量')
			return false;
		}else{
			if(typeof exchange_count !== 'number'){
				layer.msg('请输入正确兑换的数量');
				return false;
			}else if(exchange_count > $("maxExChangeCount").val()*1){
				layer.msg("兑换的数量不可超过"+$("maxExChangeCount").val())
				return false;
			}
			data.count = $("#exchange_count").val()*1;
		}
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
		data.remark4receiver = $("#receiver_remark").val()

		data.goodID = goodInfo.dataId*1;

		var reqData = {
			code:"exchangeGood",
			data:data
		}

		console.log(reqData)

		request({
			url:'/mobile/api/appService',
			data:reqData,
			errorHandler:true,
			success:function(data){
				
				if(1==data.status){
					layer.msg('兑换成功！')
				}
			}
		})
	})
})

// 获取最新的用户金币数
function getCoins(){
	var userId = JSON.parse(localStorage.userInfo).userID;

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
			var maxPoints = data.data.list[0].totalPoints;

			$(".coins_sum .cherry_red").text(maxPoints)
			$("#maxExChangeCount").val(maxPoints)
		}
	})
}