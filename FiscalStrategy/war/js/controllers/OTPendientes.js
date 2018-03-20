app.controller("OTPendientes",['$rootScope', '$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice','otservice','cuentaservice','userFactory',function($rootScope,$scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice,otservice,cuentaservice,userFactory){
	
	cuentaservice.load().then(function(data) {
		$scope.banco = data;

});
	var indice = null;
	var tipoOperacion= null;
	$scope.tiposOp = TiposOperacion();
	$scope.perfil=false;
	$scope.mov={
			tipo: null,
			monto: null,
			descripcion: null,
			banco: null,
			cuenta: null,
			numTransaccion:null,
			fecha:new Date()
	}
	
	
	$scope.cargarMov=function(index){
		
			$scope.mov.tipo=$scope.otvo[index].tipo;
			$scope.mov.monto=$scope.otvo[index].monto;
			$scope.mov.descripcion=$scope.otvo[index].descripcion;
			$scope.mov.banco=$scope.otvo[index].banco;
			$scope.mov.cuenta=$scope.otvo[index].cuenta;

		indice=index;
		
	};
	$scope.Cuentas = function() {
		 ordenTrabajoservice.consultarCuentasPorBanco($scope.mov.banco).then(function(data){
			 $scope.cuentas= data;
		 }); 
	};
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

	ordenTrabajoservice.getPaginasPendientes($cookieStore.get("idOt")).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	
	$scope.cargarPagina=function(page){
		ordenTrabajoservice.loadPendientes(page).then(function(data){
			
			$scope.perfil=true;
			$scope.otvo= data;
			console.log($scope.otvo);
		})
		$scope.paginaActual=page;
		$scope.llenarPags();
	}
	
	$scope.cargarPagina(1);
	
	$scope.ver = function(data) {
		$location.path("/ordenTrabajo");
		//$window.location.reload();
		$cookieStore.put("idOt",data);
//		$scope.listClient=data;
	}
	
	$scope.verPedientes = function(data) {
		$location.path("/ListaPendiente");
		//$window.location.reload();
		$cookieStore.put("idOt",data);
//		$scope.listClient=data;
	}
	$scope.limpiarMov=function(){
		$scope.mov.tipo= null;
		$scope.mov.monto= null;
		$scope.mov.descripcion= null;
		$scope.mov.banco= null;
		$scope.mov.cuenta= null;
		$scope.mov.fecha= null;
		$scope.mov.numTransaccion= null;
		
	}

	$scope.updateMov=function(){
			$scope.otvo.movimientos[indice].banco=$scope.mov.banco;
			$scope.otvo.movimientos[indice].cuenta=$scope.mov.cuenta;
			ordenTrabajoservice.updateot($scope.otvo[indice]).then(function(data){
				$window.location.reload();
			});
		
		$scope.limpiarMov();
	}
	$scope.validMov=function(){
		
			$scope.otvo.movimientos[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.movimientos[indice].fecha=$scope.mov.fecha;
			$scope.otvo.movimientos[indice].estatus="VALIDADO"
				ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
					$window.location.reload();
				});
	
	
		$scope.limpiarMov();
	}

//	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
}]);