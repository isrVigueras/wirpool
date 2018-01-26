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
