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
	this.consultarClientesTodos = function() {
		var d = $q.defer();
		$http.get("/clientes/getPagina/1").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
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
	this.consultarPagos = function() {
		var d = $q.defer();
		$http.get("URL/CHIDA").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	}
	
	this.getcc = function(id) {
		var d = $q.defer();
		$http.get("/cuentasCliente/todas/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);


app.controller("pagosAddController",['$scope','$cookieStore', '$window', '$location', 'pagosService', function($scope, $cookieStore, $window, $location, pagosService){
	$scope.pago={
			moneda:"MXN"
	}
	
	pagosService.consultarClientesTodos().then(function(data) {
		$scope.cliente = data;

});
	
		
		
	$scope.guardaPago= function(id){
		var pagos=[];
		
		pagos.push($scope.pago);
		pagosService.guardarPagos({pagos:pagos}).then(function(data){
			alert("Pago Guardado con éxito");
			$location.path("/listaOTs");
			$window.location.reload();
		});
		
	}
	
	$scope.procesar=function(){
		pagosService.procesarPagos($scope.datos, $scope.tipo, $scope.cuenta).then(function(data){
			alert("Pagos Guardados");
			$location.path("/listaOTs");
			$window.location.reload();
		});
		
	};
	
	$scope.ver = function(data) {
		
	   
	    pagosService.getcc($scope.pago.id_cliente).then(function(data) {
	    	console.log(data);
	    	$scope.ccuenta = data;
	  });
	    
	};
	
	
	$scope.pago.fecha = new Date();
	
}]);