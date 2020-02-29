

function addQuestionItem(res){
	
	var str = 
		'<tr class="shopName">'+
		'<th>订单号</th>'+
		'<th>下单时间</th>'+
		'<th>下单人</th>'+
		'<th>商品</th>'+
		'<th>数量</th>'+
		'<th>总价</th>'+
		'<th style="width:15%">制作文件</th>'+
		'<th style="width:15%">备注说明</th>'+
		'<th style="width:30%">原因</th>'+
		'<th style="width:5%">操作</th></tr>';
	
	$.each(res.obj,function(index,order){
		
		var rowSpanNum = order.detailList.length;
		
		str += '<tr class="shopNr">'+
					'<td rowspan=' + rowSpanNum + '>'+(order.id > 1000000000?order.id:order.orderNumber)+'</td>'+
					'<td rowspan=' + rowSpanNum + '>'+new Date(order.createTime).Format("yyyy-MM-dd hh:mm")+'</td>'+
					'<td rowspan=' + rowSpanNum + '>'+order.createUserName+'</td>';
		
		var questionRemark = '<table>';
		$.each(order.operationList,function(q_index,operation){
			questionRemark += '<tr style="border-bottom:1px solid #e6e7e8;'+(operation.consoleUserId == null?'color:#da5971;':'color:#4169d8')+'" ><td style="border:0px;padding:0.3em 0.2em;text-align: left;">'+
						new Date(operation.createTime).Format("MM-dd hh:mm")+'</td><td style="border:0px;padding:0.3em 0.2em;text-align: left;">'+operation.remark+'</td></tr>';
		});
		questionRemark += '</table>';
		
		var operatorContent = '';
		
		if(order.is_problem == 1){
			operatorContent = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a><br/><br/>'+
							'<a  onclick="quesionOrderSubmit(' +order.id+')" class="blue">重新提交</a>';
		}else if(order.is_problem == 2){
			operatorContent = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a><br/><br/>'+
			'<span>已重新提交</span>';
		}else if(order.is_after_sales == 1 || order.is_after_sales == 2 || order.is_after_sales == 3){
			operatorContent = '<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a><br/><br/>';
		}
		
		console.log(order);
		$.each(order.detailList,function(d_index,detail){
			
			var productNote = JSON.stringify(detail.productNote).replace(/"/g, '&quot;');
			
			if(d_index == 0){
				
				var fileContent="";
				if(order.verderCode == "荣祥车间"){
					fileContent = '<td name="fileUpPhoto">'+fileColumContent(detail,order)+'</td>';
				}else{
					fileContent = '<td name="fileUpPhoto" rowspan=' + rowSpanNum + '>'+fileColumContent(order.detailList,order)+'</td>';
				}
				
				str += 
				'<td>'+detail.groupName+ '<br>[<span style="color:#FF6633;cursor:pointer;" onclick="getInfo('+ productNote + ')">查看制作说明</span>]</td>'+
				'<td>'+detail.number+'</td>'+
				'<td rowspan=' + rowSpanNum + '>'+order.orderPrice.toFixed(2)+'</td>'+
				fileContent+
				'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
				'<td rowspan=' + rowSpanNum + '>'+questionRemark+'</td>'+
				//'<td rowspan=' + rowSpanNum + '>'+ order.address.consignee+'<br/>'+ order.address.phone+'</td>'+
				'<td rowspan=' + rowSpanNum + '>'+
					operatorContent+
				'</td>'
		    '</tr>';
			}else{
				var fileContent="";
				if(order.verderCode == "荣祥车间"){
					fileContent = '<td name="fileUpPhoto">'+fileColumContent(detail,order)+'</td>';
				}
				str += 	
				'<tr class="shopNr">'+
					'<td>'+detail.groupName+ '<br>[<span style="color:#FF6633;cursor:pointer;" onclick="getInfo('+ productNote + ')">查看制作说明</span>]</td>'+
					'<td>'+detail.number+'</td>'+
					fileContent+
					'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
			    '</tr>';
			}
		});
			
	});
	return str;
}

function quesionOrderSubmit(id){
	layer.confirm("您已经重新上传过文件吗，确认重新提交订单吗？",function(){
		console.log(1);
		layer.closeAll();
		layer.load();
		var params = {};
		params.id = id;
		getDataFromService("/order/quesionOrderSubmit", "POST", JSON.stringify(params), function(res){
			layer.closeAll();
			if(res.code == 1){
				location.href = "myOrder.html?state=0";
			}else{
				layer.msg(res.msg);
			}
		});
		
	},function(){
		console.log("取消");
	});
}


