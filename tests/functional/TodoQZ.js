define([
	'intern!object',
	'intern/chai!assert',
	'require',
	'intern/dojo/node!leadfoot/Command',
], function(registerSuite, assert, require, Command) {
	var url = '../../src/tpls/index.html';
	var urls = '../../src/tpls/index.html#/admin/MainView';
	var USERNAME = "13067235235";
	var PASSWORD = "ysys556";
	var USERTEL = "15280696120";

	function topScroll() {
		document.body.scrollTop = 500;
		console.log(500);
	}

	registerSuite({
		name: 'TodoQZ (functional)',
		'enterServerArea': function() {
			console.log("服务范围");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterServerArea();
		},
		'enterSelect': function() {
			console.log("筛选");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterSelect();
		},
		'enterIntroduce': function() {
			console.log("每日推荐界面");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterIntroduce();
		},
		'enterGame': function() {
			console.log("游戏界面");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterGame();
		},
		'enterActivity': function() {
			console.log("亲子活动界面");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterActivity();
		},
		'enterQuestion': function() {
			console.log("常见问题");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterQuestion();
		},
		'enterOrderQuestion': function() {
			console.log("下单須知");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterOrderQuestion();
		},
		'login and loginOut': function() {
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterLogin()
				.enterLoginOut();
		},
		'shopping need register or login': function() {
			console.log("商品筛选");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterSelectShop();
		},
		'register': function() {
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterRegister();
		},
		'login and shopping': function() {
			console.log("购物流程...");
			return this.remote
				.get(require.toUrl(url)).setFindTimeout(5000).end()
				.enterLoginNo()
				.enterShopping()
				.enterLoginOut();
		},

	});

	Command.prototype.enterServerArea = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(5000)
				.findByClassName('cityName').click().end()
				.sleep(5000)
				.findByClassName('modh_return').click().end()
		});
	};

	Command.prototype.enterSelect = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(5000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByClassName('shaixuan_colos').click().end()
		});
	};

	Command.prototype.enterSelectShop = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(5000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByXpath('//a[@href="#/goods/water/medicines"]').click().end()
				.sleep(5000)
				.findByClassName('prod_car').click().end()
		});
	};

	Command.prototype.enterIntroduce = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(5000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByXpath('//a[@href="#/introduce"]').click().end()
				.sleep(5000)
				.goBack()
		});
	};

	Command.prototype.enterGame = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(3000)
				.findByClassName('header_right').click().end()
				.sleep(3000)
				.findByXpath('//a[@href="http://114.215.241.76/vinke/index_birthday/index.html"]').click().end()
				.sleep(5000)
				.findById('friendName').click().end()
				.sleep(3000)
				.pressKeys(USERNAME)
				.sleep(1000)
				.findById('send').click().end()
				.sleep(3000)
				.goBack()
		});
	};

	Command.prototype.enterActivity = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(3000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByXpath('//a[@href="#/activity"]').click().end()
				.sleep(5000)
				.goBack()
		});
	};

	Command.prototype.enterQuestion = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(3000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByXpath('//a[@href="#/eq"]').click().end()
				.sleep(5000)
				.goBack()
		});
	};

	Command.prototype.enterOrderQuestion = function() {
		return new this.constructor(this, function() {
			
			return this.parent
				.sleep(3000)
				.findByClassName('header_right').click().end()
				.sleep(5000)
				.findByXpath('//a[@href="#/order_eq"]').click().end()
				.sleep(5000)
				.goBack()
		});
	};

	Command.prototype.enterLogin = function() {
		return new this.constructor(this, function() {
			console.log("登录");
			return this.parent
				.sleep(3000)
				.findByClassName('card-index').click().end()
				.sleep(3000)
				.findById('name').click().end()
				.sleep(1000)
				.pressKeys(USERNAME)
				.findById('pass').click().end()
				.sleep(1000)
				.pressKeys(PASSWORD)
				.findByClassName('lg_btn_sub').click().end()
				.sleep(3000)
		});
	};
	
	Command.prototype.enterLoginNo = function() {
		return new this.constructor(this, function() {
			console.log("登录");
			return this.parent
				.sleep(5000)
				.findByClassName('card-index').click().end()
				.sleep(3000)
				.findByClassName('lg_btn_sub').click().end()
				.sleep(3000)
		});
	};

	Command.prototype.enterLoginOut = function() {
		return new this.constructor(this, function() {
			console.log("注销");
			return this.parent
				.findByClassName('card-index').click().end()
				.sleep(3000)
				.findByClassName('lg_btn_sub').click().end()
				.sleep(2000)
				.findByXpath('//span[@type="1"]').click().end()
		});
	};

	Command.prototype.enterShopping = function() {
		return new this.constructor(this, function() {
			console.log("下单");
			return this.parent
				.sleep(3000)
				.findByXpath('//img[@src="../img/medicines.png"]').click().end()
				.sleep(3000)
				.findByClassName('prod_car').click().end()
				.sleep(3000)
				.findByClassName('Order-index').click().end()
				.sleep(3000)
				.findByCssSelector('.add').click().end()
				.sleep(1000)
				.findByClassName('car_okbtn').click().end()
				.sleep(3000)
				.findByClassName('mpladd_pay_btn').click().end()
				.sleep(1000)
				.findByXpath('//span[@type="1"]').click().end()
				.sleep(3000)
		});
	};

	Command.prototype.enterRegister = function() {
		return new this.constructor(this, function() {
			console.log("注册");
			return this.parent
				.sleep(5000)
				.findByClassName('card-index').click().end()
				.sleep(3000)
				.findById('register').click().end()
				.sleep(3000)
				.findById('j-tel').click().end()
				.sleep(1000)
				.pressKeys(USERTEL)
				.findById('j-pass').click().end()
				.sleep(1000)
				.pressKeys(PASSWORD)
				.findById('j-pass2').click().end()
				.sleep(1000)
				.pressKeys(PASSWORD)
				.sleep(8000)
				.findById('j-submit').click().end()
				.sleep(3000)
		});
	};


});