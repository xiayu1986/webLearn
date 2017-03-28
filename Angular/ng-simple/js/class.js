/**
 * Created by Administrator on 2015/8/9.
 */

var changeButton=angular.module("changeButton",[]);
changeButton.controller("changeButtonClassCtrl",["$scope",function($scope){
	$scope.setDefault=function(){
		$scope.color="btn-default"
	}
	$scope.setGreen=function(){
		$scope.btn="btn-success"
	}
}])