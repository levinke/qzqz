/**
 * [frontCart 前台购物车模块]
 * @type {[type]}
 */
var frontCart = angular.module('frontCart',[]);

frontCart.controller('cartCtrl', ['$scope', function($scope){	
	var total = 0;
	$scope.product_array=[];

	// for unit test
	$scope.position = "福州市";

	//初始化购物车数据
	$scope.init_car=function(evevt){
	  var shop_car = JSON.parse(sessionStorage.getItem("shop_car"));
	  //购物车活动数据初始化 
	  if (shop_car == null || shop_car == "" ||shop_car == undefined) {
	   	  shop_car=[];
	  };
	  $scope.product_array=shop_car;
	}

	//修改具体商品数量要记录到cookie中 type(add增加 reduce减少 delete删除)	
	$scope.product_update= function(evevt,product_id,type){

		var i=0;
		for(;i < $scope.product_array.length;i++){
	       if($scope.product_array[i].product_id == product_id){
	         if (type == "add") {
	           $scope.product_array[i].count = $scope.product_array[i].count + 1;
	         }
	         else if(type == "reduce"){
	           //如果当前数量为1,就不让减 
	           if($scope.product_array[i].count<=1){
	             return; 
	           }
	           $scope.product_array[i].count = $scope.product_array[i].count - 1;
	         }
	         else{
	           $scope.product_array.splice(i,1); 
	         }
	         break;
	      }
	     }

	     //更新session
	     var shop_car = JSON.parse(sessionStorage.getItem("shop_car"));
	     //遍历当前购物车
	     for(var i=0;i < shop_car.length;i++){
	       if(shop_car[i].product_id == product_id){
	         if (type =="add") {
	           shop_car[i].count = shop_car[i].count + 1;
	         }
	         else if(type=="reduce"){
	           //如果当前数量为1,就不让减 
	           if(shop_car[i].count==1){
	              return;
	           }
	           shop_car[i].count = shop_car[i].count - 1;
	         }
	         else{
	           shop_car.splice(i,1); 
	         }
	         break;
	      }
	     } 
	     //保存新的购物车
	     //存入session
         sessionStorage.setItem("shop_car", JSON.stringify(shop_car));
         
	}

	//计算购物车总价的函数
	 $scope.totalCart=function(){
	  total=0;
	  for(var i=0;i<$scope.product_array.length;i++){
		total=total+$scope.product_array[i].discount_price * $scope.product_array[i].count;
	  }
	  return total;
	}
	//结算购物车
	$scope.order_review =function(){
	   if($scope.product_array.length==0){
	   	 alert("您当前购物车为空");	
	   	 return;
	   } 
	   if(total<12){
	   		alert("最低起送价为12元，请多买些哟！！");
	   		return;
	   }
	   goto_view("orderReview"); 
	}

}]);