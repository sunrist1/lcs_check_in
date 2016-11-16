'use strict'

function request(setting){

	setting = setting || {};
	var _complete = setting.complete;
	var _success = setting.success;
	var _error = setting.error;
	var _beforeSend = setting.beforeSend;
	var _url = setting.url || "/mobile/api/appService";

	var json = setting.data || {};
	setting.contentType = setting.contentType || "application/json; charset=utf-8";
	setting.dataType = setting.dataType || "json";
	setting.url = _url;
	setting.type = setting.type || "POST";
	setting.data = JSON.stringify(json);

	if(undefined === setting.errorHandler) setting.errorHandler = true;

	setting.beforeSend = function(xhr){
		if(_beforeSend){
			_beforeSend && (typeof _beforeSend === 'function' && _beforeSend(xhr))
		}else{
			xhr.setRequestHeader("deviceId", "web_"+new Date().getTime());
	    xhr.setRequestHeader("device", "1");
	    // xhr.setRequestHeader("token", localStorage.token);
	    if(GetRequest().token){
	    	localStorage.token = GetRequest().token;
	    	xhr.setRequestHeader("token", GetRequest().token);
	    }else if(localStorage.token){
	    	xhr.setRequestHeader("token", localStorage.token);
	    }
		}
	}

	setting.complete = function(xhr,textStatus){
		_complete && (typeof _complete === 'function' && _complete(xhr,textStatus))
	}

	setting.success = function(data,textStatus,xhr){

		if(1===data.status){
			_success && (typeof _success === 'function') && _success(data,textStatus,xhr)
		}else{
			setting.errorHandler && showErr(data.msg)

			// 当返回status是0时，为未登录，跳登录页
			if(data.msg.indexOf("未登录")>=0){
				window.location.href="/views/account/account_opera.html"
			}
			_error && (typeof _error === 'function') && _error(xhr,jsonObc)
		}
	};

	setting.error = function(xhr,textStatus,errorThrown){
		_error && (typeof _error === 'function') && _error(xhr,textStatus,errorThrown)
	};

	$.ajax(setting);
}

// 错误弹框
function showErr(msg){
	layer.msg(msg)
}

// 展示弹窗时，禁止页面滚动
var htmlScroll = function(){
	if($('html').hasClass('no_scroll')){
		$('html').removeClass('no_scroll')
		$('body').removeClass('no_scroll')
	}else{
		$('html').addClass('no_scroll')
		$('body').addClass('no_scroll')
	}
}
// 显示蒙层
var showCover = function(){
	$("body").append('<div class="cover_box" id="cover_box"></div>')
	if($('#cover_box').is(':visible')){
		$('#cover_box').hide()
	}else{
		$('#cover_box').show()
	}
}

// 关闭弹窗按钮事件绑定在所有dialog_close_btn上
$(".dialog_close_btn").on('click',function(){
	$(".dialog_box").hide();
	htmlScroll();
	showCover()
})

// 获取url参数
function GetRequest() { 
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object(); 
	if (url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		var strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++) { 
			var pos = strs[i].indexOf("=");
			// theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].substr(pos+1)); 
		} 
	} 
	return theRequest; 
} 
