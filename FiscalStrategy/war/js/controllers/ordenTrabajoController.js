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

app.service("operacionesMovimientosService",['$http', '$q', function($http, $q){
	this.addOper= function(operacion, operaciones, otVO, bndResguardo){
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
			otVO.movimientos.push(renglon);
			return otVO;
		}else{
			otVO.comisiones.push(renglon);
			return otVO;
		}
	} 
	
	this.isResguardo=function(operacion, operaciones,bndResguardo, datos){
		objetos={op: null,datos: null, resguardo:null}
		if(operaciones.tipo=='Resguardo'){
			var mensaje = confirm("Esta opcion mueve el saldo actual a la cuenta de resguardo.. Deseas continuar?");
			if (mensaje) {
				bndResguardo = true;
				if(operacion=='OPC'){
					if(datos.saldoMov > 0){
						operaciones.monto= datos.saldoMov * 1;
						operaciones.descripcion= "Se va a cuenta de resguardo";
						datos.saldoMov= 0;
					}else{
						alert("No se tiene saldo acumulado");
						bndResguardo = false;
						operaciones.descripcion ="";
					}
					
				}else{
					if(datos.saldoCom > 0){
						operaciones.monto= datos.saldoCom * 1;
						operaciones.descripcion= "Se va a cuenta de resguardo";
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
			objetos.error="* ERROR: EL monto sobrepasa el saldo establecido * "; 
		}
		
		return objetos;
	}
	
}]);

app.controller("OTsAddController",['$scope','$cookieStore', '$window', '$location', 'ordenTrabajoservice','cuentaservice','operacionesMovimientosService', function($scope, $cookieStore, $window, $location, ordenTrabajoservice,cuentaservice,operacionesMovimientosService){
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
		fecha: new Date(),
		montoLetra: null,
		pagarA: null,
		fEmision: new Date(),
	}
	
	$scope.otVO={
			ot: null,
			pagos:[],
			movimientos:[],	
			comisiones:[]
	}
	
	$scope.cheque={
			fEmision: null,
			pagarA:null,
			monto:null,
			montoLetra:null
	}
	
	$scope.addPago=function(){
		for(var i in $scope.cliente){
			if($scope.cliente[i].id == $scope.datos.idCliente){
				$scope.datos.nombreCliente = $scope.cliente[i].nickname;
			}
		}
		var renglon= {cliente:$scope.datos.nombreCliente, fecha:$scope.pago.fecha, banco:$scope.pago.banco, cuenta:$scope.pago.cuenta, monto:$scope.pago.monto, moneda:$scope.pago.moneda}
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
	
	$scope.verificarSaldo=function(operacion){
		var objs= operacionesMovimientosService.verificarSaldo(operacion, $scope.otVO, $scope.datos, $scope.operaciones,$scope.montoRetorno,$scope.sumaMontoBrok);
		$scope.errorSaldo= objs.error;
		if(operacion =='OPC'){
			$scope.datos.saldoMov = objs.saldo;
		}else{
			$scope.datos.saldoCom = objs.saldo;
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
	

	$scope.addOper= function(operacion){
		$scope.otVO=operacionesMovimientosService.addOper(operacion,$scope.operaciones, $scope.otVO, $scope.tipoResguardo);	
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


app.controller("ordenTrabajoController",['$scope','$window', '$location', '$cookieStore','ordenTrabajoservice','usuarioservice','brockerservice','operacionesMovimientosService',function($scope, $window, $location, $cookieStore, ordenTrabajoservice,usuarioservice,brockerservice,operacionesMovimientosService){
	var indice = null;
	var tipoOperacion= null;
	$scope.tiposOp = TiposOperacion();
	$scope.bancos = catalogoBancos();
	$scope.perfil=false;
	$scope.errorSaldo=" ";
	$scope.tipoResguardo= false;
	$scope.mov={
		tipo: null,
		monto: null,
		descripcion: null,
		banco: null,
		cuenta: null,
		numTransaccion:null,
		fecha:new Date(),
		estatus: null,
		montoLetra: null,
		pagarA: null,
		fEmision: new Date(),
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
		
		if($scope.otvo.ot.estatus=="Cerrada"){
			alert("Todos los movimeintos han sido validados. Orden de Trabajo Cerrada");
			$scope.ordenCerrada="OT Cerrada";
		}else{
			$scope.ordenCerrada="";
		};
		
		$scope.cancelarOp = function(index,	operacion){
			if(operacion=="OPC"){
				$scope.otvo.movimientos[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoMov=$scope.otvo.ot.saldoMov - $scope.otvo.movimientos[index].monto;
				ordenTrabajoservice.updateot($scope.otvo.movimientos[index]).then(function(data){
					$window.location.reload();
				});
			}
			if(operacion=="OPA"){
				$scope.otvo.comisiones[index].estatus="CANCELADO";
				$scope.otvo.ot.saldoCom=$scope.otvo.ot.saldoCom -$scope.otvo.comisiones[index].monto; 
				ordenTrabajoservice.updateot($scope.otvo.comisiones[index]).then(function(data){
					$window.location.reload();
				});
			}
		}
	});	
	
	function cerrarOrden(){
		var i=0, j=0;
		while(i < $scope.otvo.movimientos.length){
			if($scope.otvo.movimientos[i].estatus=='VALIDADO' || $scope.otvo.movimientos[i].estatus=='CANCELADO'){
				i++;
			}
		}
		while(j < $scope.otvo.comisiones.length){
			if($scope.otvo.comisiones[j].estatus=='VALIDADO' || $scope.otvo.comisiones[j].estatus=='CANCELADO'){
				j++;
			}
		}
		if($scope.otvo.movimientos.length == i && $scope.otvo.comisiones.length==j){
			$scope.otvo.ot.estatus="Cerrada"
			ordenTrabajoservice.addot($scope.otvo).then(function(data){
				return true;
			});
		}else{
			return false;
		}
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
		 ordenTrabajoservice.consultarCuentas($scope.mov.banco).then(function(data){
			 $scope.cuentas= data;
		 }); 
	}
	
	//boton guardar del modal
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
	
	//icon validar
	$scope.validMov=function(){
		if(tipoOperacion=='OPC'){
			$scope.otvo.movimientos[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.movimientos[indice].fecha=$scope.mov.fecha;
			$scope.otvo.movimientos[indice].estatus="VALIDADO"
				ordenTrabajoservice.updateot($scope.otvo.movimientos[indice]).then(function(data){
					cerrarOrden();
				});
		}else{
			$scope.otvo.comisiones[indice].numTransaccion=$scope.mov.numTransaccion;
			$scope.otvo.comisiones[indice].fecha=$scope.mov.fecha;
			$scope.otvo.comisiones[indice].estatus="VALIDADO"
				ordenTrabajoservice.updateot($scope.otvo.comisiones[indice]).then(function(data){
					cerrarOrden();
				});
		}
		$window.location.reload();
	}
	
	//Agregar movimientos
	$scope.addOper= function(operacion){
		$scope.otvo=operacionesMovimientosService.addOper(operacion,$scope.operaciones, $scope.otvo).then(function(data){	
			ordenTrabajoservice.addot($scope.otvo).then(function(data){
				$window.location.reload();
			});
		});
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
		if(operacion == 'OPC'){
			$scope.otvo.ot.saldoMOV = objs.otvo;
		}else{
			$scope.otvo.ot.saldoCom= objs.otvo;
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
