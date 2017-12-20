app.service("otservice",['$http', '$q', function($http, $q){
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/ots/load/"+page).then(
			function(response) {
				d.resolve(response.data);
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
	this.consultarCuentas = function(page) {
		var d = $q.defer();
	
		$http.get("/cuentas/getPagina/1").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/ots/paginas/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.getOt = function(id) {
		var d = $q.defer();
		$http.get("/ots/find/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	
	
}]);
//.factory('dataService', function() {
//	  var _dataObj = {};
//	  return {
//	    dataObj: _dataObj
//	  }
//	});

app.controller("OTsListController",['$scope','$window', '$location', '$cookieStore','otservice', function($scope, $window, $location, $cookieStore, otservice){
	
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

	otservice.getPaginas($cookieStore.get("rfcEmpresa")).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	
	$scope.cargarPagina=function(page){
		otservice.load(1).then(function(data){
			$scope.ots=data;
		});
		$scope.paginaActual=page;
		$scope.llenarPags();
	}
	
	$scope.cargarPagina(1);
	
	$scope.ver = function(data) {
		
		$location.path("/ordenTrabajo");
		$window.location.reload();
		$cookieStore.put("idOt",data)
//		$scope.listClient=data;
	}
	
}]);




app.controller("otDetailsController",['$scope','$window', '$location', '$cookieStore','otservice','$routeParams', function($scope, $window, $location, $cookieStore, otservice,$routeParams){
	otservice.find($routeParams.id).then(function(data){
		$scope.ot=data;
	});
	
	
	
}]);