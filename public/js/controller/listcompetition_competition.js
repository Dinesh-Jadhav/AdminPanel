stockApp.controller('listcompetition_competition',['$scope','$location','$http',function($scope,$location,$http){
$scope.items = [];
$http.get('/competitions').success(function(response){
            if (response.error) 
            {
            	$scope.noError = false;	
            	$scope.ErrorMessage = response.error;
            }
            else
            {
              $scope.items = response;      
            }
           });
}]);