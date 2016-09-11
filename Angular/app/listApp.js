//var listApp=angular.module("listApp",['ui.router','ngGrid','listModule','detailModule']);
var listApp=angular.module("listApp",['ui.router','ngGrid'/*,'listModule','detailModule'*/]);
listApp.run(function ($rootScope,$state,$stateParams) {
    $rootScope.$state=$state;
    $rootScope.$stateParams=$stateParams;
})

listApp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/listIndex");
    $stateProvider.state('listIndex',{
        url:'/listIndex',
        views:{
            '':{templateUrl:'template/home.html'},
            'main@listIndex':{templateUrl:'template/login.html'}
        }
    })
})