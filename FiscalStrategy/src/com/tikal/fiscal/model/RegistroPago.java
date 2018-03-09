package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;

@Entity
public class RegistroPago extends PagoRecibido{

	@Index
	private String estatus;

	public RegistroPago(){
		this.estatus= "PENDIENTE";
	}
	
	public String getEstatus() {
		return estatus;
	}

	public void setEstatus(String estatus) {
		this.estatus = estatus;
	}
	
	
}
