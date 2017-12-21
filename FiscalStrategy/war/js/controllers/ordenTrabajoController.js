app.service("ordenTrabajoservice",['$http', '$q', function($http, $q){
	this.data=function(data){
		var dataClient={};
	};
	this.loadCliente = function(id) {
		var d = $q.defer();
	
		$http.get("clientes/find/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.loadOT = function(id) {
		var d = $q.defer();
	
		$http.get("/ots/find/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);

app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice', function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice){
	usuarioservice.consultarUsuariosTodos().then(function(data){
		$scope.usuariosLista=data;
	});
	brockerservice.consultarBrockersTodos().then(function(data) {
		$scope.brockerLista = data;

});
	ordenTrabajoservice.loadOT($cookieStore.get("idOt")).then(function(data){
		$scope.ot= data;
		ordenTrabajoservice.loadCliente($scope.ot.idCliente).then(function(data) {
			$scope.cliente = data;
			console.log("Datos de Cliente",data);
		});
	});	
}]);	



