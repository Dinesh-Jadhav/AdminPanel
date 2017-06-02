'use strict';
var stockApp = angular.module('stockApp', ['ngRoute']);
	
stockApp.config(['$routeProvider',function($routeProvider){
//admin login
	$routeProvider
    .when('/admin-login',{
    templateUrl:'/js/html/admin/login.html',
    controller:'login_ctrl',
      }).when('/AdminDashboard',{
    templateUrl:'/js/html/admin/dashboard.html',
    controller:'',
    activetab:'dashboard'
    }).when('/teams',{
    templateUrl:'/js/html/team/teams.html',
    controller:'',
    activetab:'Competition'
    }).when('/add_competition',{
    templateUrl:'/js/html/competition/add_compitation.html',
    controller:'competition_add',
    activetab:'ticker'
    }).when('/competition_list',{                           
    templateUrl:'/js/html/competition/compitition.html',
    controller:'listcompetition_competition'
    }).otherwise({redirectTo:'/'});
}]);

stockApp.controller('headerController', function($scope, $route) {
    $scope.$route = $route;
});


/*stockApp = angular.module('stockApp', ['stockApp.controllers','datatables']);
  
  angular.module('stockApp.controllers', []).controller('testController', function($scope,DTOptionsBuilder, DTColumnBuilder, $compile) {
  });*/