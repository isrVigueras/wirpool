package com.tikal.fiscal.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class OrdenDeTrabajo {
	
	@Id
	private Long id;
	@Index
	private Long idResponsable;
	@Index
	private Long idCliente;
	private List<Movimiento> comisiones;
	private float resguardo;
	@Index
	private Long idBrocker;
	private List<Movimiento> movimientos;
	@Index
	private Date fechaInicio;
	@Index
	private Date fechaCierre;
	
	private String tipo;
	@Index
	private Long idPago;
	@Index
	private String estatus;
	
	private String nombreCliente;
	
	private float porLic;
	private float porBrok;
	private float porDes;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getIdResponsable() {
		return idResponsable;
	}
	public void setIdResponsable(Long idResponsable) {
		this.idResponsable = idResponsable;
	}
	public Long getIdCliente() {
		return idCliente;
	}
	public void setIdCliente(Long idCliente) {
		this.idCliente = idCliente;
	}
	public List<Movimiento> getComisiones() {
		return comisiones;
	}
	public void setComisiones(List<Movimiento> comisiones) {
		this.comisiones = comisiones;
	}
	public float getResguardo() {
		return resguardo;
	}
	public void setResguardo(float resguardo) {
		this.resguardo = resguardo;
	}
	public Long getIdBrocker() {
		return idBrocker;
	}
	public void setIdBrocker(Long idBrocker) {
		this.idBrocker = idBrocker;
	}
	public List<Movimiento> getMovimientos() {
		if(this.movimientos==null){
			this.movimientos= new ArrayList<Movimiento>();
		}
		return movimientos;
	}
	
	public void addMovimiento(Movimiento m){
		this.getMovimientos().add(m);
	}
	
	public void setMovimientos(List<Movimiento> movimientos) {
		this.movimientos = movimientos;
	}
	public Date getFechaInicio() {
		return fechaInicio;
	}
	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}
	public Date getFechaCierre() {
		return fechaCierre;
	}
	public void setFechaCierre(Date fechaCierre) {
		this.fechaCierre = fechaCierre;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Long getIdPago() {
		return idPago;
	}
	public void setIdPago(Long idPago) {
		this.idPago = idPago;
	}
	public String getEstatus() {
		return estatus;
	}
	public void setEstatus(String estatus) {
		this.estatus = estatus;
	}
	public String getNombreCliente() {
		return nombreCliente;
	}
	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
	public float getPorLic() {
		return porLic;
	}
	public void setPorLic(float porLic) {
		this.porLic = porLic;
	}
	public float getPorBrok() {
		return porBrok;
	}
	public void setPorBrok(float porBrok) {
		this.porBrok = porBrok;
	}
	public float getPorDes() {
		return porDes;
	}
	public void setPorDes(float porDes) {
		this.porDes = porDes;
	}
	
	
}
