/**
 * [frontCart 结算购物车，订单预览模块]
 * @type {[type]}
 */
var orderReview = angular.module('orderReview',[]);

orderReview.controller('orderReviewCtrl', ['$scope', function($scope){
  var pay_type="cash";

	//初始化订单预览请求	
	$scope.order_review=function(){

	  //校验是否登录
	  var login_name = sessionStorage.getItem("login_name");
      if(login_name==null ||login_name==""){
        alert("请先登录"); 
        goto_view("login");
        return;
      }  
	  //读取购物车情况  
	  var product_array=[];
	  var shop_car = JSON.parse(sessionStorage.getItem("shop_car"));
	  if (shop_car==null ||shop_car==""||shop_car=="undefined"||shop_car.length==0){
	    alert("当前购物车为空");
	 	  goto_view("/");
	  }
	  else{
	  	product_array=shop_car;
	  }
     
    $scope.product_size=product_array.length;
    
    //发送订单预览请求
    apiconn.send_obj({
        "obj": "order",
        "act": "preview",
        "person_id":sessionStorage.getItem("person_id"),
        "product_array":product_array
    });
      
	}
  //确认订单
  $scope.newOrder = function(event){

      if ($scope.order.name==null || $scope.order.name=="") {
        alert("请选择地址"); 
        return;
      }
      if ($scope.order.phone==null || $scope.order.phone=="") {
        alert("请选择地址"); 
        return;
      }
      if ($scope.order.address==null || $scope.order.address=="") {
        alert("请选择地址");
        return; 
      }

      //校验是否登录
      var login_name = sessionStorage.getItem("login_name");
      if(login_name==null ||login_name==""){
          alert("请先登录"); 
          goto_view("login");
          return;
      }  
      //读取购物车情况  
      var product_array=[];
      var shop_car = JSON.parse(sessionStorage.getItem("shop_car"));
      if (shop_car==null ||shop_car==""||shop_car=="undefined"||shop_car.length==0){
        alert("当前购物车为空");
        goto_view("/");
      }
      else{
        product_array=shop_car;
      }

      
      layer.open({
        content: '您确认要下此订单吗?',
        btn: ['确认', '取消'],
        shadeClose: false,
        yes: function(){
        
            //发送订单预览请求
            apiconn.send_obj({
              "obj": "order",
              "act": "add",
              "person_id":sessionStorage.getItem("person_id"),
              "name":$scope.order.name,
              "phone":$scope.order.phone,
              "address":$scope.order.address,
              "pay_type":pay_type,
              "remarks":$scope.order.remarks,
              "product_array":product_array
            });
        }, 
        no: function(){}
      });
      
  }
  //修改支付方式
  $scope.choice=function(payType) { 
    
    // if (pay_type == "wechat") {
    //   alert("sorry,微信支付正在紧张开发中...");
    //   pay_type = "wechat";
    //   return;
    // }; 
    
    pay_type = payType;
    
    $(".mpladd_ispayway").addClass("payno");
    $("#"+pay_type).removeClass("payno");
    
  }

	//监听广播
	$scope.$on("RESPONSE_RECEIVED_HANDLER",function(event,jo){
	  //服务端推送过来的消息//
	  if (jo.obj == "order" && jo.act == "preview") {
	      $scope.order=jo.order;

		  //用户选择地址后，填充地址信息
	      if (is_select_address) {
	      	$scope.order.name=address_name;
	      	$scope.order.phone=address_phone;
	      	$scope.order.address=address_address;
			    is_select_address=false;	
	      }
	  };
    //订单完成预订
    if (jo.obj == "order" && jo.act == "add") {
       if (!jo.derr) { //登录失败
          alert("订单创建成功");
          //清空session中的购物车
          //sessionStorage.removeItem("shop_car"); //防止上次购物车物品没清空，删除后变成重现上次购物记录
          sessionStorage.removeItem("shop_car");
          goto_view("orders/search/wait");  

       }
       else{
          alert(jo.ustr); 
       }    
    };
	});

}]);

/** 
 * 选择地址控制器 
 * @param  {[type]} $scope){	}] [description]
 * @return {[type]}               [description]
 */
orderReview.controller('orderAddressCtrl', ['$scope', function($scope){
  
  //初始化加载用户地址
  $scope.initData=function(event){
    apiconn.send_obj({
      "obj":"person",
      "act":"address_getList",               
      "person_id":sessionStorage.getItem("person_id")                     
    }); 
  };
  
  //在常用地址view，用户选择地址
  $scope.selectAddress=function(event,address_id){
   
   address_name= $('#'+address_id+" .name").text();
   address_phone= $('#'+address_id+" .phone").text();
   address_address= $('#'+address_id+" .address").attr("realAddress");
   is_select_address=true;
   
   goto_view('orderReview');

  }
  //回填数据,常用地址view，address/address.html里的address_array数据
  $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
    if (jo.obj == "person" && jo.act == "address_getList") {
      $scope.address_array=jo.address_array;
    };
  });


}]);

/**
 * 地址增加
 * 
 * @param  {[type]} $scope){	}] [description]
 * @return {[type]}               [description]
 */
orderReview.controller('orderAddressAddCtrl', ['$scope', function($scope){
  
  //新增加地址 
  $scope.newAddress=function(){
    apiconn.send_obj({
      "obj":"person",
      "act":"address_add",               
      "person_id":sessionStorage.getItem("person_id"),
      "name":$scope.name,
      "phone":$scope.phone, 
      "address":$scope.address       
    });
  }
  //响应
  $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
    if (jo.obj == "person" && jo.act == "address_add") {
      if (jo.derr) {
        alert(jo.ustr); 
        return;
      }
      if(jo.status=="success") {
        alert("新建成功");
        goto_view("orderReview/address");
      }
    };
  });
}]);






