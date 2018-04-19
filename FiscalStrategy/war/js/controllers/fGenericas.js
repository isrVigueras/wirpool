function calcularSaldo(prox,tipoOP, arrMov, total,importe,totalOP){
	var sumatoria= 0;
	var arreglo = null;
	var monto=null;
	var saldo=0;

	for(var i in arrMov){
		if(arrMov[i].estatus== 'ACTIVO'){
			sumatoria= sumatoria + arrMov[i].monto;
		};
	}
	sumatoria =  sumatoria + prox;
	if(tipoOP=="base"){
		saldo= ((parseFloat(total) + parseFloat(importe)) - sumatoria).toFixed(2);
	}else{
		saldo= (totalOP - sumatoria).toFixed(2);
	}
	
	return saldo;
}
function calcularSaldoOP(operacion,prox, arrMov, total,importe,totalOP){
	var sumatoria= 0;
	var arreglo = null;
	var monto=null;
	var saldo=0;

	for(var i in arrMov){
		if(arrMov[i].estatus== 'ACTIVO'){
			sumatoria= sumatoria + arrMov[i].monto;
		};
	}
	sumatoria =  sumatoria + prox;
	if(operacion=="OPC"){
	saldo= (parseFloat(totalOP) - sumatoria).toFixed(2);
	}else{
	saldo= ((parseFloat(total) + parseFloat(importe)) - sumatoria).toFixed(2);
	}
	return saldo;
}
function calcularSaldoCA(prox, arrMov, total){
	var sumatoria= 0;
	var arreglo = null;
	var monto=null;
	var saldo=0;

	for(var i in arrMov){
		if(arrMov[i].estatus== 'ACTIVO'){
			sumatoria= sumatoria + arrMov[i].monto;
		};
	}
	sumatoria =  sumatoria + prox;
	saldo= (parseFloat(total) - sumatoria).toFixed(2);
	return saldo;
}

function TiposOperacion (){
	var tiposOp = [{id:1, nombre: "Transfer"},{id:2, nombre: "Resguardo"} ,{id:3, nombre: "Efectivo"},{id:3, nombre: "Cheque"}];
	return tiposOp;
}

function catalogoBancos(){
	var catBancos = [{ id:1, nombre: "ABC Capital"},
					{ id:2, nombre: "American Express Bank (M\u00E9xico)"},
					{ id:3, nombre: "Banca Afirme"},
					{ id:4, nombre: "banca Mifel"},
					{ id:5, nombre: "Banco Actinver"},
					{ id:6, nombre: "Banco Ahorro Famsa"},
					{ id:7, nombre: "Banco Autofin M\u00E9xico"},
					{ id:8, nombre: "Banco Azteca"},
					{ id:9, nombre: "Banco Bancrea"},
					{ id:10, nombre: "Banco Base"},
					{ id:11, nombre: "Banco Compartamos"},
					{ id:12, nombre: "Banco Credit Suisse (M\u00E9xico)"},
					{ id:13, nombre: "Banco del Bajio"},
					{ id:14, nombre: "Banco Forjadores"},
					{ id:15, nombre: "Banco Inbursa"},
					{ id:16, nombre: "Banco Inmobiliario M\u00E9xico"},
					{ id:17, nombre: "Banco Interacciones"},
					{ id:18, nombre: "Banco Invex"},
					{ id:19, nombre: "Banco JP Morgan"},
					{ id:20, nombre: "Banco Mercantil del Norte (Banorte)"},
					{ id:21, nombre: "Banco Monex"},
					{ id:22, nombre: "Banco Multiva"},
					{ id:23, nombre: "Banco Nacional de M\u00E9xico (Banamex)"},
					{ id:24, nombre: "Banco Pagatodo"},
					{ id:25, nombre: "Banco Regional de Monterrey"},
					{ id:26, nombre: "Banco Santander (M\u00E9xico)"},
					{ id:27, nombre: "Banco Ve Por Mas"},
					{ id:28, nombre: "Banco Wal-Mart de M\u00E9xico"},
					{ id:29, nombre: "Bancoppel"},
					{ id:30, nombre: "Bank of America M\u00E9xico"},
					{ id:31, nombre: "Bank of Tokyo-Mitsubishi UFJ (M\u00E9xico)"},
					{ id:32, nombre: "Bankaool"},
					{ id:33, nombre: "Bansi"},
					{ id:34, nombre: "Barclays Bank M\u00E9xico"},
					{ id:35, nombre: "BBVA Bancomer"},
					{ id:36, nombre: "CiBanco"},
					{ id:37, nombre: "ConsuBanco"},
					{ id:38, nombre: "Deutsche Bank M\u00E9xico"},
					{ id:39, nombre: "Fundaci\u00F3n Donde Banco"},
					{ id:40, nombre: "HSBC M\u00E9xico"},
					{ id:41, nombre: "Intercam Banco"},
					{ id:42, nombre: "Investa Bank"},
					{ id:43, nombre: "Mercantil del Norte (Banorte)"},
					{ id:44, nombre: "Scotiabank Inverlat"},
					{ id:45, nombre: "UBS Bank M\u00E9xico"},
					{ id:46, nombre: "Volkswagen Bank"},

	  			  ];

	return catBancos;
}
//function catalogoBancos(){
//	var catBancos = [{id:1, nombre: "Banco Nacional de M\u00E9xico (Banamex)"},
//	  			   {id:2, nombre: "Banco Santander (M\u00E9xico)"}, 
//	  			   {id:3, nombre: "Scotiabank Inverlat"},
//	  			   {id:90, nombre: "HSBC M\u00E9xico"},
//	  			   {id:4, nombre: "BBVA Bancomer"},
//	  			   {id:5, nombre: "Banco Mercantil del Norte (Banorte)"},
//	  			   {id:6, nombre: "Mercantil del Norte (Banorte)"},
//	  			   {id:7, nombre: "Banco Interacciones"},
//	  			   {id:8, nombre: "Banco Inbursa"},
//	  			   {id:9, nombre: "banca Mifel"},
//	  			   {id:10, nombre: "Banco Regional de Monterrey"},
//	  			   {id:11, nombre: "Banco Invex"},
//	  			   {id:12, nombre: "Banco del Bajio"},
//	  			   {id:13, nombre: "Bansi"},
//	  			   {id:14, nombre: "Banca Afirme"},
//	  			   {id:15, nombre: "Bank of America M\u00E9xico"},
//	  			   {id:16, nombre: "Banco JP Morgan"},		   
//	  			   {id:17, nombre: "Banco Ve Por Mas"},
//	  			   {id:18, nombre: "American Express Bank (M\u00E9xico)"},
//	  			   {id:19, nombre: "Investa Bank"},
//	  			   {id:20, nombre: "CiBanco"},
//	  			   {id:21, nombre: "Bank of Tokyo-Mitsubishi UFJ (M\u00E9xico)"},
//	  			   {id:22, nombre: "Banco Monex"},
//	  			   {id:23, nombre: "Deutsche Bank M\u00E9xico"},
//	  			   {id:24, nombre: "Banco Azteca"},
//	  			   {id:25, nombre: "Banco Credit Suisse (M\u00E9xico)"},
//	  			   {id:26, nombre: "Banco Autofin M\u00E9xico"},
//	  			   {id:27, nombre: "Barclays Bank M\u00E9xico"},
//	  			   {id:28, nombre: "Banco Ahorro Famsa"},
//	  			   {id:29, nombre: "Intercam Banco"},
//	  			   {id:30, nombre: "ABC Capital"},
//	  			   {id:31, nombre: "Banco Actinver"},
//	  			   {id:32, nombre: "Banco Compartamos"},
//	  			   {id:33, nombre: "Banco Multiva"},
//	  			   {id:34, nombre: "UBS Bank M\u00E9xico"},
//	  			   {id:35, nombre: "Bancoppel"},
//	  			   {id:36, nombre: "ConsuBanco"},
//	  			   {id:37, nombre: "Banco Wal-Mart de M\u00E9xico"},
//	  			   {id:38, nombre: "Volkswagen Bank"},
//	  			   {id:39, nombre: "Banco Base"},
//	  			   {id:40, nombre: "Banco Pagatodo"},
//	  			   {id:41, nombre: "Banco Forjadores"},
//	  			   {id:42, nombre: "Bankaool"},
//	  			   {id:43, nombre: "Banco Inmobiliario M\u00E9xico"},
//	  			   {id:44, nombre: "Fundaci\u00F3n Donde Banco"},
//	  			   {id:45, nombre: "Banco Bancrea"},
//	  			  ];
//
//	return catBancos;
//}


function formatoFecha(fecha){
	if(fecha){
		var date = new Date(fecha);
		var result= date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
		return result;
	}
}
function blurFunction(mont) {

	var Num = numeral(mont).format('0,0.00');
	console.log(Num);
	return Num;
}

