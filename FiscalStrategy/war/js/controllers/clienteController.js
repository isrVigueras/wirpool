app.service("clientservice",['$http', '$q', function($http, $q){
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
	this.guardarCliente=function(send){
		var d = $q.defer();
		$http.post("/clientes/guardar/",send).then(
			function(response) {
				console.log(response);
				d.resolve(response.data);
			}, function(response) {
				if(response.status==403){
					alert("No está autorizado para realizar esta acción");
					$location.path("/");
				}
			});
		return d.promise;
	}
	
	this.eliminaCliente = function(send) {
		var d = $q.defer();
		$http.post("/clientes/borrar/",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	
}]);

app.service("clientcuentaservice",['$http', '$q', function($http, $q){
	this.guardarCuentaCliente=function(id,send){
		var d = $q.defer();
		$http.post("/cuentasCliente/guardar/"+id,send).then(
			function(response) {
				console.log(response);
				d.resolve(response.data);
			}, function(response) {
				if(response.status==403){
					alert("No está autorizado para realizar esta acción");
					$location.path("/");
				}
			});
		return d.promise;
	};
	
	this.getcc = function(id) {
		var d = $q.defer();
		$http.get("/cuentasCliente/todas/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.eliminacuentacliente= function(send) {
		var d = $q.defer();
		$http.post("/cuentasCliente/borrar/",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	
}]);
app.controller("clientcuentacontroller",['$scope','$window', '$location', '$cookieStore','clientcuentaservice','$routeParams',function($scope, $window, $location, $cookieStore, clientcuentaservice,$routeParams){
	$scope.guardaClienteCuenta= function(id){
		console.log($scope.cuenta);
		$scope.cuenta.enabled=true;
		clientcuentaservice.guardarCuentaCliente(id,$scope.cuenta).then(function(data){
			alert("Cuenta Guardada Con Exito");
			$location.path("/clientes");
			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	};
	
//	$scope.VerCC=function(id){
//	clientcuentaservice.getcc(id).then(function(data) {
//		$scope.ccuenta = data;
//
//});
//	}
}]);

app.controller("clientController",['usuarioservice','brockerservice','$scope','$window', '$location', '$cookieStore','clientservice','clientcuentaservice', function(usuarioservice,brockerservice, $scope, $window, $location, $cookieStore, clientservice,clientcuentaservice){
	clientservice.consultarClientesTodos().then(function(data) {
			$scope.clienteLista = data;
	
	});
	
	usuarioservice.consultarUsuariosTodos().then(function(data){
		$scope.usuariosLista=data;
	});
	
	brockerservice.consultarBrockersTodos().then(function(data) {
		$scope.brockerLista = data;

});
	
//	$scope.paginaActual=1;
//	$scope.llenarPags=function(){
//		var inicio=0;
//		if($scope.paginaActual>5){
//			inicio=$scope.paginaActual-5;
//		}
//		var fin = inicio+9;
//		if(fin>$scope.maxPage){
//			fin=$scope.maxPage;
//		}
//		$scope.paginas=[];
//		for(var i = inicio; i< fin; i++){
//			$scope.paginas.push(i+1);
//		}
//		for(var i = inicio; i<= fin; i++){
//			$('#pagA'+i).removeClass("active");
//			$('#pagB'+i).removeClass("active");
//		}
//		$('#pagA'+$scope.paginaActual).addClass("active");
//		$('#pagB'+$scope.paginaActual).addClass("active");
//	}
//
//	clientservice.getPaginas($cookieStore.get("rfcEmpresa")).then(function(data){
//		$scope.maxPage=data;
//		$scope.llenarPags();
//	});
//	
//	$scope.cargarPagina=function(pag){
//		if($scope.paginaActual!=pag){
//			$scope.paginaActual=pag;
//			$scope.cargarFacturas(pag);
//		}
//	}

	$scope.guardaCliente= function(){
		
		$scope.client.enabled=true;
		clientservice.guardarCliente($scope.client).then(function(data){
			alert("Cliente Guardado Con Exito");
			$location.path("/clientes");
//			$window.location.reload(1);
			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	};
	$scope.eliminar = function(cliente){
		var agree=confirm("¿Realmente desea eliminarlo? ");
		  if (agree){
			  console.log(cliente);
			clientservice.eliminaCliente(cliente).then(function(send) {	
				alert("Cliente Eliminado");
				$location.path("/clientes");
				$window.location.reload();
			}) 
			
		  }else{
			  alert("Eliminacion Cancelada");
		  }
		  
		
	};
$scope.reload = function(){
		
		
			
			$location.path("/clientes");
			$window.location.reload();
		
	};
	
	$scope.detallesCliente=function(){
		
		
		
		
	}
	
	
	$scope.rc=false;
	$scope.ca=true;
	$scope.btn=true;
	 $scope.hide=function () {
		 $scope.btn=false;   
     	$scope.rc=true;
     	$scope.ca=false;
	
 };
 $scope.btnCancelar=function () {
	 $scope.btn=true;   
 	$scope.rc=false;
 	$scope.ca=true;
 	$scope.cuenta.banco="";
 	$scope.cuenta.cuenta="";
 	$scope.cuenta.clabe="";
 	$scope.cuenta.nombre="";

};
 
$scope.ver = function(data) {
	$scope.cliente=data;
    var length = $scope.cliente.length;
    clientcuentaservice.getcc($scope.cliente.id).then(function(data) {
  		$scope.ccuenta = data;
  });
    for ( i=0; i < length; i++) {  
      alert($scope.datosComp[i].nom_coe);
      
    };
}

$scope.eliminarcc = function(cuenta){
	var agree=confirm("¿Realmente desea eliminarlo? ");
	  if (agree){
	console.log(cuenta);
	clientcuentaservice.eliminacuentacliente(cuenta).then(function(send) {	
		alert("Cuenta del Cliente Eliminado");
		$location.path("/clientes");
		$window.location.reload();
		
	}) 
	  }else{
		  alert("Se ha cancelado la Operacion");
	  }
};

//	$scope.cargarPagina(1);
	
}]);