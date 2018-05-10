package com.tikal.fiscal.model;

import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Movimiento {
	
	@Id
	private Long id;
	
	@Index
	private Long id_cuenta;
	@Index 
	private Date fechaCreacion;
	private float monto;
	
	@Index
	private String numTransaccion; //proporcionado por el banco
	@Index
	private Date fecha;
	@Index
	private String empresa;
	private String banco;
	private String cuenta;
	private String estatus;
	private String info;
	private String moneda;
	private Date fEmision;
	private String montoLetra;
	private String pagarA;
	@Index
	private String tipo;
	@Index
	private Long idCliente;
	@Index
	private boolean resguardo;
	@Index
	private Long idOrden;
	private String descripcion;
	private Long idresponsable;
	
	
	
	public Long getIdresponsable() {
		return idresponsable;
	}
	public void setIdresponsable(Long idresponsable) {
		this.idresponsable = idresponsable;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public Long getId_cuenta() {
		return id_cuenta;
	}
	public void setId_cuenta(Long id_cuenta) {
		this.id_cuenta = id_cuenta;
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
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Date getFechaCreacion() {
		return fechaCreacion;
	}
	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}
	public Date getfEmision() {
		return fEmision;
	}
	public void setfEmision(Date fEmision) {
		this.fEmision = fEmision;
	}
	public String getMontoLetra() {
		return montoLetra;
	}
	public void setMontoLetra(String montoLetra) {
		this.montoLetra = montoLetra;
	}
	public String getPagarA() {
		return pagarA;
	}
	public void setPagarA(String pagarA) {
		this.pagarA = pagarA;
	}
	public String getEmpresa() {
		return empresa;
	}
	public void setEmpresa(String empresa) {
		this.empresa = empresa;
	}
	public Long getIdCliente() {
		return idCliente;
	}
	public void setIdCliente(Long idCliente) {
		this.idCliente = idCliente;
	}
	public boolean isResguardo() {
		return resguardo;
	}
	public void setResguardo(boolean resguardo) {
		this.resguardo = resguardo;
	}
	public Long getIdOrden() {
		return idOrden;
	}
	public void setIdOrden(Long idOrden) {
		this.idOrden = idOrden;
	}
	
	
}
