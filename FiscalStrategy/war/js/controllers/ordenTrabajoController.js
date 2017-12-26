function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function(){ window.location.reload(); }, 3000);
}

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
	this.updateOt=function(ot){
		var d = $q.defer();
		$http.post("ots/update/",ot).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);

app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice', function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice){
//	usuarioservice.consultarUsuariosTodos().then(function(data){
//		$scope.usuariosLista=data;
//	});
//	brockerservice.consultarBrockersTodos().then(function(data) {
//		$scope.brockerLista = data;
//
//});
	ordenTrabajoservice.loadOT($cookieStore.get("idOt")).then(function(data){
		$scope.ot= data;
		$scope.importe = $scope.ot.pago.monto/1.16;
		$scope.importe = $scope.importe.toFixed(2);
		$scope.iva= $scope.ot.pago.monto-$scope.importe;
		$scope.iva= $scope.iva.toFixed(2);
//		ordenTrabajoservice.loadCliente($scope.ot.idCliente).then(function(data) {
//			$scope.cliente = data;
//			console.log("Datos de Cliente",data);
//		});
	});	
	
	$scope.actualizar=function(){
		ordenTrabajoservice.updateOt($scope.ot).then(function(data){
			showAlert("Se guardó la Orden de trabajo",$window);
//			$window.location.reload();
		})
	}
	
	
	
	$scope.redondea=function(valor){
		var aux= valor;
		aux= aux.toFixed(2);
		return aux;
	}
}]);	



