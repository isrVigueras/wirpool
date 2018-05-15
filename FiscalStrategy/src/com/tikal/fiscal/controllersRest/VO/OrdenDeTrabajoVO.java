package com.tikal.fiscal.controllersRest.VO;

import java.util.List;

import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.Usuario;

public class OrdenDeTrabajoVO {
	
	private OrdenDeTrabajo ot;
	
	private Cliente cliente;
	
	private Cliente broker;
	
	private List<Cliente> brokers;
	
	private List<PagoRecibido> pagos;
	
	private List<Movimiento> movimientos;
	
	private List<Movimiento> comisiones;
	
	private Usuario responsable;
	
	private boolean notificar;
	

	public List<Movimiento> getMovimientos() {
		return movimientos;
	}

	public void setMovimientos(List<Movimiento> movimientos) {
		this.movimientos = movimientos;
	}

	public List<Movimiento> getComisiones() {
		return comisiones;
	}

	public void setComisiones(List<Movimiento> comisiones) {
		this.comisiones = comisiones;
	}

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

	public Usuario getResponsable() {
		return responsable;
	}

	public void setResponsable(Usuario responsable) {
		this.responsable = responsable;
	}

	public List<PagoRecibido> getPagos() {
		return pagos;
	}

	public void setPagos(List<PagoRecibido> pagos) {
		this.pagos = pagos;
	}

	public boolean isNotificar() {
		return notificar;
	}

	public void setNotificar(boolean notificar) {
		this.notificar = notificar;
	}

	public List<Cliente> getBrokers() {
		return brokers;
	}

	public void setBrokers(List<Cliente> brokers) {
		this.brokers = brokers;
	}

}
