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
	this.FiltroOT=function(id){
		var d = $q.defer();
		$http.get("ots/find/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.FiltroCliente=function(id){
		var d = $q.defer();
		$http.get("ots/findByCliente/"+id).then(function(response) {
				d.resolve(response.data);
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
	
	this.consultarCB = function() {
		var d = $q.defer();
		$http.get("/ots/getClientesBrokers/").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
				//$location.path("/login");
			}
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

	otservice.consultarCB().then(function(data) {
		$scope.cbtodos = data;
	});
	$scope.filtroOT=function(id){
	otservice.FiltroOT(id).then(function(data){
		$scope.ots=data;
	});
	}
	$scope.filtroCliente=function(id){
		otservice.FiltroCliente($scope.filtroCL).then(function(data){
			$scope.ots=data;
		});
		}
	$scope.verTodo=function(){
		$scope.cargarPagina(1);
	}

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
		otservice.load(page).then(function(data){
			$scope.ots=data;
		});
		$scope.paginaActual=page;
		$scope.llenarPags();
	}
	$scope.cargarPagina(1);
	
	$scope.ver = function(data) {
		$location.path("/ordenTrabajo");
		//$window.location.reload();
		$cookieStore.put("idOt",data);
		$scope.listClient=data;
	}
	
	$scope.verPedientes = function(data) {
		$location.path("/ListaPendiente");
		//$window.location.reload();
		$cookieStore.put("idOt",data);
//		$scope.listClient=data;
	}
	$("#filID").on("click", function(){
		var x = document.getElementById("filID").selectedIndex;
		$scope.filtroCL=$scope.cbtodos[x];
		$scope.filtroCL=$scope.filtroCL.id;
		}) 
}]);




app.controller("otDetailsController",['$scope','$window', '$location', '$cookieStore','otservice','$routeParams', function($scope, $window, $location, $cookieStore, otservice,$routeParams){
	otservice.find($routeParams.id).then(function(data){
		$scope.ot=data;
	});
	
	
	
}]);