function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function(){ window.location.reload(); }, 3000);
}

app.service("CBService",['$http', '$q', function($http, $q){
	this.data=function(data){
		var dataClient={};
	}; 
	
	this.loadCliente = function(id) {
		var d = $q.defer();
	
		$http.get("/ots/getClientesBrokers/").then(function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.loadBrocker=function(id){
		var d = $q.defer();
		$http.get("/brockers/buscarID/"+id).then(function(response) {
			d.resolve(response.data);
		}, function(response) {
			if(response.status==403){
				alert("No tiene permiso de realizar esta acción");
			}
		});
		return d.promise;
	}
	
	this.consultarClientesTodos = function() {
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
	
	this.loadPendientes = function(page) {
		var d = $q.defer();
	
		$http.get("/movimientos/load/"+page).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	this.getPaginasPendientes = function(page) {
		var d = $q.defer();
	
		$http.get("/movimientos/paginas").then(
			function(response) {
				d.resolve(response.data);
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
	this.loadotPend = function(id) {
		var d = $q.defer();
	
		$http.get("/movimientos/find/"+id).then(
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
	
	this.addMov=function(otvo){
		var d = $q.defer();
		$http.post("ots/addMovimiento/",otvo).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.updateot=function(mov){
		var d = $q.defer();
		$http.post("movimientos/update/",mov).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.guardaBrocker=function(brocker){
		var d = $q.defer();
		$http.post("brockers/guardar/",brocker).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.guardaCliente=function(clientes){
		var d = $q.defer();
		$http.post("clientes/guardar/",clientes).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
}]);

app.service("operacionesMovimientosService",['$http', '$q', function($http, $q){
	objetos= {otvo:null, c:null, b:null};
	this.addOper= function(operacion, operaciones, otVO, bndResguardo,cliente, brockerCliente){
		if(operaciones.tipo == 'Cheque'){
			if(operaciones.montoLetra != null && operaciones.fEmision && operaciones.pagarA && operaciones.tipo != null && operaciones.descripcion != null && operaciones.monto != null){
				var renglon= {tipo: operaciones.tipo, descripcion: operaciones.descripcion , monto: operaciones.monto, estatus:operaciones.estatus, 
								montoLetra: operaciones.montoLetra, fEmision:operaciones.fEmision, pagarA:operaciones.pagarA}
			}else{
				alert("Faltan campos por llenar");
			}
		}else{
			if(bndResguardo){
				var renglon= {tipo: operaciones.tipo, descripcion: operaciones.descripcion , monto: operaciones.monto, estatus:"VALIDADO"}
			}else{
				if(operaciones.tipo != null && operaciones.descripcion != null && operaciones.monto != null){
					var renglon= {tipo: operaciones.tipo, descripcion: operaciones.descripcion , monto:operaciones.monto, estatus:operaciones.estatus}
				}else{
					alert("Faltan campos por llenar");
				}
			}
		}
		
		if(operacion=='OPC'){
			cliente.saldo = cliente.saldo + operaciones.monto;
			otVO.movimientos.push(renglon);
		}else{
			brockerCliente.saldo = brockerCliente.saldo + operaciones.monto;
			otVO.comisiones.push(renglon);
		}
		objetos.otvo=otVO;
		objetos.c= cliente;
		objetos.b= brockerCliente;
		return objetos;
	} 
	
//	this.isResguardo=function(operacion, operaciones,bndResguardo, datos){
//		objetos={op: null,datos: null, resguardo:null}
//		if(operaciones.tipo=='Resguardo'){
//			var mensaje = confirm("Esta opci\u00F3n mueve el saldo actual a la cuenta de resguardo.. Deseas continuar?");
//			if (mensaje) {
//				bndResguardo = true;
//				if(operacion=='OPC'){
//					datos.saldoMov= datos.saldoMov * 1;					
//					if(datos.saldoMov > 0){
//						operaciones.monto= datos.saldoMov;
//						operaciones.descripcion= "Se va saldo a cuenta de resguardo";
//						datos.saldoMov= 0;
//					}else{
//						alert("No se tiene saldo acumulado");
//						bndResguardo = false;
//						operaciones.descripcion ="";
//					}
//				}else{
//					datos.saldoCom= datos.saldoCom * 1;	
//					if(datos.saldoCom > 0){
//						operaciones.monto= datos.saldoCom;
//						operaciones.descripcion= "Se va saldo a cuenta de resguardo";
//						datos.saldoCom= 0;
//					}else{
//						alert("No se tiene saldo acumulado");
//						bndResguardo = false;
//						operaciones.descripcion ="";
//					}
//				}
//			}
//		}else{
//			operaciones.descripcion ="";
//			bndResguardo = false;
//		}
//		objetos.op= operaciones;
//		objetos.datos= datos;
//		objetos.resguardo= bndResguardo;
//		return objetos;
//	}
	
	this.detalleCheque=function(index, operacion, otVO, cheque){
		if(operacion == 'OPC'){
			cheque.fEmision=otVO.movimientos[index].fEmision;
			cheque.pagarA=otVO.movimientos[index].pagarA;
			cheque.monto=otVO.movimientos[index].monto;
			cheque.montoLetra=otVO.movimientos[index].montoLetra;
		}
		if(operacion == 'OPA'){
			cheque.fEmision=otVO.comisiones[index].fEmision;
			cheque.pagarA=otVO.comisiones[index].pagarA;
			cheque.monto=otVO.comisiones[index].monto;
			cheque.montoLetra=otVO.comisiones[index].montoLetra;
		}
		return cheque;
	}
	
	this.verificarSaldo=function(operacion, otvo, ot,operaciones,monto,suma){
		objetos={ error: null, saldo:null};
		var cantidad = 0;
		if(operacion== 'OPC'){
			if(otvo.movimientos.length != 0){
				cantidad= calcularSaldo(operaciones.monto,otvo.movimientos,monto,ot.importe);
			}else{
				cantidad= ((parseFloat(monto) + parseFloat(ot.importe)) - operaciones.monto).toFixed(2);
			}
		}else{
			if(otvo.comisiones.length != 0){
				cantidad=calcularSaldo(operaciones.monto,otvo.comisiones,suma,0);
			}else{
				cantidad= (parseFloat(suma) - parseFloat(operaciones.monto)).toFixed(2);
			}
			
		}
		if(cantidad > 0 ){
			objetos.saldo= cantidad;
			objetos.error= " ";
		}else{
			objetos.error="";
		}
		
		return objetos;
	}
	
}]);

app.controller("CAController",['$scope','$cookieStore', '$window', '$location', 'CBService','cuentaservice','operacionesMovimientosService',function($scope, $cookieStore, $window, $location, CBService,cuentaservice,operacionesMovimientosService){
	$scope.bancos = catalogoBancos();
	$scope.tablaPagos= false;
	$scope.tablaOper= false;
	$scope.tablaOperAsesor=false;
	$scope.cuentas=null;
	$scope.montoRetorno=null;
	$scope.montosTotal=null;
	$scope.brokers = [{id:1, nombre: "Broker1", porBrok: null,montoBrok: null }];
	$scope.operacion = {tipo: null, descripcion: null , monto: null, estatus:null};
	$scope.errorSaldo=" ";
	$scope.tipoResguardo = false;
	$scope.tiposOp = TiposOperacion();
	$scope.clienteSeleccionado=false;
	
	$scope.pago={
			fecha: new Date(),
			moneda:"MXN",
//			cuenta:"",
//			banco:"",
			monto: null,
	}
	
	$scope.datos={
			estatus: "activo",
			idCliente: null,
			idBrocker: null,
			nombreCliente: null,
			fechaInicio: new Date(),
			iva: null,
			importe: 0.0,
			total: 0.0,
//			porLic : null,
//			porDes : null,
//			porBrok: [],
//			montoLic : null,
//			montoDes : null,
//			montoBrok:[],
//			retorno: null,
			saldoMov: null,
//			saldoCom: null,
//			totalComisiones: null,
	}
	
	$scope.operaciones={
		tipo: null,
		descripcion: null,
		monto: null,
		estatus: "ACTIVO",
		cuenta: null,
		banco:null,
		fecha: new Date(),
		montoLetra: null,
		pagarA: null,
		fEmision: new Date(),
	}
	
	$scope.otVO={
			ot: null,
			pagos:[],
			movimientos:[],	
			//comisiones:[],
			cliente: null,
			broker: null
	}
	
	$scope.cheque={
			fEmision: null,
			pagarA:null,
			monto:null,
			montoLetra:null
	}
	
	$scope.addPago=function(){
		if($scope.datos.nombreCliente == null){
			datosCliente();
		}
		var renglon= {cliente:$scope.datos.nombreCliente, fecha:$scope.pago.fecha, banco:$scope.pago.banco, cuenta:$scope.pago.cuenta, monto:$scope.pago.monto, moneda:$scope.pago.moneda}
		$scope.otVO.pagos.push(renglon);
		$scope.tablaPagos=true;
		$scope.limpiaPago();
		$scope.clienteSeleccionado=true;
		$scope.calcularImporte();
		$scope.calcularMontos('Todos');
		if($scope.otVO.pagos.length == 0){
			$scope.calcularRetorno();
		}
		
	}
	
	function datosCliente(){
		for(var i in $scope.cliente){
			if($scope.cliente[i].id == $scope.datos.idCliente){
				$scope.datosCliente = $scope.cliente[i];
			}
		}

		$scope.datos.nombreCliente = $scope.datosCliente.nickname;
		$scope.datos.idBrocker = $scope.datosCliente.idBrocker;
		CBService.loadBrocker($scope.datos.idBrocker).then(function(data){
			 $scope.brockerCliente= data;
		 }); 
	}
	
	$scope.addBroker = function(){
		var cont = $scope.brokers.length;
		cont = cont + 1;
		var nombre =  'Brocker' + cont ;
		var renglon= {nombre:nombre, porBrok: null , montoBrok:null}
		$scope.brokers.push(renglon);
	}
	
	$scope.verificarSaldo=function(operacion){
		var objs= operacionesMovimientosService.verificarSaldo(operacion, $scope.otVO, $scope.datos, $scope.operaciones,$scope.montoRetorno,$scope.sumaMontoBrok);
		$scope.errorSaldo= objs.error;
		if(operacion =='OPC'){
			$scope.datos.saldoMov = objs.saldo;
		}else{
			$scope.datos.saldoCom = objs.saldo;
		}
		
	}
	$scope.getIndex=function(){
		var x = document.getElementById("bc").selectedIndex;
		$scope.cb=$scope.cliente[x];
		$scope.cb.fecha=new Date();
		$scope.cb.moneda="MXN";
		console.log($scope.cb);
		}
	CBService.consultarClientesTodos().then(function(data) {
		$scope.cliente = data;
	});
	
	$scope.Cuentas = function() {
		 CBService.consultarCuentas($scope.pago.banco).then(function(data){
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
		$scope.sumaMontoBrok =0;
		
		for( var i in $scope.brokers){
			sumaBrok= sumaBrok + $scope.brokers[i].porBrok;
			$scope.sumaMontoBrok= parseFloat($scope.sumaMontoBrok) + parseFloat($scope.brokers[i].montoBrok);
		}

		var retorno = 16-$scope.datos.porLic- $scope.datos.porDes- sumaBrok;
		if(retorno > 0 ){
			$scope.datos.retorno= retorno;
			$scope.montoRetorno=$scope.redondea(($scope.datos.retorno/100)*$scope.datos.importe);
			$scope.montosTotal = parseFloat($scope.datos.montoLic)+ parseFloat($scope.datos.montoDes) + parseFloat($scope.sumaMontoBrok) + parseInt($scope.montoRetorno);
			$scope.datos.totalComisiones=$scope.redondea($scope.montosTotal);
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
	

	$scope.addOper= function(operacion){
		var objs=operacionesMovimientosService.addOper(operacion,$scope.operaciones, $scope.otVO, $scope.tipoResguardo,$scope.datosCliente,$scope.brockerCliente);
		$scope.otVO= objs.otvo;
		$scope.datosCliente = objs.c;
		$scope.brockercliente= objs.b;
		if(operacion=='OPC'){
			$scope.tablaOper=true;
		}else{
			$scope.tablaOperAsesor=true;
		}
		$scope.limpiaOperaciones();	
	} 

//	$scope.isResguardo=function(operacion){
//		$scope.errorSaldo="";
//		var objs= operacionesMovimientosService.isResguardo(operacion, $scope.operaciones,$scope.tipoResguardo, $scope.datos);
//		$scope.operaciones= objs.op;
//		$scope.datos= objs.datos;
//		$scope.tipoResguardo=objs.resguardo;
//	}
	
	$scope.detalleCheque=function(index, operacion){
		$scope.cheque =operacionesMovimientosService.detalleCheque(index, operacion, $scope.otVO, $scope.cheque);
	}

	
	$scope.guardarOT=function(){
		if($scope.tablaPagos == true){

				if($scope.tablaOper == true){
//					for(var i in $scope.brokers){
//						$scope.datos.porBrok.push($scope.brokers[i].porBrok);
//						$scope.datos.montoBrok.push($scope.brokers[i].montoBrok);
//					}
					if($scope.datosCliente.saldo != null || $scope.datosCliente.saldo != 0){
						$scope.otVO.cliente = $scope.datosCliente;
					}
					if($scope.brockerCliente.saldo != null || $scope.brockerCliente.saldo != 0){
						$scope.otVO.broker = $scope.brockerCliente;
					}
					$scope.otVO.ot = $scope.datos;
					console.log($scope.otVO);
					
					CBService.addot($scope.otVO).then(function(data){
						showAlert("Alta de Orden de trabajo Exitosa");
						$location.path("/listaOTs");
						$window.location.reload();
					});
					
				}else{
					alert("No hay Instrucciones deOperacion Registradas"); 
				}
			
		}else{
			alert("No hay Pagos registrados");
		}
		
	};
	
	$scope.limpiaOperaciones= function(){
		$scope.operaciones.tipo= null;
		$scope.operaciones.descripcion= null;
		$scope.operaciones.monto= null;
		$scope.operaciones.montoLetra= null;
		$scope.operaciones.pagarA= null;
		$scope.operaciones.fEmision= null;
		$scope.errorSaldo=" ";
	}
	
	$scope.limpiaComisiones=function(){
		$scope.datos.porLic = null;
		$scope.datos.porDes =null;
		$scope.datos.montoLic= null;
		$scope.datos.montoDes= null;
		$scope.datos.retorno= null;
		$scope.datos.totalComisiones =  null;
		for( var i in $scope.brokers){
			$scope.brokers[i].porBrok =null;
			$scope.brokers[i].montoBrok =null;
		}	
	}
	$scope.limpiaPago=function(){
		$scope.pago.fecha= new Date();
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
		$scope.datos.retorno =  null;
		$scope.otVO.pagos= [];
		$scope.otVO.movimientos=[];
		$scope.otVO.comisiones=[];
		$scope.limpiaPago();
		$scope.limpiaComisiones();
	}
	
}]);


	
