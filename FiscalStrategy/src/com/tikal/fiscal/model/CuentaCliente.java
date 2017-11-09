package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;

@Entity
public class CuentaCliente extends Cuenta{
	@Index
	private Long id_cliente;
	
}
