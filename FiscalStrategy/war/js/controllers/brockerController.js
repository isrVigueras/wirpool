app.service("brockerservice",['$http', '$q', function($http, $q){
	this.guardarBrocker=function(send){
		var d = $q.defer();
		$http.post("/brockers/guardar/",send).then(
			function(response) {
				console.log(response);
				d.resolve(response.data);
			}, function(response) {
				if(response.status==403){
					alert("No está autorizado para realizar esta acción");
					$location.path("/");
				}
			});
		return d.promise;
	}
	this.consultarBrockersTodos = function() {
		var d = $q.defer();
		$http.get("/brockers/getPagina/1").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	this.getcc = function(id) {
		var d = $q.defer();
		$http.get("/cuentasCliente/todas/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	};
	
}]);


app.controller("brockersController",['$scope','$window', '$location', '$cookieStore','brockerservice', function($scope, $window, $location, $cookieStore, brockerservice){
	brockerservice.consultarBrockersTodos().then(function(data) {
		$scope.brockerLista = data;

});
	$scope.guardaBrocker= function(){
		$scope.brocker.tipo="brocker";
		$scope.brocker.enabled=true;
		brockerservice.guardarBrocker($scope.brocker).then(function(data){
			alert("Brocker Guardado Con Exito");
			$location.path("/");
//			$window.location.reload(1);
			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	};
	$scope.ver = function(data) {
		$scope.bk=data;
	    var length = $scope.bk.length;
	    brockerservice.getcc($scope.bk.id).then(function(data) {
	  		$scope.ccuenta = data;
	  });
	    for ( i=0; i < length; i++) {  
	      alert($scope.datosComp[i].nom_coe);
	      
	    };
	}
	$scope.rc=false;
	$scope.ca=true;
	$scope.btn=true;
	 $scope.hide=function () {
		 $scope.btn=false;   
     	$scope.rc=true;
     	$scope.ca=false;
	
 };
 $scope.btnCancelar=function () {
	 $scope.btn=true;   
 	$scope.rc=false;
 	$scope.ca=true;
 	

};
}]);
