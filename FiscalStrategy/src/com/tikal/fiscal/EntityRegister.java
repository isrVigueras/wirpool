package com.tikal.fiscal;

import com.googlecode.objectify.ObjectifyService;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.CuentaCliente;
import com.tikal.fiscal.model.Empresa;
import com.tikal.fiscal.model.FolioOT;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.Notificacion;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.RegistroPago;
import com.tikal.fiscal.model.Usuario;

public class EntityRegister {
	public EntityRegister(){
		this.registrar(PagoRecibido.class);
		this.registrar(Usuario.class);
		this.registrar(CuentaCliente.class);
		this.registrar(OrdenDeTrabajo.class);
		this.registrar(Cliente.class);
		this.registrar(Cuenta.class);
		this.registrar(Movimiento.class);
		this.registrar(FolioOT.class);
		this.registrar(Notificacion.class);
		this.registrar(RegistroPago.class);
		this.registrar(Empresa.class);
	}
	
	private <T> void registrar(Class<T> clase) {
		ObjectifyService.register(clase);
	}
}
