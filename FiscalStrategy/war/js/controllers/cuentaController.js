app.service("cuentaservice",['$http', '$q', function($http, $q){
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/cuentas/getPagina/"+page).then(
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
					alert("No est� autorizado para realizar esta acci�n");
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
	this.getByBanco = function(banco) {
		var d = $q.defer();
		$http.get("/cuentas/getTipo/"+banco).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginas = function() {
		var d = $q.defer();
	
		$http.get("/cuentas/getNumPages").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	} 
	
}]);
//app.service("xservice",['$http', '$q', function($http, $q){
//	
//}]);

app.controller("cuentaController",['$rootScope','$scope','$window', '$location', '$cookieStore','cuentaservice','userFactory','$rootScope', function($rootScope,$scope, $window, $location, $cookieStore, cuentaservice,userFactory,$rootScope){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	$scope.bancos = catalogoBancos();

//	$scope.paginaActual=1;
	$scope.llenarPags=function(){
		var inicio=0;
		if($scope.paginaActual>5){
			inicio=$scope.paginaActual-5;
		}
		var fin = inicio+9;
		if(fin>$scope.maxPage){
			fin=$scope.maxPage;
		}
		$scope.paginas=[];
		for(var i = inicio; i< fin; i++){
			$scope.paginas.push(i+1);
		}
		for(var i = inicio; i<= fin; i++){
			$('#pagA'+i).removeClass("active");
			$('#pagB'+i).removeClass("active");
		}
		$('#pagA'+$scope.paginaActual).addClass("active");
		$('#pagB'+$scope.paginaActual).addClass("active");
	}

	cuentaservice.getPaginas().then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
//	
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			cuentaservice.load(pag).then(function(data) {
				$scope.cuentas = data;
				$scope.llenarPags();
			})
		}
	}
	$scope.guardarCuenta= function(){
		cuentaservice.guardarCuenta($scope.cuenta).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.cuenta){window.location="#/cuentas";} }, 3000);
//			alert("Cuenta Guardado Con Exito");
//			$location.path("/cuentas");
//			$window.location.reload("/cuentas");
		});
		
	}
	
	$scope.eliminar = function(cuenta){
		$('#mdsino').modal('show');
		$("#btnsi").on("click", function(){
		 
			console.log(cuenta);
			cuentaservice.eliminarCuenta(cuenta).then(function(send) {	
				alert("Cuenta Eliminada");
				$location.path("/cuentas");
				$window.location.reload();
			}) 
				
			  
		    
		  });
		$("#btnno").on("click", function(){
			$("#mdsino").modal('hide');
		});
//		cuentaservice.eliminarCuenta(cuenta).then(function(send) {	
//				alert("Cuenta Eliminada");
//				$location.path("/cuentas");
//				$window.location.reload();
//			}) 
			
		 
		  
		
	};
	
	$scope.cargarPagina(1);
	
}]);