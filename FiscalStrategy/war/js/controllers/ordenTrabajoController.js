function showAlert(mensaje, window){
	var x = document.getElementById("snackbar")
    x.className = "show";
	x.textContent=mensaje;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
 //   setTimeout(function(){ window.location.reload(); }, 3000);
}

app.service("ordenTrabajoservice",['$http', '$q', function($http, $q){
	this.data=function(data){
		var dataClient={};
	}; 
	
	this.loadCliente = function(id) {
		var d = $q.defer();
	
		$http.get("clientes/find/"+id).then(function(response) {
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
	
	this.consultarCuentasPorBanco = function(banco){
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
				console.log("guarda ot");
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.addMov=function(movimientosvo){
		var d = $q.defer();
		$http.post("ots/addMovimiento/",movimientosvo).then(
			function(response) {
				console.log("add mov");
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.updateot=function(mov){
		var d = $q.defer();
		$http.post("movimientos/update/",mov).then(
			function(response) {
				console.log("update mov");
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
				var renglon= {tipo: operaciones.tipo, descripcion: operaciones.descripcion , monto: operaciones.monto, estatus:"AUTORIZADO"}
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
	
	this.isResguardo=function(operacion, operaciones,bndResguardo, datos){
		objetos={op: null,datos: null, resguardo:null}
		if(operaciones.tipo=='Resguardo'){
			var mensaje = confirm("Esta opci\u00F3n mueve el saldo actual a la cuenta de resguardo.. Deseas continuar?");
			if (mensaje) {
				bndResguardo = true;
				if(operacion=='OPC'){
					datos.saldoMov= datos.saldoMov * 1;					
					if(datos.saldoMov > 0){
						operaciones.monto= datos.saldoMov;
						operaciones.descripcion= "Se va saldo a cuenta de resguardo";
						datos.saldoMov= 0;
					}else{
						alert("No se tiene saldo acumulado");
						bndResguardo = false;
						operaciones.descripcion ="";
					}
				}else{
					datos.saldoCom= datos.saldoCom * 1;	
					if(datos.saldoCom > 0){
						operaciones.monto= datos.saldoCom;
						operaciones.descripcion= "Se va saldo a cuenta de resguardo";
						datos.saldoCom= 0;
					}else{
						alert("No se tiene saldo acumulado");
						bndResguardo = false;
						operaciones.descripcion ="";
					}
				}
			}
		}else{
			operaciones.descripcion ="";
			bndResguardo = false;
		}
		objetos.op= operaciones;
		objetos.datos= datos;
		objetos.resguardo= bndResguardo;
		return objetos;
	}
	
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
		var btndisble="false";
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
			btndisble=false;
			
		}else{
			objetos.error="* ERROR: EL monto sobrepasa el saldo establecido *"; 
			btndisble=true;
			console.log(btndisble);
		}
		
		return objetos;
	}
	
}]);

app.controller("OTsAddController",['$route','$scope','$cookieStore', '$window', '$location', 'ordenTrabajoservice','cuentaservice','operacionesMovimientosService','userFactory', function($route, $scope, $cookieStore, $window, $location, ordenTrabajoservice,cuentaservice,operacionesMovimientosService, userFactory){
	$scope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	
	$scope.bancos = catalogoBancos();
	$scope.tablaPagos= false;
	$scope.tablaOper= false;
	$scope.tablaOperAsesor=false;
	$scope.cuentas=null;
	$scope.montoRetorno=null;
	$scope.brokers = [{id:1, nombre: "Broker1", porBrok: null,montoBrok: null }];
	$scope.operacion = {tipo: null, descripcion: null , monto: null, estatus:null};
	$scope.errorSaldo=" ";
	$scope.tipoResguardo = false;
	$scope.tiposOp = TiposOperacion();
	$scope.clienteSeleccionado=false;
	
	$scope.pago={
			fecha: new Date(),
			moneda:"MXN",
			cuenta:"",
			banco:"",
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
			porLic : null,
			porDes : null,
			porBrok: [],
			montoLic : null,
			montoDes : null,
			montoBrok:[],
			retorno: null,
			saldoMov: null,
			saldoCom: null,
			totalComisiones: null,
			tipo: "normal",
			porciento: 16
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
			comisiones:[],
			cliente: null,
			broker: null
	}
	
	$scope.cheque={
			fEmision: null,
			pagarA:null,
			monto:null,
			montoLetra:null
	}
	
	ordenTrabajoservice.consultarClientesTodos().then(function(data) {
		$scope.cliente = data;
	});
	
	$scope.Cuentas = function() {
		 ordenTrabajoservice.consultarCuentasPorBanco($scope.pago.banco).then(function(data){
			 $scope.cuentas= data;
			 console.log(data);
		 }); 
	};
	
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
		//$scope.calcularMontos('Todos');
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
		ordenTrabajoservice.loadBrocker($scope.datos.idBrocker).then(function(data){
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
		var div= ("1." + $scope.datos.porciento)*1;
		$scope.datos.importe = $scope.redondea(sumaMontoPagos / div);
		$scope.datos.iva= $scope.redondea(sumaMontoPagos - $scope.datos.importe);
		$scope.calcularComisiones('Todos');
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
		    	$scope.datos.montoLic=$scope.datos.montoLic*1;

		        break;
		    case 'Des':
		    	$scope.datos.montoDes = $scope.redondea(($scope.datos.porDes/100)*$scope.datos.importe);
		    	$scope.datos.montoDes= $scope.datos.montoDes*1;

		        break;
		    case 'Broke':
		    	for( var i in $scope.brokers){
	    			$scope.brokers[i].montoBrok = $scope.redondea(($scope.brokers[i].porBrok/100)*$scope.datos.importe);
	    			$scope.brokers[i].montoBrok= $scope.brokers[i].montoBrok*1;

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
		$scope.totalPor=0;
		var sumaBrok =0;
		$scope.sumaMontoBrok =0;
		
		for( var i in $scope.brokers){
			sumaBrok= sumaBrok + $scope.brokers[i].porBrok;
			$scope.sumaMontoBrok= $scope.sumaMontoBrok * 1 + $scope.brokers[i].montoBrok * 1;
		}

		var retorno = $scope.datos.porciento-$scope.datos.porLic- $scope.datos.porDes- sumaBrok;
		if(retorno > 0 ){
			$scope.datos.retorno= $scope.redondea(retorno);
			$scope.montoRetorno=$scope.redondea(($scope.datos.retorno/100)*$scope.datos.importe);
			 var montosTotal = ($scope.datos.montoLic * 1)+ ($scope.datos.montoDes * 1) + ($scope.sumaMontoBrok * 1) + ($scope.montoRetorno * 1);
			$scope.datos.totalComisiones=$scope.redondea(montosTotal);
			$scope.totalPor=$scope.datos.porLic + $scope.datos.porDes + sumaBrok + $scope.datos.retorno;
		}else{
			$scope.datos.retorno= null; 
		}	
	}	 
	
	$scope.calcularComisionesM=function(param){
		if($scope.tablaPagos== true){
			$scope.calcularMontosM(param);
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
	
	$scope.calcularMontosM=function(modelo){
			switch(modelo) {
		    case 'Lic' :
		    	$scope.datos.porLic=$scope.redondea(($scope.datos.montoLic * 100)/$scope.datos.importe);
//		    	$scope.datos.montoLic = $scope.redondea(($scope.datos.porLic/100)*$scope.datos.importe);
		    	$("#porLic").val($scope.datos.porLic);
		        break;
		    case 'Des':
		    	$scope.datos.porDes=$scope.redondea(($scope.datos.montoDes * 100)/$scope.datos.importe);
//		    	$scope.datos.montoDes = $scope.redondea(($scope.datos.porDes/100)*$scope.datos.importe);
		    	$("#porDes").val($scope.datos.porDes);
		        break;
		    case 'Broke':
		    	for( var i in $scope.brokers){
		    		$scope.brokers[i].porBrok=$scope.redondea(($scope.brokers[i].montoBrok * 100)/ $scope.datos.importe);
//	    			$scope.brokers[i].montoBrok = $scope.redondea(($scope.brokers[i].porBrok/100)*$scope.datos.importe);
	    			$("#porbroke").val($scope.brokers[i].porBrok);
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
	
	$scope.eliminarRenglon=function(renglon){
		$scope.otVO.pagos.splice(renglon, 1);
		if($scope.otVO.pagos.length == 0){
			$scope.tablaPagos=false;
			$scope.LimpiarTodo();
		}else{
			$scope.calcularImporte();
			//$scope.calcularMontos('Todos');
		}
	}
	$scope.eliminarRenglonICliente=function(renglon){
		$scope.otVO.movimientos.splice(renglon, 1);
		$scope.verificarSaldo('OPC');
		if($scope.otVO.movimientos.length == 0){
			$scope.tablaOper=false;
		}
	}
	$scope.verificaPorcentajes=function(operacion){
		if($scope.datos.retorno == null && $scope.totalPor != $scope.datos.porciento){
			alert("ERROR: Revisar porcentajes asignados");
			$scope.datos.retorno= null;
		}else{
			if(operacion=='OPC'){
				$("#myModalOper").modal();
			}
			if(operacion=='OPA'){
				$("#myModalOperAsesor").modal();
			}
		
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

	$scope.isResguardo=function(operacion){
		$scope.errorSaldo="";
		var objs= operacionesMovimientosService.isResguardo(operacion, $scope.operaciones,$scope.tipoResguardo, $scope.datos);
		$scope.operaciones= objs.op;
		$scope.datos= objs.datos;
		$scope.tipoResguardo=objs.resguardo;
	}
	
	$scope.detalleCheque=function(index, operacion){
		$scope.cheque =operacionesMovimientosService.detalleCheque(index, operacion, $scope.otVO, $scope.cheque);
	}
	
	
	$scope.guardarOT=function(){
		if($scope.tablaPagos == true){
			if($scope.datos.porLic != null || $scope.datos.porDes != null || $scope.datos.porBrok.length != 0){
				if($scope.tablaOper == true && $scope.tablaOperAsesor == true){
					for(var i in $scope.brokers){
						$scope.datos.porBrok.push($scope.brokers[i].porBrok);
						$scope.datos.montoBrok.push($scope.brokers[i].montoBrok);
					}
					if($scope.datosCliente.saldo != null || $scope.datosCliente.saldo != 0){
						$scope.otVO.cliente = $scope.datosCliente;
					}
					if($scope.brockerCliente.saldo != null || $scope.brockerCliente.saldo != 0){
						$scope.otVO.broker = $scope.brockerCliente;
					}
					$scope.otVO.ot = $scope.datos;
					console.log($scope.otVO);
					
					ordenTrabajoservice.addot($scope.otVO).then(function(data){
						showAlert("Alta de Orden de trabajo Exitosa");
						$location.path("/listaOTs");
						 window.location.reload();
					});
					
				}else{
					alert("No hay Instrucciones deOperacion Registradas"); 
				}
			}else{
				alert("No hay Comisiones registradas"); 
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


app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','operacionesMovimientosService','notificacionesService','userFactory',
                                         function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,operacionesMovimientosService,notificacionesService,userFactory){
	$scope.perfilUsuario = userFactory.getUsuarioPerfil();  //obtener perfl de usuario para pintar el menú al qe tiene acceso
	$scope.permiso=true; 
	var indice = null;
	var tipoOperacion= null;
	$scope.tiposOp = TiposOperacion();
	$scope.bancos = catalogoBancos();
	$scope.errorSaldo=" ";
	$scope.tipoResguardo= false;
	$scope.cheque={fEmision: new Date(),pagarA:null,monto:null,montoLetra:null}
	$scope.operaciones={tipo: null, descripcion: null, monto: null, estatus: "ACTIVO", cuenta: null, banco:null,fecha: new Date(),montoLetra: null,pagarA: null,fEmision: new Date()}
	$scope.mov={tipo: null,monto: null,descripcion: null,banco: null,cuenta: null,numTransaccion:null,fecha:new Date(),estatus: null,montoLetra: null,pagarA: null,fEmision: new Date()}
	$scope.movimientosVO={movimiento:null,idOt:null,bndMovimiento:null,saldo:null}
	
	ordenTrabajoservice.loadot($cookieStore.get("idOt")).then(function(data){
		$scope.otvo= data;
		$scope.mont=$scope.otvo.pagos.monto;
		console.log(data);	
		crearListaDeCheques();
		
		var sumaMontoPagos =0;
		 $scope.sumaMontoBrok =0;
		for(var i in $scope.otvo.pagos){
			var sumaMontoPagos= sumaMontoPagos + $scope.otvo.pagos[i].monto;
		}
		if($scope.otvo.ot.tipo !="ca"){
			$scope.tipoOT="general";
			$scope.iva= (sumaMontoPagos - $scope.otvo.ot.importe).toFixed(2);
			$scope.brokers = [];
			for(var i in $scope.otvo.ot.porBrok){
				var cont= parseInt(i) + parseInt(1);
				var nombre =  'Broker' + cont ;
				var renglon= {nombre:nombre, porBrok:$scope.otvo.ot.porBrok[i], montoBrok: $scope.otvo.ot.montoBrok[i]};
				$scope.brokers.push(renglon);
				$scope.sumaMontoBrok= parseInt($scope.sumaMontoBrok) + parseInt($scope.otvo.ot.montoBrok[i]);
			}
			
			$scope.montoRetorno=(($scope.otvo.ot.retorno/100)*$scope.otvo.ot.importe).toFixed(2);
			$scope.montosTotal = parseInt($scope.otvo.ot.montoLic)+ parseInt($scope.otvo.ot.montoDes) + parseInt($scope.sumaMontoBrok) + parseInt($scope.montoRetorno);
		}else{
			$scope.tipoOT="ca";
		}
		
		if($scope.otvo.ot.estatus=="Cerrada"){
			$scope.ordenCerrada= true;
		}else{
			$scope.ordenCerrada=false;
		};
		
		$scope.cancelarOp = function(index,	operacion){
			if(operacion=="OPC"){
				$scope.otvo.movimientos[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoMov=$scope.otvo.ot.saldoMov - $scope.otvo.movimientos[index].monto;
			}
			if(operacion=="OPA"){
				$scope.otvo.comisiones[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoCom=$scope.otvo.ot.saldoCom -$scope.otvo.comisiones[index].monto; 
			}
			if(cerrarOrden()){
				ordenTrabajoservice.addot($scope.otvo).then(function(data){
					if(tipoOperacion=='OPC'){
						ordenTrabajoservice.updateot($scope.otvo.movimientos[index]).then(function(data){
							$window.location.reload();
						});
					}else{
						ordenTrabajoservice.updateot($scope.otvo.comisiones[index]).then(function(data){
							$window.location.reload();
						});
					}
				});
			}else{
				if(tipoOperacion=='OPC'){
					ordenTrabajoservice.updateot($scope.otvo.movimientos[index]).then(function(data){
						$window.location.reload();
					});
				}else{
					ordenTrabajoservice.updateot($scope.otvo.comisiones[index]).then(function(data){
						$window.location.reload();
					});
				}
			}
		}
	});	
	
	function cerrarOrden(){
		var contM=0, contC=0;
		for(var i in $scope.otvo.movimientos){
			if($scope.otvo.movimientos[i].estatus=='AUTORIZADO' || $scope.otvo.movimientos[i].estatus=='CANCELADO'){
				contM++;
			}
		}
		for(var i in $scope.otvo.comisiones){
			if($scope.otvo.comisiones[i].estatus=='AUTORIZADO' || $scope.otvo.comisiones[i].estatus=='CANCELADO'){
				contC++;
			}
		}
		if($scope.otvo.movimientos.length == contM && $scope.otvo.comisiones.length==contC){
			if($scope.otvo.ot.saldoMov==0 || $scope.otvo.ot.saldoMov<0 && $scope.otvo.ot.saldoCom==0 || $scope.otvo.ot.saldoMov<0){
				$scope.otvo.ot.estatus="Cerrada"
				notificacionesService.eliminaNotificaciones($scope.otvo.ot.id);
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	//prepara listado de cheques para impresion
	function crearListaDeCheques(){
		$scope.listaChequesCliente = "";
		$scope.listaChequesAsesor = "";
		for(var i in $scope.otvo.movimientos){
			if($scope.otvo.movimientos[i].tipo == "Cheque"){
				if($scope.listaChequesCliente == ""){
					$scope.listaChequesCliente= $scope.otvo.movimientos[i].id;
				}else{
					$scope.listaChequesCliente= $scope.listaChequesCliente + ',' + $scope.otvo.movimientos[i].id;
				}
			}
		}
		for(var i in $scope.otvo.comisiones){
			if($scope.otvo.comisiones[i].tipo == "Cheque"){
				if($scope.listaChequesAsesor == ""){
					$scope.listaChequesAsesor= $scope.otvo.comisiones[i].id;
				}else{
					$scope.listaChequesAsesor= $scope.listaChequesAsesor + ',' + $scope.otvo.comisiones[i].id;
				}
			}
		}
		console.log($scope.listaChequesCliente);
		console.log($scope.listaChequesAsesor);
	}
	
	//icon editar
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
	}

	$scope.Cuentas = function() {
		 ordenTrabajoservice.consultarCuentasPorBanco($scope.mov.banco).then(function(data){
			 $scope.cuentas= data;
		 }); 
	}
	
	//boton guardar del modal de editar movimiento
	$scope.updateMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].banco=$scope.mov.banco;
			$scope.otvo.movimientos[indice].cuenta=$scope.mov.cuenta;
			ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
				notificacionesService.notificaMovEditado($scope.otvo);
				$window.location.reload();
			});
		}else{
			$scope.otvo.comisiones[indice].banco=$scope.mov.banco;
			$scope.otvo.comisiones[indice].cuenta=$scope.mov.cuenta;
			ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
				notificacionesService.notificaMovEditado($scope.otvo);
				$window.location.reload();
			});
		}
		$scope.limpiarMov();
	}
	
	//icon validar
	$scope.validMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.movimientos[indice].fecha=$scope.mov.fecha;
			$scope.otvo.movimientos[indice].estatus="AUTORIZADO"
		}else{
			$scope.otvo.comisiones[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.comisiones[indice].fecha=$scope.mov.fecha;
			$scope.otvo.comisiones[indice].estatus="AUTORIZADO"
		}
		if(cerrarOrden()){
			ordenTrabajoservice.addot($scope.otvo).then(function(data){
				if(tipoOperacion=='OPC'){
					ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
						$window.location.reload();
					});
				}else{
					ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
						$window.location.reload();
					});
				}
			});
		}else{
			if(tipoOperacion=='OPC'){
				ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
					notificacionesService.notificaMovValidado($scope.otvo);
						$window.location.reload();
				});
			}else{
				ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
					notificacionesService.notificaMovValidado($scope.otvo);
						$window.location.reload();
				});
			}
		}
	}
	
	//Agregar movimientos
	$scope.addOper= function(operacion){
		var objs=operacionesMovimientosService.addOper(operacion,$scope.operaciones, $scope.otvo, $scope.tipoResguardo,$scope.otvo.cliente,$scope.otvo.broker);
		$scope.otvo = objs.otvo;
		$scope.movimientosVO.movimiento=$scope.operaciones;
		$scope.movimientosVO.idOt=$scope.otvo.ot.id;
		if(operacion=="OPC"){
			if($scope.tipoResguardo){
				ordenTrabajoservice.guardaCliente(objs.c);
			}
			$scope.movimientosVO.bndMovimiento="cliente";
			$scope.movimientosVO.saldo=$scope.otvo.ot.saldoMov;
			ordenTrabajoservice.addMov($scope.movimientosVO).then(function(data){
				$window.location.reload();
			});
		}else{
			if($scope.tipoResguardo){
				ordenTrabajoservice.guardaCliente(objs.b);
			}
			$scope.movimientosVO.bndMovimiento="asesor";
			$scope.movimientosVO.saldo=$scope.otvo.ot.saldoCom;
			ordenTrabajoservice.addMov($scope.movimientosVO).then(function(data){
				$window.location.reload();
			});
		}
	} 
	
	
	//Verifica si el tipo de operacion es de Resguardo
	$scope.isResguardo=function(operacion){
		$scope.errorSaldo="";
		var objs= operacionesMovimientosService.isResguardo(operacion, $scope.operaciones,$scope.tipoResguardo, $scope.otvo.ot);
		$scope.mov= objs.op;
		$scope.otvo.ot= objs.datos;
		$scope.tipoResguardo=objs.resguardo;
	}
	
	//Carga campos de detalle Cheque
	$scope.detalleCheque=function(index, operacion){
		$scope.cheque =operacionesMovimientosService.detalleCheque(index, operacion, $scope.otvo,$scope.cheque);
	}
	
	$scope.verificarSaldo=function(operacion){
		var objs= operacionesMovimientosService.verificarSaldo(operacion, $scope.otvo,$scope.otvo.ot, $scope.operaciones,$scope.montoRetorno,$scope.sumaMontoBrok);
		$scope.errorSaldo= objs.error;
		
		if($scope.errorSaldo==" "){
			$scope.dis=false;
		}else{
			$scope.dis=true;
		}
		if(operacion == 'OPC'){
			$scope.otvo.ot.saldoMov = objs.saldo;
			
		}else{
			$scope.otvo.ot.saldoCom= objs.saldo;
		}
	}

	$scope.limpiarMov=function(){
		$scope.mov.tipo= null;
		$scope.mov.monto= null;
		$scope.mov.descripcion= null;
		$scope.mov.banco= null;
		$scope.mov.cuenta= null;
		$scope.mov.fecha= null;
		$scope.mov.numTransaccion= null;	
		$scope.mov.fecha=new Date();
		$scope.mov.estatus= null;
		$scope.mov.montoLetra= null;
		$scope.mov.pagarA= null;
		$scope.mov.fEmision= new Date();
	}
	
	$scope.regresar=function(){
			$location.path("/listaOTs");
			$window.location.reload();
	}
}]);	
