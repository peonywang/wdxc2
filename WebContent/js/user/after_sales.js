/**
 * 提交售后
 * @returns
 */
function submitAfterSales(){
	  var orderid = $("#orderid").text();
	  var value = $("#remark").val();
	  if(isEmpty(value)){
		  layer.msg("原因不能为空")
		  return;
	  }
	  var picture_url = '';
	  $("#picDiv").find("img").each(function(index,img){
		  if($(this).attr("alt") == '缩略图'){
			  if(picture_url == ''){
				  picture_url = $(this).attr("src");
			  }else{
				  picture_url += ','+$(this).attr("src");
			  }
		  }
	  });
	  
	  
	  var params = {};
	  params.orderId = orderid;
	  params.remark=value;
	  if(picture_url != ''){
		  params.picture_url=picture_url
	  }
		  
	  console.log(params);
	  
	  layer.load();
	  getDataFromService("/order/after_sales","POST",JSON.stringify(params),function(res){
		  layer.closeAll();
		  console.log(res);
		  if(res.code == 1){
			  layer.alert("售后件提交成功！",function(){
				  location.href = "/pages/user/myOrder.html?state="+after_sales_state;
			  });
		  }else{
			  layer.msg(res.msg);
		  }
	  });
}
var after_sales_state = 4;
/**
 * 弹出售后框
 * @param id
 * @returns
 */
function addAfterSales(id,state){
	after_sales_state = state;
	$("#afterSales").show();
	$("#orderid").text(id);
}
/**
 * 添加一张上传图片
 * @returns
 */
function addPic(){
	
	var picSize = $("#picDiv").find("img").length;
	
	console.log(picSize/2);
	
	if(picSize/2 >= 9){
		layer.msg("最多只能上传9张图片");
		return;
	}
	$("#uploadInfoInput").click();
	
}
/**
 * 选择图片上传事件
 * @returns
 */
function selectImageEvent(node){
	var picSize = $("#picDiv").find("img").length;
	console.log("已经上传："+picSize/2);
	
	var files = $(node).get(0).files;
	console.log("本次选择："+files.length);
	if(files.length + picSize/2 > 9){
		layer.msg("最多只能上传9张图片");
		return;
	}
	var orderid = $("#orderid").text();
	
	uploadImageFile(files,0,orderid);
}

/**
 * 删除图片
 * @returns
 */
function del(node){
	$(node).parent("label").remove();
}

/**
 * 图片上传
 * @returns
 */
function uploadImageFile(files,index,orderid){
	
	var fd = new FormData();
    fd.append('file', files[index]);
    fd.append("orderid",orderid);
    
    if(index == 0){
    	layer.load();
    }
    
    $.ajax({
	  	  url: "/file/upload_image",
	  	  data: fd,
	  	  type:"POST",
	  	  timeout:30*1000,
	  	  dataType: "json",
	  	  headers: {
	            'auth-token' : token
	      },
	      cache: false,//上传文件无需缓存
	      processData: false,//用于对data参数进行序列化处理 这里必须false
	      contentType: false, //必须
	      success: function(data){
	    	  console.log(data);
	    	  if(data.code == 1){
	    			$("#picDiv").append('<label'+
	    					'style="margin-right: 1em; display: inline-block; color: #010101; position: relative; border: 1px solid #fcfcfc; width: 40px; height: 40px;">'+
	    					'<img src="'+data.obj+'" alt="缩略图" style="width: 40px; height: 100%;">'+
	    					'<img src="/images/order/del.png" alt="删除" style="right: 0; position: absolute; bottom: 0; cursor: pointer;"'+
	    					'onclick="del(this)">'+
	    				'</label>');
	    			
	    	  }
	    	  if(index == files.length -1){
	    		  layer.closeAll();
	    	  }else{
	    		  uploadImageFile(files,index+1,orderid);
	    	  }
	      },
	      xhr: function() { //用以显示上传进度
	        var xhr = $.ajaxSettings.xhr();
	        if (xhr.upload) {
	            xhr.upload.addEventListener('progress', function(e) {
	                
	            }, false);
	        }
	        return xhr;
	      }
    });
}