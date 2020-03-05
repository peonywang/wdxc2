//上传文件传参数
var currentSelectedOrderid,currentSelectedOrderDetailid;
//正在上传的详情ID数组
var uploading = JSON.parse(localStorage.getItem("uploading"));

var state = 2;
console.log(uploading);
localStorage.removeItem("uploading");
$(function(){
	if(!window.sessionStorage){
        alert("您的浏览器不支持本站上传要求，请升级浏览器版本或者更换其他浏览器");
        return false;
    }else{
        //主逻辑业务
    	
    	var uploadDetails = JSON.parse(sessionStorage.getItem("uploadDetail"));
    	
		console.log(uploadDetails);
    	state = uploadDetails.urlState;
    	currentSelectedOrderid = uploadDetails.orderid;
    	
    	
    	var fileName = uploadDetails.fileName;
    	var fileType = uploadDetails.fileType;
    	var orderid = uploadDetails.orderid;
    	var fileSize = fileSize = (uploadDetails.fileSize/1024/1024).toFixed(2);;
    	
    	var orderInfo = '<tr>'+
				    	 	'<td>订单号</td>'+
				    	 	'<td style="width:30%;padding-left:10px;">产品名称</td>'+
				    	 	'<td style="width:60%;">文件制作要求</td>'+
				    	 	'</tr>';
    	
    	$.each(uploadDetails.details,function(index,item){
			currentSelectedOrderDetailid = item.id;
			
    		if(index == 0){
    			orderInfo += '<tr>'+
					    	 	'<td  rowspan="'+uploadDetails.details.length+'"  >'+(orderid>10000000000?orderid:uploadDetails.orderNumber)+'</td>'+
					    	 	'<td style="padding-left:10px;">'+item.groupName+'</td>'+
					    	 	'<td >'+item.note.replace(/\\n/g,"").replace(/"/g,"")+'</td>'+
					    	 '</tr>';
    		}else{
    			orderInfo += '<tr>'+
					    	 	'<td>'+item.groupName+'</td>'+
					    	 	'<td style="border-top:1px solid #c8c3c3;">'+item.note.replace(/\\n/g,"").replace(/"/g,"")+'</td>'+
					    	 '</tr>';
    			
    		}
    		
    	});
    	$("#orderInfo").html(orderInfo);
    	
    	var fileType = uploadDetails.fileType;
    	if(fileType == 1){
    		$("#picker_btn").text("选择要上传的压缩包");
    	}else if(fileType == 2){
    		$("#fileName").text(fileName);
    		$("#fileSize").text(fileSize+"MB/"+fileSize+"MB");
    		$("#progressStatus").text("已上传成功");
    		$("#picker_btn").text("选择要替换的压缩包");
    		$("#uploadingDiv").show();
    		
    	}
    	
    	initFileUp();
    }
	
});

//这个脚本是 ie6和ie7 通用的脚本
function custom_close(){
if 
(confirm("您确定要关闭本页吗？")){
window.opener=null;
window.open('','_self');
window.close();
}
else{}
}

//上传中状态
var isUploading = false;

var fileMd5,chunks;

function initFileUp(){
	
	 //监听分块上传过程中的三个时间点  
    WebUploader.Uploader.register({  
        "before-send-file":"beforeSendFile",  
        "before-send":"beforeSend",  
        "after-send-file":"afterSendFile",  
    },{  
        //时间点1：所有分块进行上传之前调用此函数  
        beforeSendFile:function(file){  
        	
        	if(HASH["id"] != currentSelectedOrderid){
        		layer.alert('订单信息已发送变化，请返回订单列表重新操作!', {icon: 3, title:'提示'}, function(index){
        			custom_close();
    			});
        		return;
        	}
        	
            var deferred = WebUploader.Deferred();  
            //1、计算文件的唯一标记，用于断点续传  
            (new WebUploader.Uploader()).md5File(file,0,5*1024*1024)  
                .progress(function(percentage){  
					alert(1)
                    $("#progressStatus").text("正在读取文件信息...");  
                })  
                .then(function(val){  
                    fileMd5=val;  
					$("#progressStatus").text("成功获取文件信息1...");  
                    //获取文件信息后进入下一步  
					deferred.resolve();  
					alert('03')
                });  
            
            //开始上传
            if(isUploading){
				alert(3)
				
        		layer.alert("已有文件正在上传中...");
        		return;
        	}
            if(uploading == null){
			alert('00')

            	uploading = new Array();
            }
            //去重
            var isCanPush = 1;
            uploading.forEach(function(item, index, arr) {
			alert('01.1')

			    if(item == currentSelectedOrderid) {
			    	isCanPush = 0;
			    }
			});
            if(isCanPush == 1){
			alert('01.0')

            	//记录正在上传的订单ID
                uploading.push(currentSelectedOrderid);
            }
            console.log("剩余正在上传数组："+uploading);
            localStorage.setItem("uploading",JSON.stringify(uploading));
			alert('02')
            
        	isUploading = true;
        	$("#fileName").text(file.name);
    		var fileSize = (file.size/1024/1024).toFixed(2);
    		$("#fileSize").text("0MB/"+fileSize+"MB");
        	$("#uploadingDiv").show();
            return deferred.promise();  
        },  
        //时间点2：如果有分块上传，则每个分块上传之前调用此函数  
        beforeSend:function(block){  
			alert('04')
            var deferred = WebUploader.Deferred(); 
            
            //分片文件上传之前
        	var param = {};
        	//文件名称
        	param.chunkSize = block.end-block.start;
        	param.chunk = block.chunk;
        	param.fileMd5 = fileMd5;
        	chunks = block.chunks;
            //验证是否断点续传
            getDataFromService("https://www.yl123.cn/uploadFile/md5Validation","POST",JSON.stringify(param), function(res){
				// console.log(res);
				alert('05')
				deferred.resolve();
            	// if(res.code == 1){
				// 	alert('06')
            	// 	if(res.obj.ifExist){
            	// 		 //分块存在，跳过不再上传  
                //         deferred.reject();  
                //     }else{  
				// 		alert('07')
                //         //分块不存在或不完整，重新发送该分块内容  
                //         deferred.resolve();  
                //     }  
            	// }else{
				// 	alert('08')
            	// 	console.log(res.msg);
            	// 	deferred.resolve();  
            	// }
            }); 
            this.owner.options.formData.fileMd5 = fileMd5;  
            return deferred.promise();  
        }/*,  
        //时间点3：所有分块上传成功后调用此函数  
        afterSendFile:function(){  
            //如果分块上传成功，则通知后台合并分块  
            $.ajax({  
                type:"POST",  
                url:"<%=basePath%>Video?action=mergeChunks",  
                data:{  
                    fileMd5:fileMd5,  
                },  
                success:function(response){  
                    alert("上传成功");  
                    var path = "uploads/"+fileMd5+".mp4";  
                    $("#item1").attr("src",path);  
                }  
            }); 
        }  */ 
    });  
    
	var uploader = WebUploader.create({
		// [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
		auto:true,
        // 不压缩image
        resize: false,
        // swf文件路径
        swf:'/css/Uploader.swf',
        // 文件接收服务端。
        server: '/uploadFile/fileUpload',
        // 选择文件的按钮。可选。内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker_btn',
        //是否分片
        chunked :true,
        //分片大小 2m
        chunkSize :1024*1024*2,
        //失败重试一次
        chunkRetry :1,
        //最大并发
        threads :3,
        //验证文件总数量, 超出则不允许加入队列。
        fileNumLimit :100,
        //去重 根据文件名字、文件大小和最后修改时间来生成hash Key.
        duplicate:true,
        //文件上传请求的参数表，每次发送都会发送此对象中的参数
        formData:{
        	orderId:currentSelectedOrderid,
        	orderDetailId:currentSelectedOrderDetailid
        },
        //指定接受哪些类型的文件
        accept:{
        	title: 'Zip',
            extensions: 'zip,rar',
            mimeTypes: '.zip,.rar'
        }
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
    	
    	$("#progressStatus").text("文件传输中..."); 
    	
        $('#progress').val(percentage * 100);
        
        var fileSize = (file.size/1024/1024).toFixed(2);
        var uploadSize = (fileSize * percentage).toFixed(2);
        
        $("#fileSize").text(uploadSize+"MB/"+fileSize+"MB");
        
        if(percentage == 1){
			console.log('06')
        	 $("#fileSize").text(fileSize+"MB/"+fileSize+"MB");
        	 $("#progressStatus").text('保存文件中...请稍等')
        }
    });
    
    uploader.on( 'uploadSuccess', function(file,response) {
    	console.log('07')
    	//console.log(file,response);
    	
    	//分片文件上传之前
    	var param = {};
    	//文件名称
    	param.name = file.name;
    	param.orderId = currentSelectedOrderid;
    	param.orderDetailId = currentSelectedOrderDetailid;
    	param.chunks = chunks;
    	param.size = file.size;
    	param.fileMd5 = fileMd5;
    	// 通知合并分块
    	var ajaxUrl = "https://www.yl123.cn/uploadFile/composeFile";
    	var type = "POST";
    	var callBack =function(res){
    		isUploading = false;
    		if(res.code == 1){
    			$("#progressStatus").text('文件上传完成！')
    			//从缓存上传中数组中删除此项
    			uploading = JSON.parse(localStorage.getItem("uploading"));
    			
    			uploading.forEach(function(item, index, arr) {
    			    if(item == currentSelectedOrderid) {
    			        arr.splice(index, 1);
    			    }
    			});
    			
    			console.log("剩余正在上传数组："+uploading);
    			localStorage.setItem("uploading",JSON.stringify(uploading));
    			
    			location.href = "myOrder.html?state="+state;
    		}else{
    			layer.alert(res.msg,function(){
    				location.href = location.href;
    			});
    		}
    	}
    	getDataFromService(ajaxUrl,type,JSON.stringify(param),callBack);
    });

    uploader.on( 'error', function( code ) {
    	var msg;
    	switch (code){
    	case 'Q_EXCEED_NUM_LIMIT':
    	    msg = '一个产品只能上传一个压缩包';
    	    break;
    	case 'Q_EXCEED_SIZE_LIMIT':
    	    msg = '上传文件大小过大';
    	    break;
    	case 'Q_TYPE_DENIED':
    	    msg = '文件类型上传错误';
    	    break;
    	}
    	layer.alert(msg);
    });
	//当某个文件的分块在发送前触发，添加自定义参数
    uploader.on( 'uploadBeforeSend', function(file, data, headers) {
    	data.orderId = currentSelectedOrderid;
    	data.orderDetailId = currentSelectedOrderDetailid;
    	chunks = file.chunks;
    	headers['auth-token'] = token;
    });
    uploader.on( 'uploadComplete', function( file ) {
        //$( '#'+file.id ).find('.progress').fadeOut();
    });
    
}