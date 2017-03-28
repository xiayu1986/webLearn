/**
 * Created by Administrator on 2015/8/9.
 */

var collectMessage=angular.module("collectMessage",[]);
collectMessage.controller("collectMessageCtrl",["$scope",function($scope){
	$scope.message={
		email:"xiayu_lt@126.com",
		password:"1234567",
		login:true
	}
	$scope.getMessage=function(){
		console.log($scope.message);
	}
	$scope.setMessage=function(){
		$scope.message={
			email:"xiayu_lt@163.com",
			password:"000000",
			login:false
	    }
	}
	$scope.resetMessage=function(){
		$scope.message={
			email:"",
			password:"",
			login:false
		}
	}
}])