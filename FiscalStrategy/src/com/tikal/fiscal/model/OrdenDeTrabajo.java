package com.tikal.fiscal.model;

import java.util.Date;
import java.util.List;

public class OrdenDeTrabajo {
	
	private Long id;
	private Long idResponsable;
	private Long idCliente;
	private List<Movimiento> comisiones;
	private float resguardo;
	private Long idBrocker;
	private List<Movimiento> movimientos;
	private Date fechaInicio;
	private Date fechaCierre;
	private String tipo;
	private Long idPago;
}
