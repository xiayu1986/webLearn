/**
 * Created by Administrator on 2015/8/9.
 */
/*入口*/
var pageApp = angular.module('pageApp', ['ui.bootstrap']);

pageApp.controller('accordionNgCtrl',function($scope){
	$scope.onAtTime=true;
	$scope.groups=[{title:"第一章节",content:"第一章节内容"},{title:"第二章节",content:"第二章节内容"}];
	$scope.items=["项目一","项目二","项目三"];
	$scope.addItem=function () {
		var newItemNo=$scope.items.length+1;
		$scope.items.push("项目"+newItemNo);
	}
	$scope.status = {
		isFirstOpen: true,
		isFirstDisabled: false
	};
})