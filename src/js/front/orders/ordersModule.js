/**
 * [frontOrder 前台订单模块]
 * @type {[type]}
 */
var frontOrder = angular.module('frontOrder',[]);

frontOrder.controller('orderList', ['$scope', '$routeParams', function($scope,$routeParams){


	/**
	 * [initData 订单界面参数初始化]
	 * @return {[type]} [description]
	 */
	$scope.initData = function(){
		if($routeParams.deliveryStatus == "wait"){
			
			$(".order_head>ul>li").each(function(){ 

	            $(this).find("a").removeClass("active");

	            if($(this).index() == 0){
	                $(this).find("a").addClass("active");
	                getServerOrders("wait");
	                $scope.deliveryStatus = "wait";
	            }
	            if($(this).index() == 1){
	                $(this).find("a").addClass("active");
	                getServerOrders("wait");
	                $scope.deliveryStatus = "wait";
	            }
	            if($(this).index() == 2){
	                $(this).find("a").addClass("active");
	                getServerOrders("wait");
	                $scope.deliveryStatus = "wait";
	            }
	        });
		}
		else if($routeParams.deliveryStatus == "trans"){
			$(".order_head>ul>li").each(function(){ 
				
	            $(this).find("a").removeClass("active");

	            if($(this).index() == 1){
	            	// console.log($(this).index());
	                $(this).find("a").addClass("active");
	                getServerOrders("trans");
	                $scope.deliveryStatus = "trans";
	            }
	        });
		}
		else if($routeParams.deliveryStatus == "finish"){
			$(".order_head>ul>li").each(function(){ 
				
	            $(this).find("a").removeClass("active");

	            if($(this).index() == 2){
	            	// console.log($(this).index());
	                $(this).find("a").addClass("active");
	                getServerOrders("finish");
	                $scope.deliveryStatus = "finish";
	            }
	        });
		}
	};

	/**
	 * [订单列表抬头点击事件]
	 * @param  {[type]} delivery 
	 * @param  {[type]} event
	 * @return {[type]}         
	 */
	$(".order_head>ul>li").click(function(delivery, event){
        var s = $(this).index();
        
        $(".order_head>ul>li").each(function(){ 

            $(this).find("a").removeClass("active");

            if($(this).index() == s){
            	
                $(this).find("a").addClass("active");

                if($(this).index() == 0){
                	
                	getServerOrders("wait");
                	$scope.deliveryStatus = "wait";
                    
                }
                else if($(this).index() == 1){
                	
                	getServerOrders("trans");
                	$scope.deliveryStatus = "trans";
                    
                }
                else if($(this).index() == 2){
                	
                	getServerOrders("finish");
                	$scope.deliveryStatus = "finish";
                    
                }
            }
         
        });
    });

	/**
	 * [getServerOrders 根据订单状态获取订单列表]
	 * @param  {[type]} deliveryStatus [订单状态]
	 * @return {[type]}                [description]
	 */
    var getServerOrders = function(deliveryStatus){
    	
    	var person_id = sessionStorage.getItem("person_id");
    	console.log(person_id);
    	apiconn.send_obj({
	          "obj":"person",
			  "act":"getorder",
			  "page_num":1,                 //请求的页数(默认是第一页)
			  "per_page_count":10,          //每页的数量(默认每页返回15条数据)
			  "person_id": person_id,
			  "delivery": deliveryStatus
        });
    };

    $scope.getoNextPage = function(pageNum){
    	var person_id = sessionStorage.getItem("person_id");
    	pageNum = pageNum + 1;
    	apiconn.send_obj({
	          "obj":"person",
			  "act":"getorder",
			  "page_num":pageNum,                 //请求的页数(默认是第一页)
			  "per_page_count":10,          //每页的数量(默认每页返回15条数据)
			  "person_id": person_id,
			  "delivery": $scope.deliveryStatus
        });
    };

	$scope.goToPay = function(orderId){
		var url = "http://www.ysbiaoju.com/cgi-bin/wechat.pl?order_type=1&do=GetOrderInfo&order_id="+orderId;
    	layer.open({
        content: '选择支付方式?',
        btn: ['微信支付', '货到付款'],
        shadeClose: false,
        yes: function(){
          window.location.href = url; // location.href=超链接到某一个页面
        }, 
        no: function(){
       		//发送订单预览请求
          apiconn.send_obj({
		      "obj":"order",
			  "act":"update",
			  "order_id":orderId,  	    //订单ID
			  "status":"finish_pay",
			  "pay_type":"cash"          
	      });
        }
      });
    };

    $scope.orderConfirm = function(orderId){
    	layer.open({
        content: '确认收货?',
        btn: ['确认', '取消'],
        shadeClose: false,
        yes: function(){
          //发送订单预览请求
          apiconn.send_obj({
		      "obj":"order",
			  "act":"update",
			  "order_id":orderId,  			//订单ID
			  "delivery":"finish",          //物流状态
	      });
        }, 
        no: function(){}
      });
    };
    $scope.orderDelete = function(orderId){
    	layer.open({
	        content: '您要取消订单吗?',
	        btn: ['确认', '取消'],
	        shadeClose: false,
	        yes: function(){
	          //发送订单预览请求
	          apiconn.send_obj({
			      "obj":"person",
				  "act":"cancelorder",
			      "order_id":orderId  			   //订单ID
		      });
	        }, 
	        no: function(){}
        });


    };
    
    

    /**
     * [服务端回调函数]
     * @param  {[type]} event 
     * @param  {[type]} jo
     * @return {[type]} [description]
     */
    $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
    	console.log(jo.toString());
    	
    	if (jo.obj == "gateway" && jo.act == "pay") {
    		console.log(jo.return_back.msg);
			$scope.zhifu_form = jo.return_back.data.replace(/\\/g, "");
			alert($scope.zhifu_form);
		}
    	

    	if((jo.act != null || jo.act != "") && jo.act == "getorder"){
    		$scope.pageNum = jo.page_num;
            var totalPage = jo.order_count % jo.per_page_count == 0 ? jo.order_count /jo.per_page_count : parseInt(jo.order_count /jo.per_page_count + 1);
            var currentPage = jo.page_num;          //当前页

    		if(jo.page_num == 1){               
    			$scope.orders = jo.order_list;
    		}else{

    			if(jo.order_list == "[]" || jo.order_list == null || jo.order_list == ""){
    				alert("没有新的订单了哦~");
    			}else{
                    
    				$scope.orders = $scope.orders.concat(jo.order_list);
    			}
    		}

            if(currentPage >= totalPage){
                $("#more").hide(-3000);
            }else{
                $("#more").show();
            }
    	}
    	else if((jo.act != null || jo.act != "") && jo.act == "update"){
    		if(jo.order.delivery == "wait"){
    			alert("付款成功，马上为您配送~");
    			getServerOrders("wait");
    		}
    		else{
    			//刷新界面
	    		alert("确认收货成功");
		    	getServerOrders("trans");
    		}
    		
    	}
    	else if(jo.obj="person"&& jo.act == "cancelorder"){
    		//刷新界面
	    	if (jo.status!="success") {
	    		alert(jo.ustr);	
	    		return;	
	    	}
	    	else{
	    	  alert("已经成功取消!");
	    	  getServerOrders("wait");
	    	}

    	}
  	});


}]);