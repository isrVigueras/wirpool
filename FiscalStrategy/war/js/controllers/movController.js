function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function(){ window.location.reload(); }, 3000);
}

app.service("movService",['$http', '$q', function($http, $q){
	this.loadResguardos = function(id) {
		var d = $q.defer();
		$http.get("/movimientos/getResguardos/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.loadCA  = function(id) {
		var d = $q.defer();
		$http.get("/ots/loadCA/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/movimientos/getPages/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.load = function(page) {
		var d = $q.defer();
		$http.get("/movimientos/loadPage/"+page).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	
}]);

app.controller("movController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'movService',function($rootScope, $scope, $cookieStore, $window, $location, movService){
	
	$scope.paginaActual=1;
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

	movService.getPaginas($scope.paginaActual).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			$scope.cargamov(pag);
		}
	}
	$scope.cargamov=function(data){
		movService.load(data).then(function(data) {
			$scope.mov = data;
			console.log($scope.mov);
			$scope.llenarPags();
	});
	}
	$scope.cargamov(1);
	
	$scope.modalFechas= function(){
		$("#fechas").modal('show');
	}
	
	$scope.$watch('fechaInicio',function(){
		if($scope.fechaInicio){
			$scope.fi= $scope.fechaInicio.getDate()+"-"+($scope.fechaInicio.getMonth()+ 1)+"-"+$scope.fechaInicio.getFullYear();
		}
	})
	
	$scope.$watch('fechaFin',function(){
		if($scope.fechaFin){
			$scope.ff= $scope.fechaFin.getDate()+"-"+($scope.fechaFin.getMonth()+1)+"-"+$scope.fechaFin.getFullYear();
		}
	})
}]);


	
