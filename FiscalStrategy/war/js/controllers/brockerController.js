app.service("brockerservice",['$http', '$q', function($http, $q){
	this.guardarBrocker=function(send){
		var d = $q.defer();
		$http.post("/brockers/guardar/",send).then(
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
	this.consultarBrockersTodos = function(page) {
		var d = $q.defer();
		$http.get("/brockers/getPagina/"+page).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	this.consultarBrockersAll = function() {
		var d = $q.defer();
		$http.get("/brockers/todos/").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	this.consultarCB = function(id) {
		var d = $q.defer();
		$http.get("/clientes/getByBrocker/"+id).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	this.getPaginas = function() {
		var d = $q.defer();
	
		$http.get("/brockers/getTotalPaginas/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getcc = function(id) {
		var d = $q.defer();
		$http.get("/cuentasCliente/todas/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	};
	
	this.buscarBrockers = function(nombre) {
		var d = $q.defer();
		$http.get("/brockers/buscar/"+nombre).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	};
	
	this.eliminaBrocker = function(send) {
		var d = $q.defer();
		$http.post("/brockers/borrar/",send).then(function(response) {
			console.log(response);
			d.resolve(response.data);
		}, function(response) {
			d.reject(response);
		});
		return d.promise;
	};
	this.eliminacuentabrocker= function(send) {
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

app.controller("brockercuentacontroller",['$rootScope','clientservice','$scope','$window', '$location', '$cookieStore','clientcuentaservice','$routeParams', 'userFactory',function($rootScope,clientservice,$scope, $window, $location, $cookieStore, clientcuentaservice,$routeParams, userFactory){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	$scope.guardabrockerCuenta= function(id){
		console.log($scope.cuenta);
		$scope.cuenta.enabled=true;
		clientcuentaservice.guardarCuentaCliente(id,$scope.cuenta).then(function(data){
			alert("Cuenta Guardada Con Exito");
			$location.path("/listaBrocker");
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
app.controller("brockersController",['$rootScope','usuarioservice','$scope','$window', '$location', '$cookieStore','brockerservice', 'userFactory', function($rootScope,usuarioservice,$scope, $window, $location, $cookieStore, brockerservice, userFactory){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	brockerservice.consultarBrockersTodos(1).then(function(data) {
		$scope.brockerLista = data;
		$scope.llenarPags();
	});
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

	brockerservice.getPaginas($scope.paginaActual).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			$scope.cargaBrockers(pag);
		}
	}
	$scope.cargaBrockers=function(data){
		brockerservice.consultarBrockersTodos(data).then(function(data) {
			$scope.brockerLista = data;
			$scope.llenarPags();
	});
	}
	
	usuarioservice.consultarUsuariosTodos().then(function(data){
		$scope.usuariosLista=data;
	});
	$scope.guardaBrocker= function(){
		$scope.brocker.tipo="brocker";
		$scope.brocker.enabled=true;
		brockerservice.guardarBrocker($scope.brocker).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
		    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.brocker){window.location="#/listaBrocker";} }, 3000);
//			alert("Brocker Guardado Con Exito");
//			$location.path("/listaBrocker");
////			$window.location.reload(1);
//			setTimeout(window.location.reload.bind(window.location), 2000);

		});
	};
		$scope.eliminarcc = function(bcuenta){
			$('#mdsino').modal('show');
			$("#btnsi").on("click", function(){
			 
				brockerservice.eliminacuentabrocker(bcuenta).then(function(send) {	
					alert("Cuenta del Cliente Eliminado");
					$location.path("/listaBrocker");
					$window.location.reload();
					
				}) 
					
				  
			    
			  });
			$("#btnno").on("click", function(){
				$("#mdsino").modal('hide');
			});
//			var agree=confirm("¿Realmente desea eliminarlo? ");
//			  if (agree){
//			console.log(bcuenta);
//			brockerservice.eliminacuentabrocker(bcuenta).then(function(send) {	
//				alert("Cuenta del Cliente Eliminado");
//				$location.path("/listaBrocker");
//				$window.location.reload();
//				
//			}) 
//			  }else{
//				  alert("Se ha cancelado la Operacion");
//			  }
		};
		
		
	$scope.ver = function(data) {
		$scope.bk=data;
	    var length = $scope.bk.length;
		var stop=true;
	   	var i=0;
	while ( stop ) { 
		if($scope.usuariosLista[i].id==$scope.bk.responsable){
			$scope.bk.responsable=$scope.usuariosLista[i].usuario;
			console.log($scope.bk.responsable);
			stop=false;
			
		}else{
			i++}
	}
	    brockerservice.getcc($scope.bk.id).then(function(data) {
	  		$scope.ccuenta = data;
	  });
	    brockerservice.consultarCB($scope.bk.id).then(function(data) {
	  		$scope.listaCliente = data;
	  		brockerservice.getcc($scope.cliente.id).then(function(data) {
		  		$scope.cclient = data;
	  		 });
	  });
//	    for ( i=0; i < length; i++) {  
//	      alert($scope.datosComp[i].nom_coe);
//	      
//	    }
	};
	$scope.editarBrocker= function(){
//		$scope.getcliente=data
		
		$scope.bk.enabled=true;
		$scope.bk.id=$scope.getbrocker.id;
		brockerservice.guardarBrocker($scope.bk).then(function(data){
			var x = document.getElementById("snackbar")
		    x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.bk){$window.location.reload(1);} }, 3000);
//			alert("Cliente Guardado Con Exito");
//			$location.path("/clientes");
//			$window.location.reload(1);
//			setTimeout(window.location.reload.bind(window.location), 1000);

		});
		
	};
	$scope.bk={};
	$scope.editar = function(data){
		$scope.getbrocker=data;
		console.log($scope.getbrocker);
		$scope.bk=$scope.getbrocker;
//		$scope.bk.id=$scope.getbrocker.id;
//		$scope.bk.nickname=$scope.getbrocker.nickname;
//		$scope.bk.saldo=$scope.getbrocker.saldo;
//		$scope.bk.tipo=$scope.getbrocker.tipo;
//		$scope.client.tipo=$scope.getcliente.tipo;
//		$scope.client.responsable=$scope.getcliente.responsable;
		
		
	}
	
	$scope.eliminar = function(bk){
		$('#mdsino').modal('show');
		$("#btnsi").on("click", function(){
		 
			console.log(bk);
			  brockerservice.eliminaBrocker(bk).then(function(send) {	
				alert("Brocker Eliminado");
//				$('.modalgif').modal('show');
				$location.path("/listaBrocker");
				$window.location.reload();
			}) 
				
			  
		    
		  });
		$("#btnno").on("click", function(){
			$("#mdsino").modal('hide');
		});
//		var agree=confirm("¿Realmente desea eliminarlo? ");
//		  if (agree){
//			  console.log(bk);
//			  brockerservice.eliminaBrocker(bk).then(function(send) {	
//				alert("Brocker Eliminado");
//				$location.path("/listaBrocker");
//				$window.location.reload();
//			}) 
//			
//		  }else{
//			  alert("Eliminacion Cancelada");
//		  }
		  
		
	};
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
 	

};
}]);
