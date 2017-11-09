package com.tikal.fiscal.model;

import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Movimiento {
	@Id
	private Long id_cuenta;
	@Index
	private Long cuentaCliente;
	private float monto;
	
	@Index
	private String numTransaccion; //proporcionado por el banco
	@Index
	private Date fecha;
	private String banco;
	private String cuenta;
	private String estatus;
	private String info;
	private String moneda;
	@Index
	private String tipo;
	public Long getId_cuenta() {
		return id_cuenta;
	}
	public void setId_cuenta(Long id_cuenta) {
		this.id_cuenta = id_cuenta;
	}
	public Long getCuentaCliente() {
		return cuentaCliente;
	}
	public void setCuentaCliente(Long cuentaCliente) {
		this.cuentaCliente = cuentaCliente;
	}
	public float getMonto() {
		return monto;
	}
	public void setMonto(float monto) {
		this.monto = monto;
	}
	public String getNumTransaccion() {
		return numTransaccion;
	}
	public void setNumTransaccion(String numTransaccion) {
		this.numTransaccion = numTransaccion;
	}
	public Date getFecha() {
		return fecha;
	}
	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}
	public String getBanco() {
		return banco;
	}
	public void setBanco(String banco) {
		this.banco = banco;
	}
	public String getCuenta() {
		return cuenta;
	}
	public void setCuenta(String cuenta) {
		this.cuenta = cuenta;
	}
	public String getEstatus() {
		return estatus;
	}
	public void setEstatus(String estatus) {
		this.estatus = estatus;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public String getMoneda() {
		return moneda;
	}
	public void setMoneda(String moneda) {
		this.moneda = moneda;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	
	
}
