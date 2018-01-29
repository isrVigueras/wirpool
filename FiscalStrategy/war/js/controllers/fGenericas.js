function calcularSaldo(arrMov, total,importe){
	var sumatoria= 0;
	var arreglo = null;
	var monto=null;
	var saldo=0;

	for(var i in arrMov){
		if(arrMov[i].estatus== 'ACTIVO'){
			sumatoria= sumatoria + arrMov[i].monto;
		};
	}
	saldo= ((parseFloat(total) + parseFloat(importe)) - sumatoria).toFixed(2);
	return saldo;
}


function TiposOperacion (){
	var tiposOp = [{id:1, nombre: "20-Transfer"},{id:2, nombre: "40-Resguardo"} ,{id:3, nombre: "60-Efectivo"}];
	return tiposOp;
}


