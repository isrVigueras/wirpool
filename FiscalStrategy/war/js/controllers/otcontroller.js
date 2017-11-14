app.service("otservice",['$http', '$q', function($http, $q){
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/ots/load/"+page).then(
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
	
}]);

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
	
}]);
