stockApp.controller('login_ctrl',['$scope','$http','$location',function($scope,$http,$location){
	$scope.login = function(){
 	  $http.post("/login", {userName:$scope.email, password: $scope.password}).success(function(response){
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
                 
            	$location.path("/AdminDashboard");
            }
	});
 	}
}])