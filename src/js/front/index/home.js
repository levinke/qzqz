/**
 * [frontIndex 前台主页模块]
 * @type {[type]}
 */
var frontHome = angular.module('frontHome',[]);
	console.log(window.JSON);

frontHome.controller('homeCtrl', ['$scope', function($scope){
	$scope.init	 = function(){
		$("#status").fadeOut();
		$("#preloader").delay(350).fadeOut("slow");
	};
	
	$scope.shaixuanclose = function() {
		$("body,html").css("overflow", "auto");
		$(".shaixuan_box").animate({
			right: '-100%'
		});
		$(".shaixuan_box").hide(5);
		$("body").unbind("touchmove");
	};
}]);

frontHome.controller('positionCtrl', ['$scope', function($scope){
	
	$scope.position_goto = function(event){
 		goto_view("position");
	};

	// for unit test
	$scope.name = "levinke";
	$scope.position = "福州市";

	//$scope.positionList = {"福州市","厦门市","三明市","漳州市","泉州市"};
	// $scope.choosePosition = function(index){
	// 	$scope.position = positionList[index];
	// }
	
	$scope.shaixuan = function() {
		$(".shaixuan_box").show();
		$(".shaixuan_box").animate({
			right: '100%'
		});
		$("body,html").css("overflow", "hidden");
		$(".shaixuan_box").css("overflow", "auto");
		$('body').bind("touchmove", function(e) {
			e.preventDefault();
		});
	};

}]);

frontHome.controller('activityCtrl', ['$scope', function($scope){
	
	$scope.init	 = function(){
		apiconn.send_obj({
	          "obj":"activity",
			  "act":"getlist"
        });
	};
	
	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
    	if (jo.obj == "activity" && jo.act == "getlist") {
    		//mdb()->get_collection("activity")->find()
    		//console.log(JSON.stringify(jo));
			for (var item in jo.activity_list) {
				$scope.activity_list = jo.activity_list[item];
			}
			console.log($scope.activity_list);
			//$scope.activity_list = jo.activity_list;
		}
    	
  	});
	
	
}]);

frontHome.controller('introduceCtrl', ['$scope', function($scope){
	
	$scope.init	 = function(){
		apiconn.send_obj({
	          "obj":"introduce",
			  "act":"getlist"
        });
	};
	
	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
    	if (jo.obj == "introduce" && jo.act == "getlist") {
    		//mdb()->get_collection("activity")->find()
    		//console.log(JSON.stringify(jo));
			for (var item in jo.introduce_list) {
				$scope.introduce_list = jo.introduce_list[item];
			}
			console.log($scope.introduce_list);
			//$scope.activity_list = jo.activity_list;
		}
    	
  	});
	
	
}]);

