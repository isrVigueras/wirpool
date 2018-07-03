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
	this.validar=function(id){
		var d = $q.defer();
		$http.post("ots/validar/",id).then(function(response) {
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
	this.getNoti = function(id) {
		var d = $q.defer();
		$http.get("/notificacion/lanza/"+id).then(
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

app.controller("OTsListController",['$rootScope','$scope','$window', '$location', '$cookieStore','otservice','userFactory','ordenTrabajoservice', function($rootScope, $scope, $window, $location, $cookieStore, otservice,userFactory,ordenTrabajoservice){
	$rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	$scope.perfil=$rootScope.perfilUsuario;
	console.log("El Perfil",$scope.perfil);
	otservice.consultarCB().then(function(data) {
		$scope.cbtodos = data;
	});
	$scope.filtroOT=function(id){
	otservice.FiltroOT(id).then(function(data){
		$scope.ots=data;
	});
	}
	$scope.$watch('busca',function(){
//		if($scope.busca.length>3){
			$scope.buscar();
//		}
	},true);
	$scope.$watch('empresaSearch',function(){
		if($scope.empresaSearch.length>3){
			$scope.zEmpresa();
		}
	},true);
	$scope.datos={
			idCliente: null,
			idBrocker: null,
			nombreCliente: null,
			fechaInicio: new Date(),
	}
	
	$scope.pago={
			fecha: new Date(),
			moneda:"MXN",
			cuenta:"",
			banco:"",
			monto: null,
	}
	$scope.idot=null;
	$scope.getidot=function(data){
		$scope.idot=data;
	}
	$scope.enviarnoti=function(){
		
		otservice.getNoti($scope.idot).then(function(){
			alert("Se ha enviado la Notificaci\u00f3n");
			$('#mdlNoti').modal('hide');
		});
	};
	$scope.buscar=function(){
		ordenTrabajoservice.buscarClientes($scope.busca).then(function(data){
			
			$scope.encontrados=[];
			for(var i=0; i< data.length; i++){
				$scope.encontrados.push(data[i].nickname);
				
			}
			$scope.cliente=data;
			
//			$scope.tipos=data.tipos;
			
			$('#searchBoxLista').typeahead({

			    source: $scope.encontrados,

			    updater:function (item) {
			    	var ind=$scope.encontrados.indexOf(item);
			    	$scope.clienteSeleccionado=true;
			    	if($scope.clienteSeleccionado==true){
			    		console.log("El cliente se selecciono",$scope.cliente);
			    		if($scope.cliente[ind].idBrocker==null){
			    			alert("El cliente no tiene Brocker asignado");
			    		}
			    		if($scope.cliente[ind].responsable==null){
			    			alert("El cliente no tiene Responsable asignado");
			    		}
			    	}
			    	$scope.datos.idCliente= $scope.cliente[ind].id;
			        return item;
			    }
			});
			$('#searchBox').data('typeahead').source=$scope.encontrados;
		});
	}
	$scope.zEmpresa=function(){
		ordenTrabajoservice.searchEmpresa($scope.empresaSearch).then(function(data){
			
			$scope.found=[];
			for(var i=0; i< data.length; i++){
				$scope.found.push(data[i].nombre);
				
			}
			$scope.Empresa=data;
//			$scope.tipos=data.tipos;
			
			$('#buscaEmpresa').typeahead({

			    source: $scope.found,

			    updater:function (item) {
			    	var em=$scope.found.indexOf(item);
			    	$scope.datos.idEmpresa= $scope.Empresa[em].id;
			    	$scope.pago.empresa=$scope.Empresa[em].nombre;
			    	$scope.Cuentasban($scope.datos.idEmpresa);
			        return item;
			    }
			
			});
			$('#buscaEmpresa').data('typeahead').source=$scope.found;
		});
	}
	$scope.filtroCliente=function(id){
		otservice.FiltroCliente($scope.datos.idCliente).then(function(data){
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
	$scope.verEdit = function(data) {
		$location.path("/ordenTrabajoMod");
		//$window.location.reload();
		$cookieStore.put("idOt",data);
		$scope.listClient=data;
	}
	$scope.validar = function(data) {
		var r = confirm("Precione Aceptar para validar la OT No. " + data +"\n De lo Contrario presione Cancelar");
	    if (r == true) {
	    	otservice.validar(data).then(function(data){
	    		$window.location.reload();
			});
	    } 
	    
	  
	}
	$( document ).ready(function() {
		  $rootScope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
			$scope.perfil=$rootScope.perfilUsuario;
	});
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
	$scope.modalFechas= function(){
		$("#fechas").modal('show');
	}
	
	$scope.$watch('fechaInicio',function(){
		if($scope.fechaInicio){
			$scope.fi= $scope.fechaInicio.getDate()+"-"+($scope.fechaInicio.getMonth()+ 1)+"-"+$scope.fechaInicio.getFullYear();
		}
	})
	
	$scope.$watch('fechaFin',function(){
		if($scope.fechaFin){
			$scope.ff= $scope.fechaFin.getDate()+"-"+($scope.fechaFin.getMonth()+1)+"-"+$scope.fechaFin.getFullYear();
		}
	})
}]);




app.controller("otDetailsController",['$scope','$window', '$location', '$cookieStore','otservice','$routeParams', function($scope, $window, $location, $cookieStore, otservice,$routeParams){
	otservice.find($routeParams.id).then(function(data){
		$scope.ot=data;
	});
	
	
	
}]);