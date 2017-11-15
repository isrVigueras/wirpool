app.service("pagosService",['$http',"$q",function($http,$q){
	this.guardarPagos=function(pagos){
		var d = $q.defer();
		$http.post("/pagos/save/",pagos).then(
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
	
	this.generarPagos=function(pagos){
		var d = $q.defer();
		$http.post("/pagos/generar/",pagos).then(
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
	
	this.procesarPagos=function(datos,tipo,cuenta){
		var d = $q.defer();
		var send={
			datos:datos,
			tipo:tipo,
			cuenta:cuenta
		};
		$http.post("/pagos/procesarMultiple/",send).then(
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
	
}]);

app.controller("pagosAddController",['$scope','$cookieStore', '$window', '$location', 'pagosService', function($scope, $cookieStore, $window, $location, pagosService){
	$scope.pago={
			moneda:"MXN"
	}
	$scope.guardaPago= function(){
		var pagos=[];
		pagos.push($scope.pago);
		pagosService.guardarPagos({pagos:pagos}).then(function(data){
			alert("Pago Guardado con éxito");
			$location("listPagos");
			$window.location.reload();
		});
		
	}
	
	$scope.procesar=function(){
		pagosService.procesarPagos($scope.datos, $scope.tipo, $scope.cuenta).then(function(data){
			alert("Pagos Guardados");
			location("/listaOTs");
			$window.location.reload();
		});
		
	}
}]);