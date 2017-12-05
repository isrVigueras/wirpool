app.service("cuentaservice",['$http', '$q', function($http, $q){
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/cuentas/getPagina/1").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.guardarCuenta=function(cuenta){
		var d = $q.defer();
		$http.post("/cuentas/guardar/",cuenta).then(
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
	this.eliminarCuenta = function(send) {
		var d = $q.defer();
		$http.post("/cuentas/borrar/",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	
//	this.getPaginas = function(page) {
//		var d = $q.defer();
//	
//		$http.get("/cuentas/getPagina/1").then(
//			function(response) {
//				d.resolve(response.data);
//			});
//		return d.promise;
//	}
	
}]);
//app.service("xservice",['$http', '$q', function($http, $q){
//	
//}]);

app.controller("cuentaController",['$scope','$window', '$location', '$cookieStore','cuentaservice', function($scope, $window, $location, $cookieStore, cuentaservice){
	cuentaservice.load().then(function(data) {
		$scope.cuentas = data;

})
//	$scope.paginaActual=1;
//	$scope.llenarPags=function(){
//		var inicio=0;
//		if($scope.paginaActual>5){
//			inicio=$scope.paginaActual-5;
//		}
//		var fin = inicio+9;
//		if(fin>$scope.maxPage){
//			fin=$scope.maxPage;
//		}
//		$scope.paginas=[];
//		for(var i = inicio; i< fin; i++){
//			$scope.paginas.push(i+1);
//		}
//		for(var i = inicio; i<= fin; i++){
//			$('#pagA'+i).removeClass("active");
//			$('#pagB'+i).removeClass("active");
//		}
//		$('#pagA'+$scope.paginaActual).addClass("active");
//		$('#pagB'+$scope.paginaActual).addClass("active");
//	}
//
//	cuentaservice.getPaginas($cookieStore.get("rfcEmpresa")).then(function(data){
//		$scope.maxPage=data;
//		$scope.llenarPags();
//	});
//	
//	$scope.cargarPagina=function(pag){
//		if($scope.paginaActual!=pag){
//			$scope.paginaActual=pag;
//			$scope.cargarFacturas(pag);
//		}
//	}
	$scope.guardarCuenta= function(){
		cuentaservice.guardarCuenta($scope.cuenta).then(function(data){
			alert("Cuenta Guardado Con Exito");
			$location.path("/cuentas");
			$window.location.reload();
		});
		
	}
	
	$scope.eliminar = function(cuenta){
		
		cuentaservice.eliminarCuenta(cuenta).then(function(send) {	
				alert("Cuenta Eliminada");
				$location.path("/cuentas");
				$window.location.reload();
			}) 
			
		 
		  
		
	};
//	$scope.cargarPagina(1);
	
}]);
