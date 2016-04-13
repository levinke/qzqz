var frontGoods = angular.module('frontGoods', []);

frontGoods.controller('goods_control', ['$scope', '$routeParams', function($scope, $routeParams) {
	rootScope.loadNum = 6;
	
	$scope.recommend = "力荐";
	
	$scope.ref_data = function(event) {
		$scope.init_data(event);
		$(".baoliao_more").html('加载更多');
		$(".baoliao_more").bind("click",function(){$scope.load_data(event)});
	};
	
	$scope.load_data = function(event) {
		rootScope.loadPage += 1;
		//$(".baoliao_list").empty();
		$(".baoliao_more").html("<img src='../img/loading.gif' />");
		
		//获得商品数据
		apiconn.send_obj({
			"obj": "product",
			"act": "getlist",
			"page_num": rootScope.loadPage,
			"per_page_count": rootScope.loadNum,
			"product_type": $routeParams.type,
			"status": "on_sale"
		});
		//alert(rootScope.loadPage);
	};
	
	$scope.init_data = function(event) {
		rootScope.loadPage = 1;
		if ($routeParams.type.trim() == "bottlbd") {
			$scope.title = "服装";
		} else if ($routeParams.type.trim() == "tappet") {
			$scope.title = "玩具";
		} else if ($routeParams.type.trim() == "medicines") {
			$scope.title = "读物";
		} else if ($routeParams.type.trim() == "other") {
			$scope.title = "影视";
		} else if ($routeParams.type.trim() == "photo") {
			$scope.title = "摄影";
		} else if ($routeParams.type.trim() == "mianbao") {
			$scope.title = "辅食";
		} else if ($routeParams.type.trim() == "xueju") {
			$scope.title = "学具";
		} else if ($routeParams.type.trim() == "ruanjian") {
			$scope.title = "软件";
		} else if ($routeParams.type.trim() == "shougong") {
			$scope.title = "手工";
		} else if ($routeParams.type.trim() == "magic") {
			$scope.title = "魔术";
		};

		//获得商品数据
		apiconn.send_obj({
			"obj": "product",
			"act": "getlist",
			"page_num": rootScope.loadPage,
			"per_page_count": rootScope.loadNum,
			"product_type": $routeParams.type,
			"status": "on_sale"
		});
		//alert(rootScope.loadPage);

	};
	
	$scope.toDetail = function(product) {
		localStorage.setItem("goods_detail",JSON.stringify(product)); 
		goto_view("detail");
		console.log(product);	
	};


	$scope.tocar = function(event, product_id, product_name, product_image, price, discount_price) {

		var login_name = sessionStorage.getItem("login_name");

		//校验是否登录
		if (login_name == null || login_name == "") {
			//请登录后在试
			alert("请先登录");
			goto_view("login");
			return;
		}
		//如果当前没有购物车，就新建一个 
		var shop_car = JSON.parse(sessionStorage.getItem("shop_car"));
		if (shop_car == null || shop_car == "") {
			shop_car = [];
			//sessionStorage.setItem("shop_car", JSON.stringify(shop_car)); 
		}
		//遍历当前购物车
		var i = 0;
		for (; i < shop_car.length; i++) {
			if (shop_car[i].product_id == product_id) {
				shop_car[i].count = shop_car[i].count + 1;
				break;
			}
		}
		//如果当前没有在购物车找到商品
		if (shop_car.length == i) {
			var product = {
				product_id: "",
				product_name: "",
				product_image: "",
				price: 0,
				discount_price: 0,
				count: 0
			};
			product.product_id = product_id;
			product.count = 1;
			product.product_name = product_name;
			product.product_image = product_image;
			product.price = price;
			product.discount_price = discount_price;
			shop_car.push(product);
		}
		//存入session
		sessionStorage.setItem("shop_car", JSON.stringify(shop_car));
		// 
		var cart = JSON.parse(sessionStorage.getItem("shop_car"));

		var amount = 0;
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].product_id == product_id) {
				amount = cart[i].count;
				$("#count" + product_id).html(amount);
				break;
			}
		}

		// document.getElementById("num"+product_id).innerHTML= amount;
		//  $("#num"+product_id).text(amount);
		// console.log("当前购物车：==================");
		// for(var i = 0 ;i < cart.length ;i++){
		//   console.log("  商品ID："+cart[i].product_id
		//     +"  商品数量："+cart[i].count
		//     +"  商品名字："+cart[i].product_name
		//     +"  商品价格："+cart[i].price
		//     +"  折扣价格："+cart[i].discount_price 
		//     +"  商品图片："+cart[i].product_image+"\n"); 
		// }
		// 
		alert("已加入购物车,已有" + amount + "件");
	}


	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		//服务端推送过来的消息
		if (jo.obj == "product" && jo.act == "getlist" && jo.page_num == 1) {
			if(jo.product_list.length < rootScope.loadNum && jo.product_list.length >0){
				$scope.product_array = jo.product_list;
				$(".baoliao_more").html('已全部加载完成');
				$(".baoliao_more").unbind("click");
			}else{
				$scope.product_array = jo.product_list;
				$(".baoliao_more").html('加载更多');
			}
		}
		if (jo.obj == "product" && jo.act == "getlist" && jo.page_num > 1) {
			//alert(jo.order_count);//1(sum == 16)
			if(jo.product_list.length < rootScope.loadNum && jo.product_list.length >0){
				$(".baoliao_more").html('已全部加载完成');
				$(".baoliao_more").unbind("click");
				for (var i=0;i<jo.product_list.length;i++) {
					alert(jo.product_list.length+"if"); // 1
					console.log(jo.product_list[i]);
					$scope.product_array.push(jo.product_list[i]);
				}
			}else{
				for (var i=0;i<jo.product_list.length;i++) {
					alert(jo.product_list.length+"else"); // 1
					$scope.product_array.push(jo.product_list[i]);
				}
				console.log(rootScope.loadPage);
				$(".baoliao_more").html('加载更多');
				//$(".baoliao_more").bind("click",function(){});
			}
		}


	});

}]);

frontGoods.controller('goodsDetail_control', ['$scope', function($scope){
	
	$scope.goods_detail = JSON.parse(localStorage.getItem("goods_detail"));
	//console.log(localStorage.getItem("goods_detail")); 
	
	$scope.return = function() {
		window.history.go(-1);
	};
	
}]);