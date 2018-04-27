function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function(){ window.location.reload(); }, 3000);
}

app.service("movService",['$http', '$q', function($http, $q){
	
	
}]);

app.controller("movController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'movService',function($rootScope, $scope, $cookieStore, $window, $location, movService){
	
	
	
}]);


	
