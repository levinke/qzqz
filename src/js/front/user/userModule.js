/**
 * [frontUser 前台用户模块]
 * @type {[type]}
 */
var frontUser = angular.module('frontUser', []);

//$("#name").val() = localStorage.getItem("histroyname"); //历史账号
/**
 * [前台用户登录功能]
 * @param  {[type]} $scope
 * @return {[type]} 
 */
frontUser.controller('login', ['$scope', function($scope) {

	$scope.login_name = localStorage.getItem("histroyname"); //历史账号
	$scope.login_passwd = localStorage.getItem("histroypass"); //历史密码

	$scope.loginValidate = function(event) {

		if (!$scope.login_name || $("#name").val().length != 11) {
			alert("亲，请输入11位手机号码！");
			return;
		}
		if (!$scope.login_passwd || $("#pass").val().length < 6) {
			alert("亲，请输入至少6位密码！");
			return;
		}

		localStorage.setItem("histroyname", $("#name").val()); //设置历史账号
		localStorage.setItem("histroypass", $("#pass").val()); //设置历史密码

		//apiconn.credential($scope.login_name, $scope.login_passwd);

		apiconn.credentialx({
			"ctype": "normal",
			"device_id": "12547996355",
			"login_name": $scope.login_name,
			"login_passwd": $scope.login_passwd
		});

		apiconn.connect();

	};

	$scope.register_goto = function(event) {
		goto_view("register");
	};

	$scope.forget_goto = function(event) {
		goto_view("forget");
	};

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		// if (jo.obj == "person" && jo.act == "login") {
		//   if (jo.derr!=null) {      //登录失败
		//     alert(jo.ustr);   //提示失败信息
		//     return;
		//   }
		//   else{
		//     alert("登陆成功");
		//     //将用户数据存到session
		//     sessionStorage.setItem("user_info", JSON.stringify(jo.user_info));
		//     sessionStorage.setItem("person_id", jo.user_info._id);   
		//     //sessionStorage.user_info = JSON.stringify(jo.user_info);
		//   }
		// }
	});
}]);

/**
 * [前台用户注册功能]
 * @param  {[type]} $scope
 * @return {[type]}     
 */
frontUser.controller('register', ['$scope', function($scope) {

	// for unit test
	$scope.name = "levinke";

	$scope.login_goto = function(event) {
		goto_view("login");
	};
	$scope.get_code = function(event) {

		if ($("#j-tel").val() == "" || $("#j-tel").val().length != 11) {
			alert("亲，请输入11位手机号");
			return;
		}

		apiconn.send_obj({
			"obj": "person",
			"act": "getcode",
			"phone": $scope.login_name,
			"type": "register"
		});

		setTime($("#j-code"));
	};
	var wait = 60;

	function setTime(o) {
		if (wait == 0) {
			o.removeAttr("disabled");
			o.css('background', '#FBB900');
			o.val("免费获取验证码");
			wait = 60;
		} else { // www.jbxue.com
			o.attr("disabled", true);
			o.css('background', '#DDDDDD');
			o.val("重新发送(" + wait + ")");
			// o.value="重新发送(" + wait + ")";
			wait--;
			setTimeout(function() {
					setTime(o)
				},
				1000)
		}
	}

	$scope.registerValidate = function(event) {

		var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){2,32}$/;

		if ($("#j-tel").val() == "" || $("#j-tel").val().length != 11) {
			alert("亲，请输入11位手机号");
			return;
		} else if ($("#j-code_text").val() == "") {
			alert("亲，请输入验证码");
			return;
		} else if ($("#j-code_text").val() != $scope.validateCode) {
			alert("亲，验证码错误");
		} else if ($("#j-pass").val() == "" || $("#j-pass").val().length < 7 || !reg.test($("#j-pass").val())) {
			alert("亲，请输入英文开头至少7位密码");
			return;
		} else if ($("#j-pass2").val() == "" || $("#j-pass2").val().length < 7) {
			alert("亲，请重复输入至少7位密码");
			return;
		} else if ($("#j-pass").val() != $("#j-pass2").val()) {
			alert("亲，密码输入不一致，请重新输入");
			$("#j-pass2").val("");
			return;
		} else if ($("#j-check").prop("checked") == false) {
			alert("亲，请同意并且勾选用户协议");
			return;
		} else {
			//apiconn.credential($scope.login_name,$scope.login_passwd);
			//赋予这个字段，SDK就会帮忙注册，并保活重连
			/*apiconn.registration = {
			 "io": "i",
			 "obj": "person",
			 "act": "register",
			 "login_name": $scope.login_name,
			 "login_passwd": $scope.login_passwd,
			 "display_name": $scope.login_name
			};
			apiconn.connect();*/
			console.log($scope.login_name + $scope.login_passwd);

			apiconn.send_obj_now({
				"obj": "person",
				"act": "register2",
				"login_name": $scope.login_name,
				"login_passwd": $scope.login_passwd,
				"device_id": "web125487963214"
			});
			/*apiconn.connect();*/

			//apiconn.send_obj_now({"obj":"person","act":"register2","login_name": "13067235233", "login_passwd": "ysys566", "device_id": "web125487963214" });
		}

		// 根据服务端 person:register 接口说明这几个字段填好
		// 服务端接口设计时一般会有这两个字段，也有可能会把登录时用的
		// 放在一个 credential_data 的字段
		// 服务端的注册接口可能还有其他要求填的字段

	};

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		// 是服务端给的消息成员上线，离线的消息 
		if (jo.obj == "person" && jo.act == "getcode") {
			if (jo.derr) {
				alert(jo.ustr);
				return;
			};

		}

		if (jo.obj == "person" && jo.act == "getcode") {
			$scope.validateCode = jo.code;
			alert(jo.code);
			console.log(jo.code);
		}
		// 注销返回，可以回到登录界面了
		if (jo.obj == "person" && jo.act == "logout") {
			goto_view("login");
		}
		if (jo.obj == "person" && jo.act == "register2") {
			alert("亲，注册成功");
			goto_view("login");
		}

	});
}]);


/**
 * [忘记密码]
 * @param  {[type]} 
 * @return {[type]}
 */
frontUser.controller('forgetPwd', ['$scope', function($scope) {

	$scope.get_code = function(event) {

		if ($("#j-tel").val() == "" || $("#j-tel").val().length != 11) {
			alert("亲，请输入11位手机号");
			return;
		}
		apiconn.send_obj({
			"obj": "person",
			"act": "getcode",
			"phone": $scope.login_name,
			"type": "modify"
		});
		setTime($("#j-code"));
	};
	var wait = 60;

	function setTime(o) {
		if (wait == 0) {
			o.removeAttr("disabled");
			o.css('background', '#FBB900');
			o.val("免费获取验证码");
			wait = 60;
		} else { // www.jbxue.com
			o.attr("disabled", true);
			o.css('background', '#DDDDDD');
			o.val("重新发送(" + wait + ")");
			// o.value="重新发送(" + wait + ")";
			wait--;
			setTimeout(function() {
					setTime(o)
				},
				1000)
		}
	}

	//  var step = 59;
	//  $('#btn').val('重新发送60');
	// var _res = setInterval(function()
	//  {   
	//   $("#btn").attr("disabled", true);//设置disabled属性
	//   $('#btn').val('重新发送'+step);
	//    step-=1;
	//    if(step <= 0){
	//      $("#btn").removeAttr("disabled"); //移除disabled属性
	//       $('#btn').val('获取验证码');
	//       clearInterval(_res);//清除setInterval
	//     }
	//   },1000);

	$scope.forgetPwdValidate = function(event) {

		var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){2,32}$/;

		if ($("#j-tel").val() == "" || $("#j-tel").val().length != 11) {
			alert("请输入11位手机号");
			return;
		} else if ($("#j-code_text").val() == "") {
			alert("请输入验证码");
			return;
		} else if ($("#j-code_text").val() != $scope.validateCode) {
			alert("验证码错误");
		} else if ($("#j-pass").val() == "" || $("#j-pass").val().length < 7 || !reg.test($("#j-pass").val())) {
			alert("请输入英文开头至少7位密码");
			return;
		} else if ($("#j-pass2").val() == "" || $("#j-pass2").val().length < 7) {
			alert("请重复输入至少7位密码");
			return;
		} else if ($("#j-pass").val() != $("#j-pass2").val()) {
			alert("密码输入不一致，请重新输入");
			$("#j-pass2").val("");
			return;
		} else {

			apiconn.send_obj({
				"obj": "person",
				"act": "changePwd",
				"action": "phone_setPwd", //当前是通过手机验证之后，直接设置密码
				"phone": $scope.login_name, //电话号码
				"verifycode": $scope.code, //验证码
				"new_pwd": $scope.login_passwd
			});
		}


	};

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

		if (jo.obj == "person" && jo.act == "getcode") {
			if (jo.derr) {
				alert(jo.ustr);
				return;
			};

		}
		if (jo.obj == "person" && jo.act == "getcode") {
			$scope.validateCode = jo.code;
		}
		if (jo.obj == "person" && jo.act == "changePwd") {
			if (jo.status == "success") {
				alert("亲，修改密码成功！请重新登陆哦");
				goto_view("login");
			}
		}
	});

}]);

/**
 * [修改密码]
 * @param  {[type]} 
 * @return {[type]} 
 */
frontUser.controller('changePassword', ['$scope', '$rootScope', function($scope, $rootScope) {
	//$scope.loginOldPwd = "b123456";
	//$scope.loginNewPwd = "b123456";
	//$scope.loginNewPwd2 = "b123456";
	var user_info = JSON.parse(sessionStorage.getItem("user_info"));
	$scope.changePwdValidate = function(event) {
		var reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){2,9}$/;

		if ($("#j-old-pass").val() == "") {
			alert("亲，请输入旧密码");
			return;
		} else if ($("#j-pass").val() == "" || $("#j-pass").val().length < 7 || !reg.test($("#j-pass").val())) {
			alert("亲，请输入英文开头至少7位密码");
			return;
		} else if ($("#j-pass2").val() == "" || $("#j-pass2").val().length < 7) {
			alert("亲，请重复输入至少7位密码");
			return;
		} else if ($("#j-pass").val() != $("#j-pass2").val()) {
			alert("亲，密码输入不一致，请重新输入");
			$("#j-pass2").val("");
			return;
		} else {

			apiconn.send_obj({
				"obj": "person",
				"act": "changePwd",
				"action": "old_setPwd", //通过旧密码去设置新密码
				"person_id": user_info._id, //用户ID
				"old_pwd": $scope.loginOldPwd, //旧密码
				"new_pwd": $scope.loginNewPwd //新密码
			});
		}
	};

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		if (jo.obj == "person" && jo.act == "changePwd") {

			if (jo.derr) {
				alert(jo.ustr);
			} else if (jo.status == "success") {
				alert("亲，修改密码成功！请重新登陆哦");
				apiconn.send_obj({
					"act": "logout"
				});
			}
		}
	});
}]);


/**
 * [用户注销]
 * @param  {[type]}  $scope
 * @return {[type]} 
 */
frontUser.controller('logoutCtrl', ['$scope', function($scope) {
	$scope.logout = function() {
		layer.open({
			content: '亲，您确认要退出吗?',
			btn: ['确认', '取消'],
			shadeClose: false,
			yes: function() {
				apiconn.send_obj({
					"act": "logout"
				});
			},
			no: function() {}
		});
	};

}]);


/**
 * [用户中心]
 * @param  {[type]} $scope
 * @return {[type]}      
 */
frontUser.controller('userCenterCtrl', ['$scope', function($scope) {
	// for unit test
	$scope.name = "levinke";

	$scope.initData = function(event) {
		var login_name = sessionStorage.getItem("login_name");
		if (login_name == null || login_name == "") {
			alert("亲，请登陆！");
			goto_view("login");
			return;
		} else {
			$scope.login_name = login_name;
		}
	};
	
	$scope.share = function() {
		$(".share_img").show();
	};
	
	$scope.shareHide = function() {
        $(".share_img").hide(); 
	};
	
}]);

/**
 * [用户地址管理模块]
 * @param  {[type]} $scope
 * @return {[type]}      
 */
frontUser.controller('addressCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

	//初始化加载用户地址
	$scope.initData = function(event) {
		apiconn.send_obj({
			"obj": "person",
			"act": "address_getList",
			"person_id": sessionStorage.getItem("person_id")
		});
	};

	//回填数据
	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		if (jo.obj == "person" && jo.act == "address_getList") {
			$scope.address_array = jo.address_array;
		};
	});


}]);

/**
 * [用户地址增加模块]
 * @param  {[type]} $scope
 * @return {[type]}      
 */
frontUser.controller('addressAddCtrl', ['$scope', function($scope) {

	//新增加地址 
	$scope.newAddress = function() {
			apiconn.send_obj({
				"obj": "person",
				"act": "address_add",
				"person_id": sessionStorage.getItem("person_id"),
				"name": $scope.name,
				"phone": $scope.phone,
				"address": $scope.address
			});
		}
		//响应
	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		if (jo.obj == "person" && jo.act == "address_add") {
			if (jo.derr) {
				alert(jo.ustr);
				return;
			}
			if (jo.status == "success") {
				alert("亲，地址新建成功");
				goto_view("address");
			}
		};
	});

}]);

/**
 * [用户地址更新模块]
 * @param  {[type]} $scope
 * @return {[type]}      
 */
frontUser.controller('addressUpdateCtrl', ['$scope', function($scope) {
	//初始化加载用户地址 
	$scope.initData = function(event) {
		apiconn.send_obj({
			"obj": "person",
			"act": "address_getList",
			"person_id": sessionStorage.getItem("person_id")
		});
	};
	//修改地址
	$scope.address_update = function(event, address_id, action) {

		if (action == "update") {
			var name = $("#" + address_id + " .name").val();
			var phone = $("#" + address_id + " .phone").val();
			var address = $("#" + address_id + " .address").val();

			apiconn.send_obj({
				"obj": "person",
				"act": "address_update",
				"person_id": sessionStorage.getItem("person_id"),
				"address_id": address_id,
				"name": name,
				"phone": phone,
				"address": address
			});

			apiconn.send_obj({
				"obj": "person",
				"act": "address_default",
				"person_id": sessionStorage.getItem("person_id"),
				"address_id": address_id
			});

		} else if (action == "delete") {
			if (window.confirm("确认删除这个地址？")) {
				apiconn.send_obj({
					"obj": "person",
					"act": "address_delete",
					"person_id": sessionStorage.getItem("person_id"),
					"address_id": address_id
				});

				apiconn.send_obj({
					"obj": "person",
					"act": "address_update",
					"person_id": sessionStorage.getItem("person_id"),
					"address_id": address_id,
					"name": "",
					"phone": "",
					"address": ""
				});

				apiconn.send_obj({
					"obj": "person",
					"act": "address_default",
					"person_id": sessionStorage.getItem("person_id"),
					"address_id": address_id
				});

				apiconn.send_obj({
					"obj": "person",
					"act": "address_delete",
					"person_id": sessionStorage.getItem("person_id"),
					"address_id": address_id
				});

			}
		} else {
			apiconn.send_obj({
				"obj": "person",
				"act": "address_default",
				"person_id": sessionStorage.getItem("person_id"),
				"address_id": address_id
			});
		}
	}

	//回填数据
	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

		if (jo.obj == "person" && jo.act == "address_getList") {
			$scope.address_array = jo.address_array;
		};

		if (jo.obj == "person" && jo.act == "address_update") {
			if (!jo.derr) {
				alert("亲，地址修改成功");
				apiconn.send_obj({
					"obj": "person",
					"act": "address_getList",
					"person_id": sessionStorage.getItem("person_id")
				});
			}
		};
		if (jo.obj == "person" && jo.act == "address_delete") {
			if (!jo.derr) {
				alert("亲，地址删除成功");
				apiconn.send_obj({
					"obj": "person",
					"act": "address_getList",
					"person_id": sessionStorage.getItem("person_id")
				});
			}
		};
		if (jo.obj == "person" && jo.act == "address_default") {
			if (!jo.derr) {
				alert("亲，默认地址设置成功");
				apiconn.send_obj({
					"obj": "person",
					"act": "address_getList",
					"person_id": sessionStorage.getItem("person_id")
				});
			}
		};


	});


}]);