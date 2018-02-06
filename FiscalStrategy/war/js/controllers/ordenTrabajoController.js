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
	
	this.addMov=function(ot){
		var d = $q.defer();
		$http.post("ots/addMovimiento/",ot).then(
			function(response) {
				d.resolve(response.data);
			});
		return d.promise;
	}
	
	this.updateot=function(ot){
		var d = $q.defer();
		$http.post("movimientos/update/",ot).then(
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
	$scope.errorSaldo=" ";
	
	$scope.pago={
			fecha: new Date(),
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
			totalComisiones: null,
	}
	
	$scope.tiposOp = TiposOperacion();
	
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
		var renglon= {cliente:$scope.datos.nombreCliente, fecha:$scope.pago.fecha,banco:$scope.pago.banco, cuenta:$scope.pago.cuenta, monto:$scope.pago.monto, moneda:$scope.pago.moneda}
		$scope.otVO.pagos.push(renglon);
		$scope.tablaPagos=true;
		$scope.limpiaPago();
		$scope.calcularImporte();
		$scope.calcularMontos('Todos');
		if($scope.otVO.pagos.length == 0){
			$scope.calcularRetorno();
		}
		
	}
	
	$scope.addBroker = function(){
		var cont = $scope.brokers.length;
		cont = cont + 1;
		var nombre =  'Broker' + cont ;
		var renglon= {nombre:nombre, porBrok: null , montoBrok:null}
		$scope.brokers.push(renglon);
	}
	
	$scope.addOper= function(operacion){
		if($scope.operaciones.tipo != null && $scope.operaciones.descripcion != null && $scope.operaciones.monto != null){
			var renglon= {tipo: $scope.operaciones.tipo, descripcion: $scope.operaciones.descripcion , monto:$scope.operaciones.monto, estatus:$scope.operaciones.estatus}
			if(operacion=='OPC'){
				$scope.otVO.movimientos.push(renglon);
				$scope.tablaOper=true;
				//$scope.datos.saldoMov= calcularSaldo($scope.otVO.movimientos,$scope.montoRetorno,$scope.datos.importe);
			}else{
				$scope.otVO.comisiones.push(renglon);
				$scope.tablaOperAsesor=true;
				//$scope.datos.saldoCom=calcularSaldo($scope.otVO.comisiones,$scope.sumaMontoBrok,0);
			}
			$scope.operaciones.tipo=null;
			$scope.operaciones.descripcion=null;
			$scope.operaciones.monto=null; 
		}else{ 
			alert("No se registraron datos");
		}
	} 
	
	$scope.verificarSaldo=function(operacion){
		var cantidad = 0;
		if(operacion== 'OPC'){
			if($scope.otVO.movimientos.length != 0){
				cantidad= calcularSaldo($scope.operaciones.monto,$scope.otVO.movimientos,$scope.montoRetorno,$scope.datos.importe);
			}else{
				cantidad= ((parseFloat($scope.montoRetorno) + parseFloat($scope.datos.importe)) - $scope.operaciones.monto).toFixed(2);
			}
		}else{
			if($scope.otVO.comisiones.length != 0){
				cantidad=calcularSaldo($scope.operaciones.monto,$scope.otVO.comisiones,$scope.sumaMontoBrok,0);
			}else{
				cantidad= (parseFloat($scope.sumaMontoBrok) - $scope.operaciones.monto).toFixed(2);
			}
			
		}
		
		if(cantidad > 0 && operacion=='OPC'){
			$scope.errorSaldo=" ";
			$scope.datos.saldoMov = cantidad;
		}else{
			if(cantidad > 0 && operacion=='OPA'){
				$scope.errorSaldo=" ";
				$scope.datos.saldoCom = cantidad;
			}else{
				$scope.errorSaldo = "* ERROR: EL monto sobrepasa el saldo establecido * ";	
			}
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
	
	$scope.guardarOT=function(){ 
		if($scope.tablaPagos == true){
			if($scope.datos.porLic != null || $scope.datos.porDes != null || $scope.datos.porBrok.length != 0){
				if($scope.tablaOper == true && $scope.tablaOperAsesor == true){
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
		$scope.errorSaldo=" ";
	}
	
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
		$scope.datos.totalComisiones =  null;
		$scope.otVO.pagos= [];
		$scope.otVO.movimientos=[];
		$scope.otVO.comisiones=[];
		$scope.limpiaPago();
		$scope.limpiaComisiones();
		
	}
	
}]);


app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice',function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice){
	var indice = null;
	var tipoOperacion= null;
	$scope.tiposOp = TiposOperacion();
	$scope.perfil=false;
	$scope.errorSaldo=" ";
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
		console.log($scope.otvo);
		if($scope.otvo.responsable.perfil=="Ejecutivo"){
			$scope.perfil=true;
		}
		var sumaMontoPagos =0;
		 $scope.sumaMontoBrok =0;
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
			$scope.sumaMontoBrok= parseInt($scope.sumaMontoBrok) + parseInt($scope.otvo.ot.montoBrok[i]);
		}
		
		$scope.montoRetorno=(($scope.otvo.ot.retorno/100)*$scope.otvo.ot.importe).toFixed(2);
		$scope.montosTotal = parseInt($scope.otvo.ot.montoLic)+ parseInt($scope.otvo.ot.montoDes) + parseInt($scope.sumaMontoBrok) + parseInt($scope.montoRetorno);
		
		$scope.cancelarOp = function(index,	operacion){
			if(operacion=="OPC"){
				$scope.otvo.movimientos[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoMov=calcularSaldo($scope.otvo.movimientos,$scope.montoRetorno,$scope.otvo.ot.importe);
				ordenTrabajoservice.updateot($scope.otvo.movimientos[index]).then(function(data){
					$window.location.reload();
				});
			}
			if(operacion=="OPA"){
				$scope.otvo.comisiones[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoCom=calcularSaldo($scope.otvo.comisiones,$scope.sumaMontoBrok, 0);
				ordenTrabajoservice.updateot($scope.otvo.comisiones[index]).then(function(data){
					$window.location.reload();
				});
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
			ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
				$window.location.reload();
			});
		}else{
			$scope.otvo.comisiones[indice].banco=$scope.mov.banco;
			$scope.otvo.comisiones[indice].cuenta=$scope.mov.cuenta;
			ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
				$window.location.reload();
			});
		}
		$scope.limpiarMov();
	}
	
	$scope.validMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.movimientos[indice].fecha=$scope.mov.fecha;
			$scope.otvo.movimientos[indice].estatus="VALIDADO"
				ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
					$window.location.reload();
				});
		}else{
			$scope.otvo.comisiones[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.comisiones[indice].fecha=$scope.mov.fecha;
			$scope.otvo.comisiones[indice].estatus="VALIDADO"
				ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
					$window.location.reload();
				});
		}
		$scope.limpiarMov();
	}
	
	
	$scope.addOper= function(operacion){
		if($scope.operaciones.tipo != null && $scope.operaciones.descripcion != null && $scope.operaciones.monto != null){
			var renglon= {tipo: $scope.operaciones.tipo, descripcion: $scope.operaciones.descripcion , monto:$scope.operaciones.monto, estatus:"ACTIVO"}
			if(operacion=='OPC'){
				$scope.otvo.movimientos.push(renglon);
				//$scope.otvo.ot.saldoMov= calcularSaldo($scope.otvo.movimientos,$scope.montoRetorno,$scope.otvo.ot.importe);
			}else{
				$scope.otvo.comisiones.push(renglon);
				//$scope.otvo.ot.saldoCom= calcularSaldo($scope.otvo.comisiones,$scope.sumaMontoBrok,0);
			}

			ordenTrabajoservice.addot($scope.otvo).then(function(data){
				$window.location.reload();
			});
		}else{
			alert("No se registraron datos");
		}
	}
	
	$scope.verificarSaldo=function(operacion){
		var cantidad= 0;
		if(operacion== 'OPC'){
			cantidad= calcularSaldo($scope.otvo.movimientos,$scope.montoRetorno,$scope.otvo.ot.importe);
		}else{
			cantidad= calcularSaldo($scope.otvo.comisiones,$scope.sumaMontoBrok,0);	
		}

		if(cantidad > 0 && operacion=='OPC'){
			$scope.errorSaldo=" ";
			$scope.otvo.ot.saldoMov = cantidad;
		}else{
			if(cantidad > 0 && operacion=='OPA'){
				$scope.errorSaldo=" ";
				$scope.otvo.ot.saldoCom = cantidad;
			}else{
				$scope.errorSaldo = "* ERROR: EL monto sobrepasa el saldo establecido *";	
			}
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
	}
	
	$scope.regresar=function(){
			$location.path("/listaOTs");
			$window.location.reload();
	}
	
	$scope.limpiaOperaciones= function(){
		$scope.operaciones.tipo= null;
		$scope.operaciones.descripcion= null;
		$scope.operaciones.monto= null;
		$scope.errorSaldo=" ";
	}
	
}]);	
