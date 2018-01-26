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
	this.consultarClientesTodos = function() {
		var d = $q.defer();
		$http.get("/clientes/getPagina/1").then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
				//$location.path("/login");
			}
		});
		return d.promise;
	}
	
	this.consultarCuentasCliente = function(id) {
		var d = $q.defer();
		$http.get("/cuentasCliente/todas/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	} 
	
	this.consultarCuentas = function(banco){
		var d = $q.defer();
		$http.get("/cuentas/getTipo/"+banco).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;		
	}
	
	this.loadot = function(id) {
		var d = $q.defer();
	
		$http.get("/ots/find/"+id).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.addot=function(ot){
		var d = $q.defer();
		$http.post("ots/add/",ot).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.updateot=function(ot){
		var d = $q.defer();
		$http.post("ots/update/",ot).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);

app.controller("OTsAddController",['$scope','$cookieStore', '$window', '$location', 'ordenTrabajoservice','cuentaservice', function($scope, $cookieStore, $window, $location, ordenTrabajoservice,cuentaservice){
	$scope.tablaPagos= false;
	$scope.tablaOper= false;
	$scope.tablaOperAsesor=false;
	$scope.cuentas=null;
	$scope.montoRetorno=null;
	$scope.montosTotal=null;
	$scope.brokers = [{id:1, nombre: "Broker1", porBrok: null,montoBrok: null }];
	$scope.operacion = {tipo: null, descripcion: null , monto: null, estatus:null};
	
	
	$scope.pago={
			fechaPago: new Date(),
			moneda:"MXN",
			cuenta:"",
			banco:"",
			monto: null,
	}
	
	$scope.datos={
			estatus: "activo",
			idCliente: "",
			nombreCliente: "",
			fechaInicio: new Date(),
			iva: null,
			importe: 0.0,
			total: 0.0,
			porLic : null,
			porDes : null,
			porBrok: [],
			montoLic : null,
			montoDes : null,
			montoBrok:[],
			retorno: null,
			saldoMov: null,
			saldoCom: null,
	}
	
	$scope.tiposOp = [{id:1, nombre: "20-Transfer"},{id:2, nombre: "40-Resguardo"} ,{id:3, nombre: "60-Efectivo"}];
	
	$scope.operaciones={
		tipo: null,
		descripcion: null,
		monto: null,
		estatus: "ACTIVO",
		cuenta: null,
		banco:null,
		fecha: null
	}
	
	$scope.otVO={
			ot: null,
			pagos:[],
			movimientos:[],	
			comisiones:[]
	}

	$scope.addPago=function(){
		for(var i in $scope.cliente){
			if($scope.cliente[i].id == $scope.datos.idCliente){
				$scope.datos.nombreCliente = $scope.cliente[i].nickname;
			}
		}
		var renglon= {cliente:$scope.datos.nombreCliente, fpago:$scope.pago.fechaPago,banco:$scope.pago.banco, cuenta:$scope.pago.cuenta, monto:$scope.pago.monto, moneda:$scope.pago.moneda}
		$scope.otVO.pagos.push(renglon);
		$scope.tablaPagos=true;
		$scope.limpiaPago();
		$scope.calcularImporte();
		$scope.calcularMontos('Todos');
		//$scope.calcularRetorno();
	}
	
	$scope.addBroker = function(){
		var cont = $scope.brokers.length;
		cont = cont + 1;
		var nombre =  'Broker' + cont ;
		var renglon= {nombre:nombre, porBrok: null , montoBrok:null}
		$scope.brokers.push(renglon);
	}
	
	$scope.addOperacion= function(){
		if($scope.operaciones.tipo != null && $scope.operaciones.descripcion != null && $scope.operaciones.monto != null){
			var renglon= {tipo: $scope.operaciones.tipo, descripcion: $scope.operaciones.descripcion , monto:$scope.operaciones.monto, estatus:$scope.operaciones.estatus}
			$scope.otVO.movimientos.push(renglon);
			$scope.tablaOper="true";
			$scope.operaciones.tipo=null;
			$scope.operaciones.descripcion=null;
			$scope.operaciones.monto=null;
			$scope.datos.saldoMov= calcularSaldo($scope.otVO.movimientos,$scope.montoRetorno,$scope.datos.importe);
		}else{
			alert("No se registraron datos");
		}
	}
	
	$scope.addOperAsesor= function(){
		if($scope.operaciones.tipo != null && $scope.operaciones.descripcion != null && $scope.operaciones.monto != null){
			var renglon= {tipo: $scope.operaciones.tipo, descripcion: $scope.operaciones.descripcion , monto:$scope.operaciones.monto, estatus:$scope.operaciones.estatus}
			$scope.otVO.comisiones.push(renglon);
			$scope.tablaOperAsesor="true";
			$scope.operaciones.tipo=null;
			$scope.operaciones.descripcion=null;
			$scope.operaciones.monto=null;
			$scope.datos.saldoCom=calcularSaldo($scope.otVO.comisiones,$scope.montosTotal,$scope.datos.importe);
		}else{
			alert("No se registraron datos");
		}
	}
	
	
	ordenTrabajoservice.consultarClientesTodos().then(function(data) {
		$scope.cliente = data;
	});
	
	$scope.Cuentas = function() {
		 ordenTrabajoservice.consultarCuentas($scope.pago.banco).then(function(data){
			 $scope.cuentas= data;
		 }); 
	};
	
	$scope.redondea=function(valor){
		var aux= valor;
		aux= aux.toFixed(2);
		return aux;
	}
	
	$scope.calcularImporte=function(){
		var sumaMontoPagos = 0;
		for(var i in $scope.otVO.pagos){
			sumaMontoPagos= sumaMontoPagos + $scope.otVO.pagos[i].monto;
		}
		$scope.datos.total= sumaMontoPagos
		$scope.datos.importe = $scope.redondea(sumaMontoPagos / 1.16 );
		$scope.datos.iva= $scope.redondea(sumaMontoPagos - $scope.datos.importe);
	}
	
	$scope.calcularComisiones=function(param){
		if($scope.tablaPagos== true){
			$scope.calcularMontos(param);
			if($scope.datos.porLic != null && $scope.datos.porDes != null){
				for( var i in $scope.brokers){
					if($scope.brokers[i].porBrok == null){
						return;
					}else{
						$scope.calcularRetorno();
					}
				}
			}else{
		    	return;
		    }			
		}else{
			alert("No se han registrado pagos.")
			$scope.limpiaComisiones()
		}
	}
	
	$scope.calcularMontos=function(modelo){
			switch(modelo) {
		    case 'Lic' :
		    	$scope.datos.montoLic = $scope.redondea(($scope.datos.porLic/100)*$scope.datos.importe);
		        break;
		    case 'Des':
		    	$scope.datos.montoDes = $scope.redondea(($scope.datos.porDes/100)*$scope.datos.importe);
		        break;
		    case 'Broke':
		    	for( var i in $scope.brokers){
	    			$scope.brokers[i].montoBrok = $scope.redondea(($scope.brokers[i].porBrok/100)*$scope.datos.importe);
	    		}
		        break;
		    case 'Todos':
		    	$scope.datos.montoLic = $scope.redondea(($scope.datos.porLic/100)*$scope.datos.importe);
		    	$scope.datos.montoDes = $scope.redondea(($scope.datos.porDes/100)*$scope.datos.importe);
		    	for( var i in $scope.brokers){
	    			$scope.brokers[i].montoBrok = $scope.redondea(($scope.brokers[i].porBrok/100)*$scope.datos.importe);
	    		}
		       
		    	break;
		     default:
		    	 return;
			}	
	}
	
	$scope.calcularRetorno= function(){
		var totalPor=0;
		var sumaBrok =0;
		var sumaMontoBrok =0;
		
		for( var i in $scope.brokers){
			sumaBrok= sumaBrok + $scope.brokers[i].porBrok;
			sumaMontoBrok= parseInt(sumaMontoBrok) + parseInt($scope.brokers[i].montoBrok);
		}

		var retorno = 16-$scope.datos.porLic- $scope.datos.porDes- sumaBrok;
		if(retorno > 0 ){
			$scope.datos.retorno= retorno;
			$scope.montoRetorno=$scope.redondea(($scope.datos.retorno/100)*$scope.datos.importe);
			$scope.montosTotal = parseFloat($scope.datos.montoLic)+ parseFloat($scope.datos.montoDes) + parseFloat(sumaMontoBrok) + parseInt($scope.montoRetorno);
			//$scope.redondea($scope.montosTotal);
			totalPor=$scope.datos.porLic + $scope.datos.porDes + sumaBrok + $scope.datos.retorno;
			
			if(totalPor != 16){
				alert("Error en asignacion de porcentajes.");
    			$scope.datos.retorno= null;
			}
		}else{
			alert("Error en asignacion de porcentajes.");
			$scope.datos.retorno= null; 
		}	
	}	
	
//	$scope.calcularSaldo=function(operacion){
//		var sumatoria= 0;
//		var arreglo = null;
//		var monto=null;
//		if(operacion=="OPC"){
//			for(var i in $scope.otVO.movimientos){
//				 sumatoria= sumatoria + $scope.otVO.movimientos[i].monto; 
//			}
//			$scope.datos.saldoMov= $scope.redondea((parseInt($scope.montoRetorno) + parseInt($scope.datos.importe)) - sumatoria);
//		}else{
//			for(var i in $scope.otVO.comisiones){
//				 sumatoria= sumatoria + $scope.otVO.comisiones[i].monto; 
//			}
//			$scope.datos.saldoCom= $scope.redondea((parseInt($scope.montosTotal) + parseInt($scope.datos.importe)) - sumatoria);
//		} 
//	}
	
	$scope.eliminarRenglon=function(renglon){
		$scope.otVO.pagos.splice(renglon, 1);
		if($scope.otVO.pagos.length == 0){
			$scope.tablaPagos=false;
			$scope.LimpiarTodo();
		}else{
			$scope.calcularImporte();
			$scope.calcularMontos('Todos');
		}

	}
	
	$scope.guardarOT=function(){
		if($scope.tablaPagos == true){
			if($scope.datos.porLic != null || $scope.datos.porDes != null || $scope.datos.porBrok.length != 0){
					for(var i in $scope.brokers){
						$scope.datos.porBrok.push($scope.brokers[i].porBrok);
						$scope.datos.montoBrok.push($scope.brokers[i].montoBrok);
					}
					$scope.otVO.ot = $scope.datos;
					console.log($scope.otVO);
					ordenTrabajoservice.addot($scope.otVO).then(function(data){
						showAlert("Alta de Orden de trabajo Exitosa");
						$location.path("/listaOTs");
						$window.location.reload();
					});
			}else{
				alert("No hay Comisiones registradas"); 
			}	
		}else{
			alert("No hay Pagos registrados");
		}
		
	};
	
	$scope.limpiaComisiones=function(){
		$scope.datos.porLic = null;
		$scope.datos.porDes =null;
		$scope.datos.montoLic= null;
		$scope.datos.montoDes= null;
		$scope.datos.retorno= null;
		for( var i in $scope.brokers){
			$scope.brokers[i].porBrok =null;
			$scope.brokers[i].montoBrok =null;
		}	
	}
	$scope.limpiaPago=function(){
		//$scope.datos.idCliente="";
		$scope.pago.fechaPago= new Date();
		$scope.pago.moneda="MXN";
		$scope.pago.cuenta="";
		$scope.pago.banco="";
		$scope.pago.monto= null;
	}
	
	$scope.LimpiarTodo=function(){
		$scope.tablaPagos=false;
		$scope.tablaOper=false;
		$scope.tablaOperAsesor=false;
		$scope.datos.importe= null;
		$scope.datos.total= null;
		$scope.datos.iva = null;
		$scope.otVO.pagos= [];
		$scope.otVO.movimientos=[];
		$scope.otVO.comisiones=[];
		$scope.limpiaPago();
		$scope.limpiaComisiones();
		
	}
	
//	$scope.reload = function(){	
//		$location.path("/altaOTs");
//		$window.location.reload();
//	}
	
}]);


app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice',function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice){
	var indice = null;
	var tipoOperacion= null;
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
	
	ordenTrabajoservice.loadot($cookieStore.get("idOt")).then(function(data){
		$scope.otvo= data;
		if($scope.otvo.responsable.perfil=="Ejecutivo"){
			$scope.perfil=true;
		}
		var sumaMontoPagos =0;
		var sumaMontoBrok =0;
		for(var i in $scope.otvo.pagos){
			var sumaMontoPagos= sumaMontoPagos + $scope.otvo.pagos[i].monto;
		}
		$scope.iva= (sumaMontoPagos - $scope.otvo.ot.importe).toFixed(2);
		$scope.brokers = [];
		for(var i in $scope.otvo.ot.porBrok){
			var cont= parseInt(i) + parseInt(1);
			var nombre =  'Broker' + cont ;
			var renglon= {nombre:nombre, porBrok:$scope.otvo.ot.porBrok[i], montoBrok: $scope.otvo.ot.montoBrok[i]};
			$scope.brokers .push(renglon);
			sumaMontoBrok= parseInt(sumaMontoBrok) + parseInt($scope.otvo.ot.montoBrok[i]);
		}
		
		$scope.montoRetorno=(($scope.otvo.ot.retorno/100)*$scope.otvo.ot.importe).toFixed(2);
		$scope.montosTotal = parseInt($scope.otvo.ot.montoLic)+ parseInt($scope.otvo.ot.montoDes) + parseInt(sumaMontoBrok) + parseInt($scope.montoRetorno);
		
		$scope.cancelarOp = function(index,	operacion){
			if(operacion=="OPC"){
				$scope.otvo.movimientos[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoMov=calcularSaldo($scope.otvo.movimientos,$scope.montoRetorno,$scope.otvo.ot.importe);
			}
			if(operacion=="OPA"){
				$scope.otvo.comisiones[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoCom=calcularSaldo($scope.otvo.comisiones,$scope.montosTotal,$scope.otvo.ot.importe);
			}
		}
		
		
	});	
	
	$scope.cargarMov=function(index, operacion){
		if(operacion=="OPC"){
			$scope.mov.tipo=$scope.otvo.movimientos[index].tipo;
			$scope.mov.monto=$scope.otvo.movimientos[index].monto;
			$scope.mov.descripcion=$scope.otvo.movimientos[index].descripcion;
			$scope.mov.banco=$scope.otvo.movimientos[index].banco;
			$scope.mov.cuenta=$scope.otvo.movimientos[index].cuenta;
		}else{
			$scope.mov.tipo=$scope.otvo.comisiones[index].tipo;
			$scope.mov.monto=$scope.otvo.comisiones[index].monto;
			$scope.mov.descripcion=$scope.otvo.comisiones[index].descripcion;
			$scope.mov.banco=$scope.otvo.comisiones[index].banco;
			$scope.mov.cuenta=$scope.otvo.comisiones[index].cuenta;
		}
		indice=index;
		tipoOperacion=operacion;
	};

	$scope.Cuentas = function() {
		 ordenTrabajoservice.consultarCuentas($scope.mov.banco).then(function(data){
			 $scope.cuentas= data;
		 }); 
	};
	
	$scope.updateMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].banco=$scope.mov.banco;
			$scope.otvo.movimientos[indice].cuenta=$scope.mov.cuenta;
		}else{
			$scope.otvo.comisiones[indice].banco=$scope.mov.banco;
			$scope.otvo.comisiones[indice].cuenta=$scope.mov.cuenta;
		}
		$scope.limpiarMov();
	}
	
	$scope.validMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.movimientos[indice].fecha=$scope.mov.fecha;
			$scope.otvo.movimientos[indice].estatus="VALIDADO"
		}else{
			$scope.otvo.comisiones[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.comisiones[indice].fecha=$scope.mov.fecha;
			$scope.otvo.comisiones[indice].estatus="VALIDADO"
		}
		$scope.limpiarMov();
	}
	
	$scope.actualizar=function(){
		ordenTrabajoservice.updateot($scope.otvo).then(function(data){
			showAlert("Se guardó la Orden de trabajo",$window);
			$location.path("/listaOTs");
			$window.location.reload();
		})
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
	
}]);	
