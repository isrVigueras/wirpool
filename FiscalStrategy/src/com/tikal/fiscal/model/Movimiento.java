package com.tikal.fiscal.model;

import java.util.Date;

public class Movimiento {
	private Long id_cuenta;
	private Long cuentaCliente;
	private float monto;
	private String numTransaccion; //proporcionado por el banco
	private Date fecha;
	private String banco;
	private String cuenta;
	private String estatus;
	private String info;
	private String moneda;
	private String tipo;
}
