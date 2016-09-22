var listApp=angular.module("listApp",['ui.router','ngGrid','BookListModule','BookDetailModule']);
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
    }).state('booklist',{
        url:'bookType:[0-9]{1,4}',
        views:{
            '':{
                templateUrl:'template/bookList.html'
            },
            'bookType@booklist':{
                templateUrl:'template/bookType.html'
            },
            'bookgrid@booklist':{
                templateUrl:'template/bookGrid.html'
            }
        }
    }).state('addbook', {
            url: '/addbook',
            templateUrl: 'template/addBookForm.html'
    }).state('bookdetail', {
            url: '/bookdetail/:bookId', //注意这里在路由中传参数的方式
            templateUrl: 'template/bookDetail.html'
    })
})