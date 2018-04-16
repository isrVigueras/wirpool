app.service('notificacionesService',['$http','$q','$location','$rootScope','$window',function($http, $q, $location,$rootScope, $window){
	this.consultar=function(idUser){
			var d = $q.defer();
			$http.get("/notificacion/findByResponsable/"+idUser).then(
				function(response) {
					d.resolve(response.data);
				});
			return d.promise;
	}
	
	this.eliminaNotificaciones=function(idot){
		var d = $q.defer();
		$http.get("/notificacion/deleteByOt/"+idot).then(
			function(response) {
				d.resolve(response.data);
		});
		return d.promise;
	}
	
	this.eliminar=function(id){
		var d = $q.defer();
		$http.get("/notificacion/deleteByID/"+id).then(
			function(response) {
				d.resolve(response.data);
		});
		return d.promise;
	}


	this.notificaMovEditado=function(otvo){
		var movEditados=false;
		for(var i in otvo.movimientos){
			if(otvo.movimientos[i].tipo != 'Efectivo' && otvo.movimientos[i].tipo != 'Resguardo'){
				if(otvo.movimientos[i].banco == null && otvo.movimientos[i].cuenta == null){
					movEditados= true;
				}
			}
		}
		for(var i in otvo.comisiones){
			if(otvo.comisiones[i].tipo != 'Efectivo' && otvo.comisiones[i].tipo != 'Resguardo'){
				if(otvo.comisiones[i].banco == null && otvo.comisiones[i].cuenta == null){
					movEditados= true;
				}
			}
		}
		
		if(movEditados==false){
			var notif = {idOt: otvo.ot.id ,responsable:otvo.ot.idResponsable,mensaje:"Faltan movimientos por validar"};
			var d = $q.defer();
			$http.get("/notificacion/deleteByOt/"+ otvo.ot.id).then(
					function(response) {
						d.resolve(response.data);
			});
			$http.post("/notificacion/aEjecutivo/",notif).then(
					function(response) {
						d.resolve(response);
				});
			return d.promise;
		}else{
			var d = $q.defer();
			var notif = {idOt: otvo.ot.id ,responsable:otvo.ot.idResponsable,mensaje:"Se han editado movimientos"};
			$http.post("/notificacion/aEjecutivo/",notif).then(
					function(response) {
						d.resolve(response);
				});
			return d.promise;
		}
	}
	
	this.notificaMovValidado=function(otvo){
		var movValidados=false;
		for(var i in otvo.movimientos){
			if(otvo.movimientos[i].estatus != 'VALIDADO'){
				movValidados=true;
			}
		}
		for(var i in otvo.comisiones){
			if(otvo.comisiones[i].estatus != 'VALIDADO'){
				movValidados=true;
			}
		}
		
		if(movValidados==false){
			var notif = {idOt: otvo.ot.id ,mensaje:"OT cuenta con todos sus movimientos validados"};
			var d = $q.defer();
			$http.get("/notificacion/deleteByOt/"+otvo.ot.id).then(
					function(response) {
						d.resolve(response.data);
			});
			$http.post("/notificacion/aAdministrador/",notif).then(
					function(response) {
						d.resolve(response);
				});
				return d.promise;
		}else{
			var notif = {idOt: otvo.ot.id ,mensaje:"Se han validado Movimientos"};
			var d = $q.defer();
			$http.post("/notificacion/aAdministrador/",notif).then(
					function(response) {
						d.resolve(response);
				});
				return d.promise;
		}
	}
	
	
}]);

app.controller('notificacionesController',['$rootScope', 'notificacionesService','$scope','$cookieStore','$location','userFactory',function($rootScope,notificacionesService,$scope,$cookieStore,$location,userFactory){
	
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	var us= userFactory.getUsuarioFirmado();
	notificacionesService.consultar(us.id).then(function(data){
		$scope.numNotificaciones=data.length;
		$scope.notificaciones=data;
	})
	
	
	$scope.ver = function(data, index) {
		notificacionesService.eliminar(index);
		$cookieStore.put("idOt",data);
		$location.path("/ordenTrabajo");
//		 window.location.reload();
	}
}])