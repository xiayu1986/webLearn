/**
 * Created by Administrator on 2015/8/9.
 */
var routerApp=angular.module("routerApp",['ui.router']);
routerApp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider.state("index",{
        url:"/index",
        views:{
            "":{templateUrl:"template/index.html"},
            "top@index":{templateUrl:"template/top.html"},
            "main@index":{templateUrl:"template/main.html"}
        }
    })
});

var routerListApp=angular.module("routerList",['ui.router']);
routerListApp.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise("/state1");
	$stateProvider.state("state1",{
		url:"/state1",
		templateUrl:"template/state1.html"
	})
	.state("state1.list",{
		url:"/list",
		templateUrl:"template/state1.list.html",
		controller:function($scope){
			$scope.items=["百度", "新浪", "腾讯", "阿里巴巴"]
		}
	})
	.state("state2",{
		url:"/state2",
		templateUrl:"template/state2.html"
	})
	.state("state2.list",{
		url:"/list",
		templateUrl:"template/state2.list.html",
		controller:function($scope){
			$scope.FS=["谷歌","苹果","FaceBook","ebay"]
		}
	})
})