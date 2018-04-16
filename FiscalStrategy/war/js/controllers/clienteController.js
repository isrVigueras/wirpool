app.service("clientservice",['$http', '$q', function($http, $q){
	this.consultarClientesTodos = function(page) {
		var d = $q.defer();
		$http.get("/clientes/getPagina/"+page).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	}
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/clientes/getTotalPaginas/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.getCliente = function(id) {
		var d = $q.defer();
	
		$http.get("/clientes/find/"+id).then(
			function(response) {
				d.resolve(response.data);
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
	
	this.confirmar=function(send){
		var d = $q.defer();
		$http.post("/clientes/confirmar/",send).then(
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
app.controller("clientcuentacontroller",['$rootScope', '$scope','$window', '$location', '$cookieStore','clientcuentaservice','$routeParams', 'userFactory',function($rootScope, $scope, $window, $location, $cookieStore, clientcuentaservice,$routeParams, userFactory){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
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
}]);

app.controller("clientController",['$http','$interval','$rootScope','usuarioservice','brockerservice','$scope','$window', '$location', '$cookieStore','clientservice','clientcuentaservice', 'userFactory', function($http,$interval,$rootScope,usuarioservice,brockerservice, $scope, $window, $location, $cookieStore, clientservice,clientcuentaservice, userFactory){
	
	$scope.client={};
	
	$scope.client={tipo:"cliente"};
	
	$scope.$watch('busca',function(){
		if($scope.busca.length>3){
			$scope.buscar();
		}
	},true);
	$scope.buscar=function(){
		brockerservice.buscarBrockers($scope.busca).then(function(data){
			
			$scope.encontrados=[];
			for(var i=0; i< data.length; i++){
				$scope.encontrados.push(data[i].nickname);
				
			}
			$scope.cliente=data;
			$('#searchBox').typeahead({

			    source: $scope.encontrados,

			    updater:function (item) {
			    	var ind=$scope.encontrados.indexOf(item);
			    	$scope.clienteSeleccionado=true;
			    	$scope.client.idBrocker= $scope.cliente[ind].id;
			        return item;
			    }
			});
			$('#searchBox').data('typeahead').source=$scope.encontrados;
		});
	}

	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	clientservice.consultarClientesTodos(1).then(function(data) {
			$scope.clienteLista = data;
	
	});

	usuarioservice.consultarUsuariosAll().then(function(data){
		$scope.usuariosLista=data;
	});
	brockerservice.consultarBrockersTodos().then(function(data) {
		$scope.brockerLista = data;

});
	$scope.cargaClientes=function(data){
		clientservice.consultarClientesTodos(data).then(function(data) {
			$scope.clienteLista = data;
			$scope.llenarPags();
	});
	}
	
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
	
	$scope.contador=0;
	
	clientservice.getPaginas($cookieStore.get("rfcEmpresa")).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
		
		var promise = $interval(function(){
			if($scope.contador<$scope.maxPage){
				$http.get("/clientes/rehacer/"+$scope.contador).then(function(data){
					console.log(data);
				})
				$scope.contador++;
			}
		}, 10000);
	
		$scope.$on('$destroy', function (){ 
			 $interval.cancel(promise); 
		});
		
	});
	
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			$scope.cargaClientes(pag);
		}
	}

	$scope.guardaCliente= function(){
		
		$scope.client.enabled=true;
		clientservice.guardarCliente($scope.client).then(function(data){
			if(data=="OK"){
				var x = document.getElementById("snackbar")
			    x.className = "show";
				setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
			    setTimeout(function(){ if($scope.client){window.location="#/clientes";} }, 3000);
	//			$location.path("/clientes");
				$window.location.reload();
			}else{
				$scope.repetidos=data;
				$("#myModalRepetidos").modal('show');
			}

		});
		
	};
	
	$scope.confirmar=function(){
		clientservice.confirmar($scope.client).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.client){window.location="#/clientes";} }, 3000);
			$location.path("/clientes");
			$window.location.reload();
//			setTimeout(window.location.reload.bind(window.location), 1000);
		})
	}
	
	$scope.editarCliente= function(){
		$scope.client.enabled=true;
		$scope.client.id=$scope.getcliente.id;
		clientservice.guardarCliente($scope.client).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.client){$window.location.reload(1);} }, 3000);
//			$window.location.reload(1);

		});
		
	};
	$scope.editar = function(data){
		clientservice.getCliente(data.id).then(function(data){
			$scope.client=data.cliente;
			$scope.brocker= data.brocker.nickname;
			$scope.responsable= data.responsable.usuario;
		});
		
		
	}
	$scope.eliminar = function(cliente){
		$('#mdsino').modal('show');
		$("#btnsi").on("click", function(){
		 
				console.log(cliente);
				clientservice.eliminaCliente(cliente).then(function(send) {	
					alert("Cliente Eliminado");
					$location.path("/clientes");
					$window.location.reload();
				}) 
				
			  
		    
		  });
		$("#btnno").on("click", function(){
			$("#mdsino").modal('hide');
		});
//		var agree=confirm("¿Realmente desea eliminarlo? ");
//		  if (agree){
//			  console.log(cliente);
//			clientservice.eliminaCliente(cliente).then(function(send) {	
//				alert("Cliente Eliminado");
//				$location.path("/clientes");
//				$window.location.reload();
//			}) 
//			
//		  }else{
//			  alert("Eliminacion Cancelada");
//		  }
		  
		
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
   	var stop=true;
   	var i=0;
while ( stop ) { 
	if($scope.usuariosLista[i].id==$scope.cliente.responsable){
		$scope.cliente.responsable=$scope.usuariosLista[i].usuario;
		console.log($scope.cliente.responsable);
		stop=false;
		
	}else{
		i++}
}
    clientcuentaservice.getcc($scope.cliente.id).then(function(data) {
  		$scope.ccuenta = data;
  });
    for ( i=0; i < length; i++) {  
      alert($scope.datosComp[i].nom_coe);
      
    };
}

$scope.eliminarcc = function(cuenta){
	$('#mdsino').modal('show');
	$("#btnsi").on("click", function(){
	 
		console.log(cuenta);
		clientcuentaservice.eliminacuentacliente(cuenta).then(function(send) {	
			alert("Cuenta del Cliente Eliminado");
			$location.path("/clientes");
			$window.location.reload();
			}) 
			
		  
	    
	  });
	$("#btnno").on("click", function(){
		$("#mdsino").modal('hide');
	});
//	var agree=confirm("¿Realmente desea eliminarlo? ");
//	  if (agree){
//	console.log(cuenta);
//	clientcuentaservice.eliminacuentacliente(cuenta).then(function(send) {	
//		alert("Cuenta del Cliente Eliminado");
//		$location.path("/clientes");
//		$window.location.reload();
//		
//	}) 
//	  }else{
//		  alert("Se ha cancelado la Operacion");
//	  }
};

//	$scope.cargarPagina(1);
	
}]);