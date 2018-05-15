function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function(){ window.location.reload(); }, 3000);
}

app.service("movService",['$http', '$q', function($http, $q){
	this.loadResguardos = function(id) {
		var d = $q.defer();
		$http.get("/movimientos/getResguardos/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.loadCliente = function(id) {
		var d = $q.defer();
	
		$http.get("/ots/getClientesBrokers/").then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.loadCA  = function(id) {
		var d = $q.defer();
		$http.get("/ots/loadCA/"+id).then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginas = function(page) {
		var d = $q.defer();
	
		$http.get("/movimientos/getPages/").then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.load = function(page) {
		var d = $q.defer();
		$http.get("/movimientos/loadPage/"+page).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				//alert("No tiene permiso de realizar esta acción");
				$location.path("/login");
			}
		});
		return d.promise;
	};
	this.buscarClientes = function(buscar) {
		var d = $q.defer();
		$http.get("/clientes/buscar/"+buscar).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
				//$location.path("/login");
			}
		});
		return d.promise;
	}
	this.getDataPage = function(page,id) {
		var d = $q.defer();
		$http.get("/movimientos/loadPageCliente/"+page+"/" +id).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
				//$location.path("/login");
			}
		});
		return d.promise;
	}
	this.getDataEmpresaPage = function(page,empresa) {
		var d = $q.defer();
		$http.get("/movimientos/loadPageEmpresa/"+page+"/" +empresa).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
				//$location.path("/login");
			}
		});
		return d.promise;
	}
	this.getPaginasCliente = function(id) {
		var d = $q.defer();
	
		$http.get("/movimientos/getPages/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginasEmpresa = function(empresa) {
		var d = $q.defer();
	
		$http.get("/movimientos/getPagesEmpresa/"+empresa).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);

app.controller("movController",['$rootScope', '$scope','$cookieStore', '$window', '$location', 'movService','ordenTrabajoservice','CBService',function($rootScope, $scope, $cookieStore, $window, $location, movService,ordenTrabajoservice,CBService){
	$scope.sinfiltro=true;
	$scope.mostrarTodo=function(){
		$scope.sinfiltro=true;
		$scope.fCliente=false;
		$scope.fEmpresa=false;
		
	}
$scope.mostrarCliente=function(){
	$scope.sinfiltro=false;
	$scope.fCliente=true;
	$scope.fEmpresa=false;
	}
$scope.mostrarEmpresa=function(){
	$scope.sinfiltro=false;
	$scope.fCliente=false;
	$scope.fEmpresa=true;
}
	//	INICIO FILTRO CLIENTE/BROKER
	$scope.$watch('buscaClient',function(){
			$scope.buscarCliente();
	},true);
	$scope.datos=[];
	$scope.buscarCliente=function(){
		CBService.buscarClientes($scope.buscaClient).then(function(data){
			
			$scope.encontrados=[];
			for(var i=0; i< data.length; i++){
				$scope.encontrados.push(data[i].nickname);
				
			}
			$scope.cliente=data;
			
//			$scope.tipos=data.tipos;
			
			$('#searchCliente').typeahead({

			    source: $scope.encontrados,

			    updater:function (item) {
			    	var ind=$scope.encontrados.indexOf(item);
			    	$scope.clienteSeleccionado=true;
			    	if($scope.clienteSeleccionado==true){
			    		console.log("El cliente se selecciono",$scope.cliente);

			    	}
			    	$scope.datos.idCliente= $scope.cliente[ind].id;
			    	
			        return item;
			    }
			});
			$('#searchCliente').data('typeahead').source=$scope.encontrados;
		});
		
	}
	$scope.paginaActualc=1;
	$scope.llenarPagsClient=function(){
		var inicioc=0;
		if($scope.paginaActualc>5){
			inicioc=$scope.paginaActualc-5;
		}
		var finc = inicioc+9;
		if(finc>$scope.maxPagec){
			finc=$scope.maxPagec;
		}
		$scope.paginasc=[];
		console.log("Numero de Pagina",$scope.paginasc);
		for(var i = inicioc; i< finc; i++){
			$scope.paginasc.push(i+1);
		}
		for(var i = inicioc; i<= finc; i++){
			$('#pagCA'+i).removeClass("active");
			$('#pagCB'+i).removeClass("active");
		}
		$('#pagCA'+$scope.paginaActualc).addClass("active");
		$('#pagCB'+$scope.paginaActualc).addClass("active");
	}
	$scope.cargarPaginac=function(pag){
		if($scope.paginaActualc!=pag){
			$scope.paginaActualc=pag;
			$scope.cargarmovClientes(pag);
		}
	}
	$scope.cargarmovClientes=function(pag){
		movService.getDataPage(pag,$scope.datos.idCliente).then(function(data) {
			$scope.mov = data;
			console.log("Movimiento Cliente",$scope.mov);
			$scope.loadcb();
			$scope.llenarPagsClient();
			
	});
	}
	$scope.paginaCliente=function(){
	movService.getPaginasCliente($scope.datos.idCliente).then(function(data){
		$scope.maxPagec=data;
		$scope.llenarPagsClient();
	});
	}
	$scope.filtroCliente=function(){
		$scope.mostrarCliente();
		$scope.paginaCliente();
		$scope.cargarmovClientes($scope.paginaActualc);
		$scope.buscaClient="";
		}
//	FIN DE FILTRO CLIENTE/BROKER
	
//	INICIO FILTRO EMPRESA
	$scope.$watch('buscaEmpresa',function(){
			$scope.zEmpresa();
	},true);
	$scope.zEmpresa=function(){
		ordenTrabajoservice.searchEmpresa($scope.buscaEmpresa).then(function(data){
			
			$scope.found=[];
			for(var i=0; i< data.length; i++){
				$scope.found.push(data[i].nombre);
				
			}
			$scope.Empresa=data;
//			$scope.tipos=data.tipos;
			
			$('#searchEmpresa').typeahead({

			    source: $scope.found,

			    updater:function (item) {
			    	var em=$scope.found.indexOf(item);
			    	$scope.datos.idEmpresa= $scope.Empresa[em].id;
			    	$scope.empresa=$scope.Empresa[em].nombre;
			    	console.log("Empresa Seleccionada",$scope.empresa);
			        return item;
			    }
			
			});
			$('#searchEmpresa').data('typeahead').source=$scope.found;
		});
	}
//	$scope.filtroEmpresa=function(){
//		
//		$scope.paginaEmpresa();
//		$scope.cargarmovClientes($scope.paginaActuale);
//
//		}
	$scope.paginaEmpresa=function(){
		movService.getPaginasEmpresa($scope.empresa).then(function(data){
			$scope.maxPagee=data;
			$scope.llenarPagsEmpresa();
		});
		}
	
	$scope.paginaActuale=1;
	$scope.llenarPagsEmpresa=function(){
		var inicioe=0;
		if($scope.paginaActuale>5){
			inicioe=$scope.paginaActuale-5;
		}
		var fine = inicioe+9;
		if(fine>$scope.maxPagee){
			fine=$scope.maxPagee;
		}
		$scope.paginase=[];
		console.log("Numero de Pagina",$scope.paginase);
		for(var i = inicioe; i< fine; i++){
			$scope.paginase.push(i+1);
		}
		for(var i = inicioe; i<= fine; i++){
			$('#pagEA'+i).removeClass("active");
			$('#pagEB'+i).removeClass("active");
		}
		$('#pagEA'+$scope.paginaActuale).addClass("active");
		$('#pagEB'+$scope.paginaActuale).addClass("active");
	}
	$scope.filtroEmpresa=function(){
		$scope.mostrarEmpresa();
		$scope.paginaEmpresa();
		$scope.cargarmovEmpresa($scope.paginaActuale);
		$scope.buscaEmpresa="";

		}
	$scope.cargarmovEmpresa=function(pag){
		movService.getDataEmpresaPage($scope.paginaActuale,$scope.empresa).then(function(data) {
			$scope.mov = data;
			console.log("Moviemiento Empresa",$scope.mov);
			$scope.loadcb();
			$scope.llenarPagsEmpresa();
			
	});
	}
	$scope.cargarPaginae=function(pag){
		if($scope.paginaActuale!=pag){
			$scope.paginaActuale=pag;
			$scope.cargarmovEmpresa(pag);
		}
	}
//	FIN FILTRO EMPRESA
	$scope.loadcb=function(){
		$scope.cbk=null;
		var o=0;
		movService.loadCliente().then(function(data){
			$scope.cbk=data;
//			console.log($scope.cbk);
		for(var x = 0; x < $scope.mov.length; x++){
			
			for(var i = 0; i< $scope.cbk.length; i++){
//				console.log($scope.mov[x].idCliente,"=",$scope.cbk[i].id)
				
				if($scope.mov[x].idCliente==$scope.cbk[i].id){
					$scope.mov[x].idCliente=$scope.cbk[i].nickname;
					o++;
//					console.log("Conversion: ",$scope.mov[x].idCliente)
					
				}
			
			}
			}
		})
		
		
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
		console.log("Numero Paginas sin filtro", $scope.paginas);
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

	movService.getPaginas($scope.paginaActual).then(function(data){
		$scope.maxPage=data;
		$scope.llenarPags();
	});
	$scope.cargarPagina=function(pag){
		if($scope.paginaActual!=pag){
			$scope.paginaActual=pag;
			$scope.cargamov(pag);
		}
	}
	$scope.cargamov=function(data){
		movService.load(data).then(function(data) {
			$scope.mov = data;
			console.log($scope.mov);
			$scope.loadcb();
			$scope.llenarPags();
			
	});
	}
	$scope.cargamov(1);
	
	
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


	
