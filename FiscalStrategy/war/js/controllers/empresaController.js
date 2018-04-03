app.service("empresaservice",['$http', '$q', function($http, $q){
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/empresa/consultar/"+ page).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.guardarEmpresa=function(cuenta){
		var d = $q.defer();
		$http.post("/empresa/guardar/",cuenta).then(
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
	this.eliminarEmpresa = function(send) {
		var d = $q.defer();
		$http.post("/empresa/eliminar",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	
	this.getPaginas = function() {
		var d = $q.defer();
	
		$http.get("/empresa/numPages").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	} 
	
}]);

app.controller("empresacontroller",['$rootScope','$scope','$window', '$location', '$cookieStore','empresaservice','userFactory','$rootScope', function($rootScope,$scope, $window, $location, $cookieStore, empresaservice,userFactory,$rootScope){
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

	empresaservice.getPaginas().then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
//	
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			empresaservice.load(pag).then(function(data) {
				$scope.empresa = data;
				$scope.llenarPags();
			})
		}
	}
	
	$scope.eliminar = function(cuenta){
		$('#mdsino').modal('show');
		$("#btnsi").on("click", function(){
		 
			console.log(cuenta);
			empresaservice.eliminarEmpresa(cuenta).then(function(data) {	
				alert("Empresa Eliminada");
				$location.path("/listempresa");
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

app.controller("altaempresacontroller",['$rootScope','$scope','$window', '$location', '$cookieStore','empresaservice','userFactory','$rootScope', function($rootScope,$scope, $window, $location, $cookieStore, empresaservice,userFactory,$rootScope){
	
	$scope.guardarEmpresa= function(){
		empresaservice.guardarEmpresa($scope.empresa).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
//			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
//		    setTimeout(function(){ if($scope.cuenta){window.location="#/listempresa";} }, 3000);
			alert("Empresa Guardada Con Exito");
			$location.path("/listempresa");
			$window.location.reload("/listempresa");
		});
		
	}
}]);