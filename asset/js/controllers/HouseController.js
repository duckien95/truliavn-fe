app.controller('AddPostCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', function($scope, AuthService, $http, HouseService, $location){
	$scope.addHouseForm = {};
	$scope.addHouseForm.email =  AuthService.getUserEmail();
	$scope.addHouseForm.token =  AuthService.getUserToken();

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	});
	$scope.cityChange = function(){
		$http.get(AuthService.hostName + '/api/districts?city='+$scope.addHouseForm.city).then(function success(response){
			$scope.districts = response.data.districts;
		});
	};

	$scope.districtChange = function(){
		$http.get(AuthService.hostName + '/api/wards?district='+$scope.addHouseForm.district).then(function success(response){
			$scope.wards = response.data.wards;
		});
		$http.get(AuthService.hostName + '/api/streets?district='+$scope.addHouseForm.district).then(function success(response){
			$scope.streets = response.data.streets;
		});
	};

	$scope.streetChange = function(){
		$scope.address = $scope.streets[$scope.addHouseForm.street].streetName + ', ' + $scope.districts[$scope.addHouseForm.district].districtName + ', ' + $scope.cities[$scope.addHouseForm.city].cityName;
	};
	// $scope.noOfHouseChange = function(){
	// 	$scope.address = $scope.addHouseForm.noOfHouse + ', ' + $scope.address;
	// };
	$scope.addPost = function(){
		if (Object.keys($scope.addHouseForm).length < 10) {
			$scope.err = true;
			$scope.errMessage = "Xin hãy điền đầy đủ thông tin";
		}
		else{
			var fd = new FormData(document.getElementById('form-add'));
			$.ajax({
				url: AuthService.hostName + '/api/house',
				method: 'POST',
				contentType: false,
				processData: false,
				data: fd,
				success: function (data) {
					window.location.href="#!/manage-post";
					$location.path('#!/manage-post');
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	}
}]);

app.controller('EditPostCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', '$routeParams', 'API', function($scope, AuthService, $http, HouseService, $location, $routeParams, API){
	var url = API.getHouseInfo($routeParams.postId);
	$http.get(url).then(function(res){
		$scope.addHouseForm = res.data.houses[0];
		$scope.addHouseForm.email =  AuthService.getUserEmail();
		$scope.addHouseForm.token =  AuthService.getUserToken();
		$scope.addHouseForm.houseId = $routeParams.postId;
		console.log($scope.addHouseForm);
	}, function(res){
		console.log("get data fail");
	})

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	});
	//get infomation about district, ward
	$scope.cityChange = function(){
		$http.get(AuthService.hostName + '/api/districts?city='+$scope.city).then(function success(response){
			$scope.districts = response.data.districts;
		});
	}

	$scope.districtChange = function(){
		$http.get(AuthService.hostName + '/api/wards?district='+$scope.district).then(function success(response){
			$scope.wards = response.data.wards;
		});
		$http.get(AuthService.hostName + '/api/streets?district='+$scope.district).then(function success(response){
			$scope.streets = response.data.streets;
		});
	}
	$scope.streetChange = function(){
		// console.log($scope.streets[$scope.addHouseForm.street].streetName + ', ' + $scope.districts[$scope.addHouseForm.district].districtName + ', ' + $scope.cities[$scope.addHouseForm.city].cityName);
		$scope.addHouseForm.address = $scope.streets[$scope.street].streetName + ', ' + $scope.districts[$scope.district].districtName + ', ' + $scope.cities[$scope.city].cityName;
		// console.log($scope.address);
	}
	//sent request to server
	$scope.editPost = function(){
		if (Object.keys($scope.addHouseForm).length < 10) {
			$scope.err = true;
			$scope.errMessage = "Xin hãy điền đầy đủ thông tin";
		}
		else{
			$scope.disabled = true;
			var fd = new FormData(document.getElementById('form-edit'));
			$.ajax({
				url: AuthService.hostName + '/api/house/edit',
				method: 'POST',
				contentType: false,
				processData: false,
				data: fd,
				success: function (data) {
					window.location.href="#!/manage-post";
					$location.path("#!/manage-post");
				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	}
}]);


app.controller('DeleteHouseCtrl', ['$scope', 'AuthService', '$routeParams', '$http', '$cookies', '$location' , function($scope, AuthService, $routeParams, $http, $cookies, $location){
	var email = $cookies.get('user.email');
	var token = $cookies.get('user.token');
	var houseId = $routeParams;
	$http.post(AuthService.hostName +'/api/house/delete', {email: email, token: token, houseId: houseId})
		.then(function(response){
			$location.path('#!/manage-post');
		}, function(){
			console.log('xóa nhà không thành công');
			$location.path('#!/manage-post');
		});
}]);

app.controller('ForRentCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API, $cookies){
	var rentUrl = API.getForRent()+"&userId=" + $cookies.get('user.id');
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà đất cho thuê tại Việt Nam";

	$http.get(rentUrl).then(function(response){
		$scope.houses = response.data.houses;
		$scope.noOfPages = $scope.houses.length;

		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		// console.log(typeof($scope.selected));
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
		// console.log($scope.attr, $scope.reserve);
	};

}]);

app.controller('ForSellCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API, $cookies){
	var sellUrl  = API.getForSell()+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà đất bán tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('HousesForSellCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API, $cookies){
	var sellUrl  = API.getHousesForSell()+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà riêng bán tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('HousesForRentCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API, $cookies){
	var sellUrl  = API.getHousesForRent()+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà riêng cho thuê tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('ApartmentsForSellCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API, $cookies){
	var sellUrl  = API.getApartmentsForSell()+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Chung cư bán tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('ApartmentsForRentCtrl', ['$scope', '$http', 'API','$cookies', function($scope, $http, API,$cookies){
	var sellUrl  = API.getApartmentsForRent()+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Chung cư cho thuê tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('HousesNeedBuyCtrl', ['$scope', '$http', 'AuthService','$cookies', function($scope, $http, AuthService, $cookies){
	var buyUrl  = AuthService.hostName + '/api/houses?housefor=needbuy&raw=1&specific=1'+"&userId=" + $cookies.get('user.id');
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà riêng bán tại Việt Nam";

	$http.get(buyUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);

app.controller('HousesNeedRentCtrl', ['$scope', '$http','AuthService', function($scope, $http, AuthService){
	var sellUrl  = AuthService.hostName + '/api/houses?housefor=needrent&raw=1&specific=1';
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 15;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà riêng cho thuê tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
	};
}]);
