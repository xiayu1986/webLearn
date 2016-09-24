/**
 * Created by Administrator on 2015/5/6.
 */
var app=angular.module("app",[]);
app.controller("myTodoCtrl", function($scope) {
    $scope.message = "";
    $scope.left  = function() {return 100 - $scope.message.length;};
    $scope.clear = function() {$scope.message="";};
    $scope.save  = function() {$scope.message="";};
});