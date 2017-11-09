package com.tikal.fiscal;

import com.googlecode.objectify.ObjectifyService;
import com.tikal.fiscal.model.PagoRecibido;

public class EntityRegister {
	public EntityRegister(){
		this.registrar(PagoRecibido.class);
	}
	
	private <T> void registrar(Class<T> clase) {
		ObjectifyService.register(clase);
	}
}
