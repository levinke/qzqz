/*global angular*/

define([
  'intern/chai!expect',
  'intern!bdd',
  //'intern/order!angular/jquery',
  'intern/order!angular/angular',
  'intern/order!todoqz/framework/angular-route.min',
  'intern/order!angular-mocks/angular-mocks',
  'intern/order!todoqz/js/common/jquery-1.8.2.min',
  'intern/order!todoqz/js/common/jscommon',
  'intern/order!todoqz/js/common/Swipe.js',
  'intern/order!todoqz/js/common/layer.m',
  'intern/order!todoqz/framework/APIConnection.min',
  'intern/order!todoqz/js/front/app',
  //'intern/order!todoqz/js/front/index/home'
  'intern/order!todoqz/js/front/user/userModule'
], function (expect, bdd) {

  function inject (fn) {
    return function() {
      angular.injector(['ng', 'ngMock', 'QZSDApp']).invoke(fn);
      console.log("test");
    }
  }

  bdd.describe('QZ introduceCtrl Controller', function () {

    var ctrl, scope;

    bdd.beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('introduceCtrl', { $scope: scope });
    }));

    bdd.it('position is fuzhou', function () {
      expect(scope.name).to.equal('levinke');
    });



  });
});
