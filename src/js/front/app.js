/**
 * [QZSDApp 前台总模块]
 * @type {[type]}
 */
var QZSDApp = angular.module('QZSDApp', ['ngRoute', 'frontHome', 'frontCart', 'frontUser','frontGoods' ,'frontOrder','orderReview']);

/**
 * [QZSDApp 路由配置]
 * @param  {[type]} $routeProvider
 * @return {[type]} 
 */
QZSDApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.
	when('/', {
		controller: frontHome.indexCtrl,
		templateUrl: 'front/index/home.html'
	}).
	when('/eq', {
		templateUrl: 'front/index/EQ.html'
	}).
	when('/activity', {
		templateUrl: 'front/index/activity.html'
	}).
	when('/introduce', {
		templateUrl: 'front/index/introduce.html'
	}).
	when('/birthday', {
		templateUrl: 'http://114.215.241.76/vinke/index_birthday/index.html'
	}).
	when('/fanfankan', {
		templateUrl: 'http://114.215.241.76/vinke/dafengshou_index/index.html'
	}).
	when('/order_eq', {
		templateUrl: 'front/index/order_question.html'
	}).
	when('/login',{
		controller: frontUser.login,
		templateUrl: 'front/user/login.html'
	}).
	when('/user_agreement',{
		controller: frontUser.register,
		templateUrl: 'front/user/user_agreement.html'
	}).	
	when('/register',{
		controller: frontUser.register,
		templateUrl: 'front/user/register.html'
	}).
	when('/forget',{
		controller: frontUser.forgetPwd,
		templateUrl: 'front/user/forget_password.html'
	}).
	when('/userCenter/changePassword',{
		controller: frontUser.changePassword,
		templateUrl: 'front/user/change_pwd.html'
	}).
	when('/userCenter',{
		controller: frontUser.userCenterCtrl,
		templateUrl: 'front/user/user_center.html'
	}).
	when('/position',{
		controller: frontHome.positionCtrl,
		templateUrl: 'front/index/area.html'
	}).
	when('/cart',{
		controller: frontCart.cartCtrl,
		templateUrl: 'front/cart/index.html'
	}).
	when('/orderReview',{
		controller: orderReview.orderReviewCtrl,
		templateUrl:'front/cart/order_review_html.html'
	}).
	when('/orderReview/address',{
		controller:orderReview.orderAddressCtrl,
		templateUrl:'front/cart/address.html'
	}).
	when('/orderReview/address/add',{
		controller:orderReview.orderAddressAddCtrl,
		templateUrl:'front/cart/address_add.html'
	}).
	when('/orders/search/:deliveryStatus',{
		templateUrl: 'front/orders/in_delivery.html'
	}).
	when('/address',{
		controller: frontUser.addressCtrl,
		templateUrl: 'front/address/address.html'
	}).
	when('/address_add',{
		controller:frontUser.addressAddCtrl,
		templateUrl: 'front/address/address_add.html'
	}).
	when('/address_update',{
		controller:frontUser.addressUpdateCtrl,
		templateUrl:'front/address/order_to_add.html',
	}).
	when('/goods/water/:type',{
		controller:frontGoods.goods_control,
		templateUrl: 'front/goods/water.html'
	}).	
	when('/detail',{
		templateUrl: 'front/goods/detail.html'
	}).	
	otherwise({
		redirectTo: '/login'
	});

}]);

// save a handle to the $rootScope obj
var rootScope;//用rootscope定义的值，可以在各个controller中使用,在这里使用在监听机制中
//var cookieStore;
QZSDApp.run(['$rootScope',function ($rootScope) {
	rootScope = $rootScope;
	//cookieStore = $cookieStore;
}]);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 跳转到某个控制器，一个UI页就是一个控制器
function goto_view(v) {
  	var baseUrl = window.location.href;
	baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
	window.location.href = baseUrl + "#/" + v;
}

function alert(str){
  layer.open({
    content: str,
    style: 'background-color:#303030; color:#ffffff;opacity: 0.8; font-family: microsoft yahei;border:none;min-width:50px;',
    time: 1
  });
}
 

// 全局SDK用的变量
var apiconn = new APIConnection();


var is_select_address=false;
var address_name="";
var address_phone="";
var address_address="";

// client_info 可选，每次请求，会自动带上，发送给服务端
apiconn.client_info.clienttype = "web";
//close debug switch
apiconn.DEBUG=false;

// 定义这样一个监听器，用来处理SDK 来的说与服务端连接状态改变了的通知
apiconn.state_changed_handler = function() {

	console.log("state: "+apiconn.from_state+" => "+apiconn.conn_state);

	// 这时候成功进入登录状态了。没登录时候只是访客状态。
	if (apiconn.conn_state == "IN_SESSION") {
			
		if (apiconn.login_name!=null&&apiconn.login_name!="") {
			sessionStorage.setItem("login_name", apiconn.login_name);
		    sessionStorage.setItem("login_passwd", apiconn.login_passwd);
		
		}
		else{
			sessionStorage.setItem("login_name", apiconn.credential_data.login_name);
		    sessionStorage.setItem("login_passwd", apiconn.credential_data.login_passwd);
		}
		goto_view("/");
		
	// 连接状态，表明SDK和服务端已经成功连上，获得了 server_info
	// 客户端可以允许用户输入密码（或从客户端保存密码）进行登录了
	} else if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {
		// auto re login after page refresh
		// 处理网页刷新自动登录的机制
		if (apiconn.login_name == "" && apiconn.credential_data == null) {
			
			var login_name = sessionStorage.getItem("login_name");
            var login_passwd = sessionStorage.getItem("login_passwd");
			
			var cred = sessionStorage.getItem("credential_data");
			var cred_obj = null;

			if (cred !== "") cred_obj = JSON.parse(cred);

			if (login_name != "" && login_name != null) {
				apiconn.credential(login_name, login_passwd);
                apiconn.connect();

			} else if (cred_obj != null) {
				apiconn.credentialx(cred_obj);
                apiconn.connect();
			}
		}
	}

};

// SDK 说服务端有数据过来了，这可以是请求的响应，或推送
apiconn.response_received_handler = function(jo) {
	//强制下线
	if(jo.act == "logout"){
		sessionStorage.setItem("login_name", "");
        sessionStorage.setItem("login_passwd", "");
        sessionStorage.setItem("credential_data", "");

		// 注销只需要把密码收回SDK就自动和服务端登出了，不会重连的
        apiconn.credential("", "");
        apiconn.connect();
        apiconn.conn_state ="LOGIN_SCREEN_ENABLED";

        //清空sessionStorage缓存
        sessionStorage.clear();
        if(jo.forced != "" && jo.forced == "1"){
        	alert("您的账号别处登陆，如果不是本人操作，请修改密码！");
        }else{
        	//主动注销，会自动回掉两次
        	alert("退出登录成功");
        }
        goto_view("login");
        return;
	}

	//登陆成功
	if (jo.obj == "person" && (jo.act == "login"||jo.act == "register")) {
      if (jo.derr!=null) {      //登录失败
        alert(jo.ustr);   //提示失败信息
        return;
      }
      else{
        //将用户数据存到session
        sessionStorage.setItem("user_info", JSON.stringify(jo.user_info));
        sessionStorage.setItem("server_info",JSON.stringify(jo.server_info));
        sessionStorage.setItem("person_id", jo.user_info._id);
      }
    }

	rootScope.$apply(function() {
	  // 通过这个机制，分发到所有控制器，感兴趣的控制器可以这样监听
	  // $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {}
	  rootScope.$broadcast("RESPONSE_RECEIVED_HANDLER", jo);
	});

};

apiconn.wsUri = "ws://114.215.241.76:51717/dafengshou";
apiconn.connect();

/**
 * [unix时间转本地时间]
 * @param  {[type]} 
 * @return {[type]} 
 */
QZSDApp.filter('unixToLocal',function(){
	var unixToLocal = function(ds){
		var now = new Date(parseInt(ds) * 1000);
		return  now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" "
		  +now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
	};
	return unixToLocal;
});


QZSDApp.filter('ToALine',function(){
	var ToALine = function(str){
		var temp = str;
		if(str.length>14){
			temp = str.substr(0,14) + "…";
		}
		return  temp;
	};
	return ToALine;
});

QZSDApp.filter('payType',function(){
	var payType = function(type){
		if(type == "cash"){
			return "货到付款";
		}else if(type == "wechat"){
			return "在线支付";
		}
	};
	return payType;
});

QZSDApp.filter('product_status',function(){
	var deliveryStatus = function(deliveryStatus){
			if(deliveryStatus == 'on_sale'){
				return "热销中";
			}
			else if(deliveryStatus == 'stop_sale'){
				return "售馨";
			}else if(deliveryStatus == 'un_sale'){
				return "已经下架";
		    }
	};
	return deliveryStatus;
});

QZSDApp.filter('product_type',function(){
	var deliveryStatus = function(deliveryStatus){
			if(deliveryStatus == 'bottlbd'){
				return "服装";
			}
			else if(deliveryStatus == 'tappet'){
				return "玩具";
			}else if(deliveryStatus == 'medicines'){
				return "读物";
		    }else if(deliveryStatus == 'other'){
				return "影视";
		    }else if(deliveryStatus == 'photo'){
				return "摄影";
		    }else if(deliveryStatus == 'mianbao'){
				return "辅食";
		    }else if(deliveryStatus == 'xueju'){
				return "学具";
		    }else if(deliveryStatus == 'ruanjian'){
				return "软件";
		    }else if(deliveryStatus == 'shougong'){
				return "手工";
		    }else if(deliveryStatus == 'magic'){
				return "魔术";
		    }
	};
	return deliveryStatus;
});


