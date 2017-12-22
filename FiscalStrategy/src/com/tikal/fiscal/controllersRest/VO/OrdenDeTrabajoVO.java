package com.tikal.fiscal.controllersRest.VO;

import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.Usuario;

public class OrdenDeTrabajoVO {
	
	private OrdenDeTrabajo ot;
	
	private Cliente cliente;
	
	private Cliente broker;
	
	private PagoRecibido pago;
	
	private Usuario responsable;

	public OrdenDeTrabajo getOt() {
		return ot;
	}

	public void setOt(OrdenDeTrabajo ot) {
		this.ot = ot;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	public Cliente getBroker() {
		return broker;
	}

	public void setBroker(Cliente broker) {
		this.broker = broker;
	}

	public PagoRecibido getPago() {
		return pago;
	}

	public void setPago(PagoRecibido pago) {
		this.pago = pago;
	}

	public Usuario getResponsable() {
		return responsable;
	}

	public void setResponsable(Usuario responsable) {
		this.responsable = responsable;
	}	
	
}
