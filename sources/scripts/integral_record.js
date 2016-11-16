$(function(){

	function renderList(item){
		var statusType 
		if(0==item.status){
			statusType = '已确认'
		}else{
			statusType = '已发货'
		}
		var dateTime = new Date(item.submitDate);
		var dayTime = dateTime.getFullYear()+"-"+(dateTime.getMonth()*1+1)+"-"+dateTime.getDate(),
		    clockTime = dateTime.getHours()+":"+dateTime.getMinutes();
		var htmlStr = '<tr>'+
						'<td><p>'+dayTime+'</p><p>'+clockTime+'</p></td>'+
						'<td>您兑换了'+item.goodName+'</td>'+
						'<td class="status_success">'+statusType+'</td>'+
					'</tr>'

		$(".record_table tbody").append(htmlStr)
	}
	request({
			url:'/mobile/api/appService',
			data:{
				code:"getExchangeList",
				data:{
					pageIndex:1,
					pageSize:15
				}
			},
			errorHandler:true,
			success:function(data){
				if(1==data.status){
					data.data.list.forEach(function(item){
						renderList(item)
					})
				}
			}
		})
})

