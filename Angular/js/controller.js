
/*手机列表*/
angular.module("phoneList",[]).controller("phoneCtrl",function($scope){
  console.log($scope);
  $scope.phones=[
  {"name":"苹果","snippet":"高端奢侈手机"},
  {"name":"三星","snippet":"低性价比"}
  ]
})

/*省市区*/
angular.module("areaList",[]).controller("areaCtrl",function($scope){
$scope.areas=[
    {
      display: "北京",
      data: "|北京|1"
    },
    {
      display: "广州",
      data: "|广州|32"
    },
    {
      display: "深圳",
      data: "|深圳|30"
    },
    {
      display: "上海",
      data: "|上海|2"
    },
    {
      display: "成都",
      data: "|成都|28"
    },
    {
      display: "武汉",
      data: "|武汉|477"
    }
]
})

/*航班列表*/
angular.module("flightList",[]).controller("flightCtrl",function($scope,$filter){
  $scope.flights=[
        {"airPort":"HKG","takeOff":"08:00","cityName":"香港"},
        {"airPort":"BJS","takeOff":"09:00","cityName":"北京"},
        {"airPort":"BJS","takeOff":"10:00","cityName":"北京"},
        {"airPort":"BJS","takeOff":"06:00","cityName":"北京"},
        {"airPort":"SHA","takeOff":"02:00","cityName":"上海"},
        {"airPort":"SHA","takeOff":"12:30","cityName":"上海"}
  ]
  $scope.orderProp="takeOff";
})

/*获取学生信息*/
angular.module("messageList",[]).controller("messageCtrl",function($scope,$http){
   $http.get("http://localhost/angular/json.php")
    .success(function (response) {$scope.names = response.records;})
})