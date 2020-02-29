


function signOrder(pageNum){
	layer.load();
	
	var ajaxUrl = "/order/signOrderlist";
	var type = "post";
	
	var param = {};
	var pageSize = 10;
	param.pageNum = pageNum;
	param.pageSize = pageSize;
	
	var fileWord = $("#fileWord").val();
	if(!isEmpty(fileWord)){
		param.fileName = fileWord;
	}
	
	console.log(param);
	
	var callBack = function(res) {
		
		$(".userMain").show();
		layer.closeAll();
		
		$(".m_o_tab").html("");
		
		var list = res.obj;
		var str = 
					'<tr class="shopName">'+
					'<th style="width:5%">订单号</th>'+
					'<th style="width:5%">签收时间</th>'+
					'<th style="width:5%">下单人</th>'+
					'<th style="width:10%">商品</th>'+
					'<th>数量</th>'+
					'<th>价格</th>'+
					'<th>总价</th>'+
					'<th style="width:10%">制作文件<input id="fileWord" size="5"/>  <input class="btnAn"  type="button" value="搜索" onclick="signOrder(1);" ></th>'+
					'<th style="width:7%">收货人信息</th>'+
					'<th style="width:10%">备注说明</th>'+
					'<th style="width:5%">状态</th>'+
					'<th style="width:10%">回访记录</th>'+
					'<th style="width:10%">操作</th></tr>';
		
		if (res.code == 1) {
			
			var page = res.page;
			if(pageNum == 1){
				//拉取第一页数据时，初始化分页
				$('.bodBox').createPage(
					   function(n){
						   if(n != pageNum){//不是点击当前页码
							   pageNum = n;
							   signOrder(n);
						   }
					   },
					   {
					   	pageCount:page.totalPageCount,//总页码,默认10 
					   	showPrev:false,//是否显示上一页按钮
					   	showNext:false,//是否显示下一页按钮
					   	showTurn:true,//是否显示跳转,默认可以
					   	showNear:4,//显示当前页码前多少页和后多少页，默认2
					   	showSumNum:false//是否显示总页码
					   },
					   {
						   "color":"#525252;",//字体颜色
						   "height":28,//页码总高度，默认20px
						   "pagesMargin":4,//每个页码或按钮之间的间隔
						   "borderColor":"#ececec",
						   "currentColor":"#FFF",//当前页码的字体颜色
					   }
				);
			}
			
			$.each(res.obj,function(index,order){
				var rowSpanNum = order.detailList.length;
				
				var returnVisitContent = '';
				
				if(order.is_return_visit == 0){
					returnVisitContent = '<a  onclick="addReturnVisit(' +order.id+',5)" class="blue" style="margin-left:0.7em;">添加记录</a>';
				}else{
					$.each(order.returnVisitList,function(visitIndex,returnVisit){
						returnVisitContent += '<p title="操作时间：'+new Date(returnVisit.create_time).Format("yyyy-MM-dd hh:mm")+'">'+(visitIndex+1)+'). '+returnVisit.content+'</p> ';
					});
					returnVisitContent += '<a  onclick="addReturnVisit(' +order.id+',5)" class="blue" style="margin-left:0.7em;">添加记录</a>';
				}
				
				
				str += '<tr class="shopNr">'+
							'<td rowspan=' + rowSpanNum + '>'+(order.id > 1000000000?order.id:order.orderNumber)+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+new Date(order.singInTime==null?order.createTime:order.singInTime).Format("yyyy-MM-dd hh:mm")+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+order.createUserName+'</td>';
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
							'<td>'+(detail.orderPrice*detail.number).toFixed(2)+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+order.orderPrice.toFixed(2)+'</td>'+
							fileContent+
							'<td rowspan=' + rowSpanNum + '>'+ order.address.consignee+'<br/>'+ order.address.phone+'</td>'+
							'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
							'<td rowspan=' + rowSpanNum + '>已签收<br/>' + order.logistics.name +'<br/>' + order.logisticsCode+'<br/><a href="https://www.kuaidi100.com/chaxun?com='+order.logistics.name+'&nu='+order.logisticsCode+'"  target="_blank" style="color: blue;"><u>物流查询</u></a></td>'+
							'<td rowspan=' + rowSpanNum + '>'+returnVisitContent+'</td>'+
							'<td rowspan=' + rowSpanNum + '>'+
								'<a  onclick="toDetail(' +order.id+')" class="blue">订单详情</a><br/><br/>'+
								'<a  onclick="confirmOrder(' +order.id+',5)" style="background: #3e7bcc;border-radius: 5%;color: white;padding: 0.2em 0.5em;">确认收货</a><br/><br/>'+
								(order.is_after_sales == 0?'<a  onclick="addAfterSales(' +order.id+',5)" class="blue">申请售后</a>':'')+
							'</td>'+
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
								'<td>'+(detail.orderPrice*detail.number).toFixed(2)+'</td>'+
								fileContent+
								'<td>'+(detail.remarks == null ? "" : detail.remarks)+'</td>'+
						    '</tr>';
						}
					});
					
			});
		}else{
			layer.msg(res.msg);
			$('.bodBox').html("");
		}
		$(".m_o_tab").html(str);

	};
	
	getDataFromService(ajaxUrl, type, JSON.stringify(param), callBack);
}

function toDetail(id){
	sessionStorage.setItem("orderId",id);
	window.open("/pages/user/orderDetail.html");
}
