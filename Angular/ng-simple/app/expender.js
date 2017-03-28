/**
 * Created by Administrator on 2015/8/9.
 */
/*入口*/
var pageApp = angular.module('pageApp', []);

/*expender*/

pageApp.directive("expender",function(){
	return {
		restrict:"AEC",
		transclude:true,
		replace:true,
		scope:{
			title:"=expenderTitle"
		},
		template:'<div class="panel panel-primary"><div class="panel-heading" ng-click="toggle()"><div class="panel-title">{{title}}</div></div>\
				<div class="panel-body" ng-show="display" ng-transclude></div></div>',
		link:function(scope,element,attrs){
			scope.display=false;
			scope.toggle=function(){
				scope.display=!scope.display
			}
		}
	}
});



pageApp.controller('expenderCtrl',function($scope){
	$scope.title="折叠组件";
	$scope.content="折叠区内容";
})