package com.tikal.fiscal;

import com.googlecode.objectify.ObjectifyService;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.Usuario;

public class EntityRegister {
	public EntityRegister(){
		this.registrar(PagoRecibido.class);
		this.registrar(Usuario.class);
	}
	
	private <T> void registrar(Class<T> clase) {
		ObjectifyService.register(clase);
	}
}
