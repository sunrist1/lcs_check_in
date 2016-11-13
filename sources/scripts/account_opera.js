$(function(){
	goCenter($('.login_content'))

	// 绑定跳转时间
	$("#go_reg").on('click',function(){
		leaveCenter($(".login_content"))
		goCenter($('.reg_content'))
	})

	$("#go_login").on('click',function(){
		leaveCenter($(".reg_content"))
		goCenter($('.login_content'))
	})

	$("#go_fgpw").on('click',function(){
		leaveCenter($(".login_content"))
		goCenter($('.fgpw_content'))
	})

	$(".back_btn").on("click",function(){
		leaveCenter($(".reg_content"))
		leaveCenter($(".fgpw_content"))
		goCenter($('.login_content'))
	})
})

// 居中方法
function goCenter(el){
	el.addClass("act_content")

	el.animate({
		"top":"0px",
		"left":"0px",
		"opacity":"1"
	},50)
}
function leaveCenter(el){
	el.removeClass("act_content")

	if(el.hasClass('login_content')){
		el.animate({
			"top":"0px",
			"left":"-100%",
			"opacity":"0"
		},50)
	}else{
		el.animate({
			"top":"0px",
			"left":"100%",
			"opacity":"0"
		},50)
	}
	
}

// 图片验证码更换
function loginVerify(){
	$(".login_form .verify_code").attr('src','/mobile/code?code=login&v='+Math.random())
}

$(".login_form .verify_code").on('click',function(){
	loginVerify()
})

function registerVerify(){
	$(".register_form .verify_code").attr('src','/mobile/code?code=register&v='+Math.random())
}
$(".register_form .verify_code").on('click',function(){
	registerVerify()
})
// 忘记密码的暂时用着注册的
$(".fgpw_form .verify_code").on('click',function(){
	$(".fgpw_form .verify_code").attr('src','/mobile/code?code=register&v='+Math.random())
})

// =============验证码输入框聚焦时，刷新验证码============
$(".login_content .verify_code_text").on('focus',function(){
	loginVerify()
})
$(".register_form .verify_code_text").on('focus',function(){
	registerVerify()
})
$(".fgpw_form .verify_code_text").on('focus',function(){
	$(".fgpw_form .verify_code").attr('src','/mobile/code?code=register&v='+Math.random())
})

/*
*  用户登录注册功能
*/

// ============ 登录 ============
$('#goLogin').on('click',function(){
	var form = $(".login_form");
	var phone = form.find('.phone_num').val(),
			verify_code = form.find('.verify_code_text').val(),
			pwd = form.find('.login_pwd').val();

	var data = {
		"code":'login',
		"data":{
			"phone":phone,
			"password":pwd,
			"verifyCode":verify_code
		}
	}

	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			if(1===data.status){
				layer.msg("登录成功。")

				localStorage.token = data.data.token;
				localStorage.userInfo = JSON.stringify(data.data)

				history.go(-1)
			}
		}
	})
})

// ============ 注册 ============
$('#goRegister').on('click',function(){
	var form = $(".register_form");
	var phone = form.find('.phone_num').val(),
			// verify_code = form.find('.verify_code_text').val(),
			phone_code = form.find('.reg_phone_verify').val(),
			pwd = form.find('.reg_pwd').val(),
			confirm_pwd = form.find('.reg_confirm_pwd').val(),
			invitation_code = form.find('.invitation_code').val();

	var data = {
		"code":'register',
		"data":{
			"phone":phone,
			"password":pwd,
			"confirmPassword":confirm_pwd,
			"phoneCode":phone_code,
			"inviter":invitation_code
		}
	}

	// data = JSON.stringify(data)

	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			if(1===data.status){
				layer.msg("注册成功。")
			}else{
				layer.msg(data.msg)
			}
		}
	})
})

// 注册账户获取短信验证码
var timer,
		time_count = 60;
$('#registerGetVerify').on('click',function(){
	// 请求短信验证码
	var data = {
		code:"registerSendCode",
		data:{
			verifyCode:$(".register_form").find('.verify_code_text').val(),
			phone:$(".register_form").find('.phone_num').val()
		}
	}
	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			if(0===data.status){
				layer.msg(data.msg)
			}else{
				$('#registerGetVerify').addClass('forbidden');
				$('#registerGetVerify').attr('disabled',true);
				timer = setInterval(function(){
					time_count--;
					$('#registerGetVerify').text("等待"+time_count+"秒")
					if(0>=time_count){
						clearInterval(timer)
						$("#registerGetVerify").removeClass('forbidden');
						$("#registerGetVerify").removeAttr('disabled')
						$('#registerGetVerify').text("获取验证码")
						time_count = 60;
					}
				},1000)
			}
		}
	})
})


// =============== 忘记密码获取短信验证码 ============
var timer2,
		time2_count = 60;
$('#fgpwGetVerify').on('click',function(){


	// 请求短信验证码
	var data = {
		code:"forgotLoginSendCode",
		data:{
			// verifyCode:$(".fgpw_form").find('.verify_code_text').val(),
			phone:$(".fgpw_form").find('.phone_num').val()
		}
	}

	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			if(0===data.status){
				layer.msg(data.msg)
			}else{
				layer.msg(data.msg)
				$('#fgpwGetVerify').addClass('forbidden');
				$('#fgpwGetVerify').attr('disabled',true);

				timer2 = setInterval(function(){
					time2_count--;
					$('#fgpwGetVerify').text("等待"+time2_count+"秒")
					if(0>=time2_count){
						clearInterval(timer2)
						$("#fgpwGetVerify").removeClass('forbidden');
						$("#fgpwGetVerify").removeAttr('disabled')
						$('#fgpwGetVerify').text("获取验证码")
						time_count2 = 60;
					}
				},1000)
			}
		}
	})
})

// 验证手机验证码正确性
$('#goFgpw').on('click',function(){
	var data = {
		code:"forgotLoginVerify",
		data:{
			phoneCode:$(".fgpw_form").find('.forget_phone_verify').val(),
			phone:$(".fgpw_form").find('.phone_num').val()
		}
	}

	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			if(0===data.status){
				layer.msg(data.msg)
			}else{
				resetPwd()
			}
		}
	})
})

// 重置密码
function resetPwd(){
	var form = $(".fgpw_form");
	var phone = form.find('.phone_num').val(),
			phone_code = form.find('.forget_phone_verify').val(),
			pwd = form.find('.new_pwd').val(),
			confirm_pwd = form.find('.confirm_pwd').val();

	var data = {
		"code":'resetPwd',
		"data":{
			"phone":phone,
			"password":pwd,
			"confirmPassword":confirm_pwd,
			"phoneCode":phone_code
		}
	}

	request({
		url:'/mobile/api/appService',
		data:data,
		errorHandler:true,
		success:function(data){
			layer.msg(data.msg)
		}
	})
}