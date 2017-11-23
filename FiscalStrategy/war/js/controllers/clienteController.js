app.service("clientservice",['$http', '$q', function($http, $q){
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
	this.guardarCliente=function(send){
		var d = $q.defer();
		$http.post("/clientes/guardar/",send).then(
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
	
	this.eliminaCliente = function(send) {
		var d = $q.defer();
		$http.post("/clientes/borrar/",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	
}]);

app.service("clientcuentaservice",['$http', '$q', function($http, $q){
	this.guardarCuentaCliente=function(send){
		var d = $q.defer();
		$http.post("/cuentasCliente/guardar/",send).then(
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
app.controller("clientcuentacontroller",['$scope','$window', '$location', '$cookieStore','clientcuentaservice', function($scope, $window, $location, $cookieStore, clientcuentaservice){
	$scope.guardaClienteCuenta= function(id){
		var send={
				id: id,
				
		}
		console.log(send);
		clientcuentaservice.guardarCuentaCliente($scope.ccuenta).then(function(data){
			alert("Cuenta Guardada Con Exito");
			$location.path("/clientes");
//			$window.location.reload();
			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	}
	
}]);

app.controller("clientController",['$scope','$window', '$location', '$cookieStore','clientservice', function($scope, $window, $location, $cookieStore, clientservice){
	clientservice.consultarClientesTodos().then(function(data) {
			$scope.clienteLista = data;
	
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
//	clientservice.getPaginas($cookieStore.get("rfcEmpresa")).then(function(data){
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

	$scope.guardaCliente= function(){
		
		$scope.client.enabled=true;
		clientservice.guardarCliente($scope.client).then(function(data){
			alert("Cliente Guardado Con Exito");
			$location.path("/clientes");
//			$window.location.reload(1);
			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	}
	$scope.eliminar = function(cliente){
		
		console.log(cliente);
		clientservice.eliminaCliente(cliente).then(function(send) {	
			alert("Cliente Eliminado");
			$location.path("/clientes");
			$window.location.reload();
		})
	}
//	$scope.cargarPagina(1);
	
}]);
