/**
 * Created by Administrator on 2015/8/9.
 */
/*入口*/
var pageApp = angular.module('pageApp', []);

/*accordion*/
pageApp.directive("accordion",function(){
	return {
		restrict : 'AEC',
		replace : true,
		transclude : true,
		template : '<div ng-transclude></div>',
		controller : function() {
			var expanders = [];
			this.getOpened = function(selectedExpander) {
				angular.forEach(expanders, function(expander) {
					if (selectedExpander != expander) {
						expander.display = false;
					}
				});
			}
			this.addExpander = function(expander) {
				expanders.push(expander);
			}
		}
	}
})

/*expender*/

pageApp.directive("expander",function(){
	return {
		restrict:"AEC",
		transclude:true,
		replace:true,
		require:"^?accordion",
		scope:{
			title:"=expenderTitle"
		},
		template:'<div class="panel panel-primary"><div class="panel-heading" ng-click="toggle()"><div class="panel-title">{{title}}</div></div>\
				<div class="panel-body" ng-show="display" ng-transclude></div></div>',
		link:function(scope,element,attrs,accordionController){
			scope.display=false;
			accordionController.addExpander(scope);
			scope.toggle=function(){
				scope.display=!scope.display;
				accordionController.getOpened(scope);
			}
		}
	}
});



pageApp.controller('accordionCtrl',function($scope){
	$scope.expanders=[
	{title:"第一章",content:"第一章内容"},
	{title:"第二章",content:"第二章内容"},
	{title:"第三章",content:"第三章内容"}
	]
})