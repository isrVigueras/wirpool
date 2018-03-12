app.service("pagosService",['$http',"$q",function($http,$q){
	this.guardarPagos=function(pagos){
		var d = $q.defer();
		$http.post("/pagos/save/",pagos).then(
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
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/pagos/pages").then(
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
	
	this.generarPagos=function(pagos){
		var d = $q.defer();
		$http.post("/pagos/generar/",pagos).then(
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
	
	this.procesarPagos=function(datos,tipo,cuenta){
		var d = $q.defer();
		var send={
			datos:datos,
			tipo:tipo,
			cuenta:cuenta
		};
		$http.post("/pagos/procesarMultiple/",send).then(
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
	this.consultarPagos = function() {
		var d = $q.defer();
		$http.get("/pagos/page/1").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
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
	}
	
	this.load = function(page) {
		var d = $q.defer();
	
		$http.get("/pagos/page/"+page).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	
}]);

app.controller("pagosAddController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'pagosService','cuentaservice','userFactory', function($rootScope,$scope, $cookieStore, $window, $location, pagosService,cuentaservice,userFactory){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	$scope.pago={
			moneda:"MXN"
	}
	
	pagosService.consultarClientesTodos().then(function(data) {
		$scope.cliente = data;

});

		
	$scope.guardaPago= function(id){
		var pagos=[];
		
		pagos.push($scope.pago);
		pagosService.guardarPagos({pagos:pagos}).then(function(data){
			
			var x = document.getElementById("snackbar")
		    x.className = "show";
		    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		    setTimeout(function(){ if($scope.pago){window.location="#/listaOTs";} }, 3000);
		    
		});
		
	}
	
	$scope.procesar=function(){
		pagosService.procesarPagos($scope.datos, $scope.tipo, $scope.cuenta).then(function(data){
			alert("Pagos Guardados");
			$location.path("/listaOTs");
			$window.location.reload();
		});
		
	};
	
	$scope.ver = function(data) {
		 pagosService.getcc($scope.pago.id_cliente).then(function(data) {
	    	console.log(data);
	    	$scope.ccuenta = data;
	  });
	    
	};
	
	$scope.modifica=function(){
		var x = document.getElementById("slc").selectedIndex;
		$scope.pago.banco=$scope.ccuenta[x].banco;
		console.log($scope.pago.banco);
		}
	
	$scope.pago.fecha = new Date();
	
	$scope.$watch('tipo',function(){
		if($scope.tipo){
			cuentaservice.getByBanco($scope.tipo).then(function(data){
				$scope.cuentas=data;
			})
		}
	},true);
	$scope.clear=function(){
		$scope.pago.banco="";
	}
	
	
}]);
app.controller("ListaPagoController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'pagosService','cuentaservice','clientservice','userFactory', function($rootScope,$scope, $cookieStore, $window, $location, pagosService,cuentaservice,clientservice,userFactory){
//	pagosService.consultarPagos().then(function(data) {
//		$scope.ListPagos = data;
//
//});
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	clientservice.consultarClientesTodos().then(function(data) {
		$scope.clienteLista = data;

});
	
	
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
	
	pagosService.getPaginas().then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	
	$scope.cargarPagina=function(page){
		pagosService.load(page).then(function(data){
			$scope.ListPagos=data;
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
