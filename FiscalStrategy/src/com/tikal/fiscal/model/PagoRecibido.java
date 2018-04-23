package com.tikal.fiscal.model;

import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class PagoRecibido {
	
	@Id
	private Long id;
	@Index
	private String cuenta;
	private String empresa;
	private String banco;
	private String clabe;
	@Index
	private Date fecha;
	@Index
	private Long id_brocker;
	@Index
	private Long id_cliente;
	private float monto;
	private String moneda;
	@Index
	private String referencia;
	@Index
	private Long ot;
	@Index
	private boolean validado= false;
	private String descripcion;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCuenta() {
		return cuenta;
	}
	public void setCuenta(String cuenta) {
		this.cuenta = cuenta;
	}
	public String getBanco() {
		return banco;
	}
	public void setBanco(String banco) {
		this.banco = banco;
	}
	public Date getFecha() {
		return fecha;
	}
	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}
	public Long getId_brocker() {
		return id_brocker;
	}
	public void setId_brocker(Long id_brocker) {
		this.id_brocker = id_brocker;
	}
	public Long getId_cliente() {
		return id_cliente;
	}
	public void setId_cliente(Long id_cliente) {
		this.id_cliente = id_cliente;
	}
	public float getMonto() {
		return monto;
	}
	public void setMonto(float monto) {
		this.monto = monto;
	}
	public String getMoneda() {
		return moneda;
	}
	public void setMoneda(String moneda) {
		this.moneda = moneda;
	}
	public String getClabe() {
		return clabe;
	}
	public void setClabe(String clabe) {
		this.clabe = clabe;
	}
	public String getReferencia() {
		return referencia;
	}
	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}
	public Long getOt() {
		return ot;
	}
	public void setOt(Long ot) {
		this.ot = ot;
	}
	public boolean isValidado() {
		return validado;
	}
	public void setValidado(boolean validado) {
		this.validado = validado;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public String getEmpresa() {
		return empresa;
	}
	public void setEmpresa(String empresa) {
		this.empresa = empresa;
	}
	
}
