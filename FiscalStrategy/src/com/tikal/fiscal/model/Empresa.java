package com.tikal.fiscal.model;

import java.util.ArrayList;
import java.util.List;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Empresa {

	@Id private Long id;
	
	@Index private String nombre;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

//	public List<Long> getCuentas() {
//		return cuentas;
//	}
//
//	public void setCuentas(List<Long> cuentas) {
//		if(this.cuentas==null){
//			this.cuentas= new ArrayList<Long>();
//		}
//		this.cuentas = cuentas;
//	}
//	
//	public void addCuenta(Long idCuenta){
//		if(this.cuentas==null){
//			this.cuentas= new ArrayList<Long>();
//		}
//		this.cuentas.add(idCuenta);
//	}
	
}
