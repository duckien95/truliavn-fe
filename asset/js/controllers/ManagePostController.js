app.controller('ManagePostCtrl', ['$scope', 'API', '$cookies', '$http','HouseService','$location','$uibModal', function($scope, API, $cookies, $http, HouseService, $location, $uibModal){
	var urlPost = API.getUserPost($cookies.get('user.id'));
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	$http.get(urlPost).then(function(res){
		$scope.houses = res.data.houses;
		$scope.noOfPost = $scope.houses.length;
		$scope.numberOfPages = function(){
			return Math.ceil($scope.houses.length/$scope.pageSize); 
		};
	});

	$scope.deleteHouse = function(id){
		HouseService.deleteHouse($cookies.get('user.email'), $cookies.get('user.token'), id)
		.then(function(){
			$location.path('/manage-post');
		}, function(){
			$location.path('/manage-post');
		});
	};

	  $scope.animationsEnabled = true;

	  $scope.open = function(id) {
	  	console.log(id);
	  	$cookies.put('houseManage.id', id);
	    var modalInstance = $uibModal.open({
	      	animation: $scope.animationsEnabled,
	      	templateUrl: 'myModalContent.html',
	      	controller: 'ModalInstanceCtrl'
	    });
	};
}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $cookies, HouseService, $location) {

  $scope.deleteHouse = function(){
  	console.log($cookies.get('houseManage.id'));
		HouseService.deleteHouse($cookies.get('user.email'), $cookies.get('user.token'), $cookies.get('houseManage.id'))
		.then(function(){
			$cookies.remove('houseManage.id')
			$location.path('/manage-post');
		}, function(){
			alert("Xóa nhà không thành công");
			$location.path('/manage-post');
		});
	};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('ManageLikedPostCtrl', ['$scope', 'AuthService', '$http', function ($scope, AuthService, $http) {
	var likedForm = {};
	likedForm.email = AuthService.getUserEmail();
	likedForm.token = AuthService.getUserToken();
	var urlPost = AuthService.hostName + "/api/liked";
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	$http.post(urlPost, likedForm).then(function(res){
		$scope.houses = res.data.houses;
		$scope.noOfPost = $scope.houses.length;
		$scope.numberOfPages = function(){
			return Math.ceil($scope.houses.length/$scope.pageSize); 
		};
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	}, function(err){
		console.log(err);
	});
}]);